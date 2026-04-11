import { useState, useEffect, useRef, useCallback } from "react";
import { addToast } from "@heroui/react";
import { useTranslations } from "next-intl";

import {
  fetchChatHistory,
  uploadChatImage,
  fetchCustomerChatContextList,
  deleteCustomerChatContext,
} from "@/services";
import { useUserInfo } from "@/hook/api";
import { queryClient } from "@/lib/react-query";

export interface Message {
  id: number | string;
  sender: "user" | "bot";
  text?: string;
  type?: "TEXT" | "IMAGE" | "ORDER" | "WAYBILL";
  bizCode?: string;
  sending?: boolean;
  createTime?: number;
}

export interface ChatContext {
  id: string;
  bizCode: string;
  title: string;
  type: number;
}

export function useChat(isOpen: boolean, bizCode?: string | null) {
  const t = useTranslations("components.chatbox");
  const { data: user } = useUserInfo();

  const [messages, setMessages] = useState<Message[]>([]);
  const [hasAgent, setHasAgent] = useState(false);

  // Context List State
  const [contextList, setContextList] = useState<ChatContext[]>([]);
  const [loadingContexts, setLoadingContexts] = useState(false);

  // History loading state
  const [page, setPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);

  // Refs for logic (to avoid stale closures and rapid events)
  const socketRef = useRef<WebSocket | null>(null);
  const receiverIdRef = useRef<number | null>(null);
  const shouldScrollRef = useRef(false); // To signal UI to scroll

  // --- Context List Management ---
  const fetchContexts = useCallback(async () => {
    if (!user?.id) return;
    setLoadingContexts(true);
    try {
      const res: any = await fetchCustomerChatContextList(user.id);

      setContextList(res || []);
    } catch {
      console.error("Failed to fetch context list");
    } finally {
      setLoadingContexts(false);
    }
  }, [user?.id]);

  const deleteContext = useCallback(
    async (ctxBizCode: string) => {
      try {
        await deleteCustomerChatContext(ctxBizCode);
        setContextList((prev) =>
          prev.filter((item) => item.bizCode !== ctxBizCode),
        );
        addToast({ title: t("deleteSuccess"), color: "success" });
      } catch {
        addToast({ title: t("deleteFailed"), color: "danger" });
      }
    },
    [t],
  );

  // --- WebSocket Connection ---
  useEffect(() => {
    if (!isOpen || !user?.id) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      return;
    }

    let socket: WebSocket | null = null;
    let retryTimer: NodeJS.Timeout | null = null;
    let retryCount = 0;
    let allowReconnect = true;
    const MAX_RETRY = 5;
    const RETRY_DELAY = 3000;

    const initWebSocket = () => {
      if (!allowReconnect) return;

      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!apiBase) {
        console.error("❌ 缺少 NEXT_PUBLIC_API_BASE_URL");

        return;
      }

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      let wsUrl = "";

      if (apiBase.startsWith("/")) {
        // 如果是相对路径（说明正在用 Next.js 代理 HTTP），由于 WS 无法代理，直接连接后端域名
        wsUrl = `${protocol}://dev.bbdbuy1.com${apiBase}/ws`;
      } else {
        const host = apiBase.replace(/^https?:\/\//, "");

        wsUrl = `${protocol}://${host}/ws`;
      }

      if (socket && socket.readyState === WebSocket.OPEN) return;

      console.log(`🔌 尝试连接 WebSocket (${retryCount + 1}/${MAX_RETRY})`);
      socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket 已连接");
        retryCount = 0;
        if (retryTimer) clearTimeout(retryTimer);
        retryTimer = null;
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.sender === "SERVER" && !receiverIdRef.current) {
            receiverIdRef.current = data.receiverId;
            setHasAgent(true);
          }

          setMessages((prev) => {
            // Remove the temporary local echo message if it exists
            const filtered = data.tempId
              ? prev.filter((m) => m.id !== data.tempId)
              : prev;

            return [
              ...filtered,
              {
                id: data.id || `ws-${Date.now()}-${Math.random()}`,
                sender: data.sender === "CUSTOMER" ? "user" : "bot",
                text: data.content,
                createTime: data.createTime || Date.now(),
                type: data.type || "TEXT",
                bizCode: data.bizCode,
              },
            ];
          });
          shouldScrollRef.current = true;
          // Refresh context list on new messages to ensure up-to-date consultations
          fetchContexts();
        } catch {
          console.error("❌ 解析消息失败:", event.data);
        }
      };

      socket.onclose = (event) => {
        console.warn(`⚠️ WebSocket 关闭 (code=${event.code})`);
        socketRef.current = null;
        if (allowReconnect && retryCount < MAX_RETRY) {
          retryCount++;
          retryTimer = setTimeout(initWebSocket, RETRY_DELAY);
        }
      };

      socket.onerror = (err) => {
        console.error("⚠️ WebSocket 错误:", err);
        socket?.close();
      };
    };

    const timer = setTimeout(initWebSocket, 100);

    return () => {
      allowReconnect = false;
      clearTimeout(timer);
      if (retryTimer) clearTimeout(retryTimer);
      socket?.close();
      socketRef.current = null;
    };
  }, [user?.id, isOpen, fetchContexts]);

  // --- Load History ---
  const loadHistory = useCallback(
    async (initialLoad = false) => {
      if (!user?.id) return;
      if (!initialLoad && (!hasMoreHistory || isLoadingHistory)) return;

      setIsLoadingHistory(true);

      try {
        const currentPage = initialLoad ? 1 : page;
        const res: any = await fetchChatHistory(user.id, currentPage, bizCode);
        const records: any = res.records || [];
        const lastPage: number = res.pages ?? 1;

        const newMessages = records.reverse().map((msg: any) => ({
          id: msg?.id ?? `his-${Date.now()}-${Math.random()}`,
          sender: msg.sender === "CUSTOMER" ? "user" : "bot",
          createTime: msg.createTime,
          type: msg.contentType || "TEXT",
          text: msg.content,
        }));

        if (initialLoad) {
          setMessages((prev) => {
            const sendingMessages = prev.filter((m) => m.sending);

            return [...newMessages, ...sendingMessages];
          });
          setPage(2);
          setHasMoreHistory(1 < lastPage);
          shouldScrollRef.current = true;

          const hisM = records.find((item: any) => item.sender === "SERVER");

          if (hisM) {
            receiverIdRef.current = hisM.userId;
          }
        } else {
          setMessages((prev) => [...newMessages, ...prev]);
          setPage((prev) => prev + 1);
          setHasMoreHistory(currentPage < lastPage);
          shouldScrollRef.current = false;
        }
      } catch (err) {
        console.error("获取历史消息失败", err);
      } finally {
        setIsLoadingHistory(false);
        queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      }
    },
    [user?.id, page, hasMoreHistory, isLoadingHistory, bizCode],
  );

  // --- Initial Load Effect ---
  useEffect(() => {
    if (isOpen && user?.id) {
      setFirstLoading(true);
      loadHistory(true).finally(() => setFirstLoading(false));
      fetchContexts();
    }
  }, [isOpen, user?.id, bizCode, fetchContexts]);

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setPage(1);
      setHasMoreHistory(true);
      receiverIdRef.current = null;
    }
  }, [isOpen, user?.id]);

  // --- Send Message ---
  const sendMessage = useCallback(
    (msgText: string, type: Message["type"] = "TEXT", msgBizCode?: string) => {
      const socket = socketRef.current;

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        if (type !== "ORDER" && type !== "WAYBILL") {
          addToast({ title: t("connectionLost"), color: "danger" });
        }

        return false;
      }

      const tempId = `temp-${type}-${Date.now()}`;

      // Local Echo
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          sender: "user",
          text: msgText,
          type,
          sending: true,
          createTime: Date.now(),
        },
      ]);
      shouldScrollRef.current = true;

      const payload: any = {
        sender: "CUSTOMER",
        type,
        content: msgText,
        tempId, // Pass tempId for correlation
      };

      if (msgBizCode) payload.bizCode = msgBizCode;
      if (receiverIdRef.current) payload.receiverId = receiverIdRef.current;
      socket.send(JSON.stringify(payload));

      return true;
    },
    [t],
  );

  // --- Send Order/Waybill ---
  const sendOrder = useCallback(
    (content: string, bizCode: string) => {
      return sendMessage(content, "ORDER", bizCode);
    },
    [sendMessage],
  );

  const sendWaybill = useCallback(
    (content: string, bizCode: string) => {
      return sendMessage(content, "WAYBILL", bizCode);
    },
    [sendMessage],
  );

  // --- Upload & Send Image ---
  const sendImage = useCallback(
    async (file: File) => {
      if (!user?.id) return;

      const tempId = `temp-${Date.now()}`;
      const tempUrl = URL.createObjectURL(file);

      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          sender: "user",
          type: "IMAGE",
          sending: true,
          text: tempUrl,
          createTime: Date.now(),
        },
      ]);
      shouldScrollRef.current = true;

      try {
        const url: any = await uploadChatImage(file);

        if (url) {
          const socket = socketRef.current;

          if (socket && socket.readyState === WebSocket.OPEN) {
            const payload: any = {
              sender: "CUSTOMER",
              type: "IMAGE",
              content: url,
              sendTime: new Date().toISOString(),
            };

            if (receiverIdRef.current)
              payload.receiverId = receiverIdRef.current;
            socket.send(JSON.stringify(payload));
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId ? { ...msg, sending: false, text: url } : msg,
            ),
          );
        }
      } catch {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...msg, sending: false, text: t("imageSendFail") }
              : msg,
          ),
        );
      } finally {
        URL.revokeObjectURL(tempUrl);
      }
    },
    [user?.id, t],
  );

  return {
    messages,
    sendMessage,
    sendImage,
    sendOrder,
    sendWaybill,
    loadMoreHistory: () => loadHistory(false),
    isLoadingHistory,
    firstLoading,
    hasMoreHistory,
    shouldScrollRef,
    hasAgent,
    user,
    contextList,
    loadingContexts,
    deleteContext,
    refreshContexts: fetchContexts,
  };
}
