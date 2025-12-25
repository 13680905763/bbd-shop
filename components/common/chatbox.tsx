"use client";

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Modal,
  ModalContent,
  Textarea,
  Image,
  addToast,
} from "@heroui/react";
import { FaComments, FaImage, FaTimes } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { fetchChatHistory, uploadChatImage } from "@/services";
import { useUserStore } from "@/store";

interface Message {
  id: number;
  sender: "user" | "bot";
  text?: string;
  type?: "TEXT" | "IMAGE" | "ORDER";
  sending?: boolean;
}

export default function ChatWidget() {
  const user = useUserStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [hasAgent, setHasAgent] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // 初次加载
  const firstLoadRef = useRef(true);
  // 初始化加载聊天记录
  const [firstLoading, setFirstLoading] = useState(false); // ✅ 加载状态

  const [page, setPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);

  // 加载记录中
  const historyLoadingRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  const socketRef = useRef<WebSocket | null>(null);
  const receiverIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  /** 初始化 WebSocket */
  useEffect(() => {
    // 如果用户未登录，直接关闭现有连接
    if (!user?.id || !isOpen) {
      console.log("🚪 用户未登录，关闭 WebSocket");
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      return;
    }

    let socket: WebSocket | null = null;
    let retryTimer: NodeJS.Timeout | null = null;
    let retryCount = 0;
    let allowReconnect = true; // ✅ 退出时设为 false 停止重连

    const MAX_RETRY = 5;
    const RETRY_DELAY = 3000;

    const initWebSocket = () => {
      if (!allowReconnect) return; // 已退出不再建立连接

      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!apiBase) {
        console.error("❌ 缺少 NEXT_PUBLIC_API_BASE_URL");

        return;
      }

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const host = apiBase.replace(/^https?:\/\//, "");
      const wsUrl = `${protocol}://${host}/ws`;

      // 防止重复连接
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("⚠️ WebSocket 已连接，跳过新建");

        return;
      }

      console.log(
        `🔌 尝试连接 WebSocket (${retryCount + 1}/${MAX_RETRY}) →`,
        wsUrl,
      );

      socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket 已连接");
        retryCount = 0;
        clearTimeout(retryTimer!);
        retryTimer = null;
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.sender === "SERVER" && !receiverIdRef.current) {
            receiverIdRef.current = data.receiverId;
            setReceiverId(data.receiverId);
            setHasAgent(true);
          }

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: data.sender === "CUSTOMER" ? "user" : "bot",
              text: data.content,
              type: data.type,
            },
          ]);
          firstLoadRef.current = true;
        } catch (err) {
          console.error("❌ 解析消息失败:", err, event.data);
        }
      };

      socket.onclose = (event) => {
        console.warn(
          `⚠️ WebSocket 关闭 (code=${event.code}, reason=${event.reason})`,
        );
        socketRef.current = null;

        // 仅在允许重连时尝试重连
        if (allowReconnect && retryCount < MAX_RETRY) {
          retryCount++;
          console.log(`🔄 ${RETRY_DELAY / 1000}s 后尝试重连...`);
          retryTimer = setTimeout(initWebSocket, RETRY_DELAY);
        } else if (!allowReconnect) {
          console.log("🛑 已退出登录，不再重连");
        } else {
          console.error("🚫 达到最大重连次数，停止重连");
        }
      };

      socket.onerror = (err) => {
        console.error("⚠️ WebSocket 错误:", err);
        socket?.close();
      };
    };

    const timer = setTimeout(initWebSocket, 100);

    // ✅ 模拟网络异常调试函数
    (window as any).simulateWSError = () => {
      const ws = socketRef.current;

      if (!ws) {
        console.warn("⚠️ WebSocket 未初始化，无法模拟错误");

        return;
      }

      console.log("🧪 模拟网络错误中...");
      try {
        ws.dispatchEvent(new Event("error")); // 尝试触发 onerror
      } catch {
        ws.close(1006, "Simulated network error"); // 强制异常断开
      }
    };

    // 清理逻辑（组件卸载或退出时调用）
    return () => {
      console.log("🧹 清理 WebSocket 连接");
      allowReconnect = false; // ❌ 禁止重连
      clearTimeout(timer);
      if (retryTimer) clearTimeout(retryTimer);
      socket?.close();
      socketRef.current = null;
    };
  }, [user?.id, isOpen]);

  /** 发送消息 */
  const sendMessage = (msgText: string, type: Message["type"] = "TEXT") => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const payload: any = {
      sender: "CUSTOMER",
      type,
      content: msgText,
      sendTime: new Date().toISOString(),
      receiverId,
    };

    if (receiverIdRef.current) payload.receiverId = receiverIdRef.current;
    socket.send(JSON.stringify(payload));

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: msgText, type },
    ]);
    firstLoadRef.current = true;
  };

  const handleSend = () => {
    if (!user?.id) {
      addToast({
        title: "请先登录",
        timeout: 1000,
        color: "danger",
      });

      return;
    }

    const msgText = input.trim();

    if (!msgText) return;
    sendMessage(msgText, "TEXT");
    setInput("");
  };

  /** 插入表情 */
  const insertEmoji = (emoji: string) => {
    if (!textareaRef.current) {
      setInput((prev) => prev + emoji);

      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = input.substring(0, start) + emoji + input.substring(end);

    setInput(newValue);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);

    setShowEmojiPicker(false);
  };

  /** 图片上传 */
  const triggerUpload = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id) {
      addToast({
        title: "请先登录",
        timeout: 1000,
        color: "danger",
      });

      return;
    }
    const file = e.target.files?.[0];

    if (!file) return;

    const tempId = Date.now();
    const tempUrl = URL.createObjectURL(file);

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        sender: "user",
        type: "IMAGE",
        sending: true,
        text: tempUrl,
      },
    ]);

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

          if (receiverIdRef.current) payload.receiverId = receiverIdRef.current;
          socket.send(JSON.stringify(payload));
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, sending: false, text: url } : msg,
          ),
        );
      }
    } catch (err) {
      console.error("图片上传失败", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, sending: false, text: "[图片发送失败]" }
            : msg,
        ),
      );
    } finally {
      URL.revokeObjectURL(tempUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /** 加载历史函数 */
  const loadHistory = async (initialLoad = false) => {
    historyLoadingRef.current = true;
    try {
      const res: any = await fetchChatHistory(user!.id, page);
      const records: any = res.records || [];
      const lastPage: number = res.pages ?? 1;

      if (records.length > 0) {
        setMessages((prev) => [
          ...records.reverse().map((msg: any) => ({
            id: msg?.id ?? `srv-${Date.now()}`,
            sender: msg.sender === "CUSTOMER" ? "user" : "bot",
            type: msg.contentType,
            text: msg.content,
          })),
          ...prev,
        ]);
      }

      setHasMoreHistory(page < lastPage);
      setPage((prev) => prev + 1);

      if (initialLoad) {
        // 获取客服id
        const hisM = records.filter((item: any) => {
          return item.sender == "SERVER";
        });

        if (hisM.length) {
          receiverIdRef.current = hisM[0].userId;
        }
        isInitialLoadRef.current = true;
      }
    } catch (err) {
      console.error("获取历史消息失败", err);
    } finally {
      historyLoadingRef.current = false;
    }
  };

  /** 上拉加载历史 */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (historyLoadingRef.current) return;
    const target = e.currentTarget;

    if (target.scrollTop <= 10 && hasMoreHistory) {
      const container = scrollContainerRef.current;
      const prevScrollHeight = container?.scrollHeight ?? 0;

      loadHistory().then(() => {
        // 保持原来的滚动位置
        requestAnimationFrame(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - prevScrollHeight;
          }
        });
      });
    }
  };

  // 初始化打开弹窗
  useEffect(() => {
    const fetchHistory = async () => {
      if (isOpen) {
        console.log("打开弹窗加载历史");
        setFirstLoading(true);
        try {
          await loadHistory(true); // ✅ 等待加载完成
          firstLoadRef.current = true;
        } catch (e) {
          console.error("加载历史失败:", e);
        } finally {
          setFirstLoading(false);
        }
      } else {
        console.log("关闭弹窗清空历史,重置消息状态");
        setMessages([]);
        setPage(1);
        setHasMoreHistory(true);
        setReceiverId(null);
      }
    };

    fetchHistory();
  }, [isOpen]);
  /** 初次加载完成后滚动到底部 */
  useEffect(() => {
    if (!firstLoadRef.current || messages.length === 0) return;
    console.log("初次加载完成后滚动到底部");

    const scrollToBottom = () => {
      const container = scrollContainerRef.current;

      if (!container) {
        requestAnimationFrame(scrollToBottom);

        return;
      }
      container.scrollTop = container.scrollHeight;
      firstLoadRef.current = false;
    };

    requestAnimationFrame(scrollToBottom);
  }, [messages]);

  return (
    <>
      {/* 右下角按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          isIconOnly
          className="w-14 h-14 shadow-lg"
          color="primary"
          radius="full"
          onPress={() => {
            if (!user?.id) {
              // 用户未登录，直接提示，不调用接口
              addToast({
                title: "请先登录",
                timeout: 1000,
                color: "danger",
              });

              return;
            }
            setIsOpen(true);
          }}
        >
          <FaComments className="w-6 h-6" />
        </Button>
      </div>

      {/* 对话框 */}
      <Modal
        hideCloseButton
        backdrop="transparent"
        className="!m-0"
        isOpen={isOpen}
        placement="bottom"
        onOpenChange={setIsOpen}
      >
        <ModalContent className="p-0 m-0 fixed bottom-20 right-6 w-[380px] h-[520px] shadow-xl overflow-hidden">
          <Card className="w-full h-full flex flex-col">
            {/* 顶部栏 */}
            <div className="flex items-center justify-between text-white px-4 py-4">
              <div className="flex items-center gap-2">
                <img alt="logo" className="w-15 h-6 rounded" src="/logo.png" />
                <span className="font-semibold text-sm">在线客服</span>
              </div>
              <button
                className="p-1 hover:bg-white/20 rounded"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            {/* 消息区 */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50"
              onScroll={handleScroll}
            >
              {/* {hasAgent && (
                <div className="text-xs text-gray-400 text-center mb-2">
                  客服已接入
                </div>
              )} */}
              {/* ✅ 加载中动画 */}
              {firstLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/70 z-10">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                </div>
              )}
              {historyLoadingRef && (
                <div className="flex justify-center py-2">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg max-w-[75%] break-words ${
                    msg.sender === "user"
                      ? "ml-auto bg-blue-500 text-white"
                      : "mr-auto bg-gray-200 text-black"
                  }`}
                >
                  {msg.type === "IMAGE" && msg.text ? (
                    <div className="relative inline-block">
                      <Image
                        alt="image"
                        className="max-w-full rounded"
                        src={msg.text}
                      />
                      {msg.sending && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : msg.type === "ORDER" ? (
                    <div className="font-mono text-sm bg-yellow-100 p-1 rounded">
                      {msg.text}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}
            </div>
            {/* 输入区 */}
            <div className="p-3 border-t bg-white flex flex-col gap-2 relative">
              <Textarea
                ref={textareaRef}
                classNames={{
                  inputWrapper:
                    "w-full border border-gray-300 rounded-md px-3 py-2",
                  input: "text-sm",
                }}
                placeholder="请输入消息..."
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              {showEmojiPicker && (
                <div className="absolute bottom-20 left-3 z-50">
                  <Picker
                    data={data}
                    theme="light"
                    onEmojiSelect={(e: any) => insertEmoji(e.native)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    className="w-8 h-8 flex items-center justify-center"
                    color="primary"
                    radius="full"
                    variant="light"
                    onPress={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    😀
                  </Button>
                  <Button
                    className="w-8 h-8 flex items-center justify-center"
                    color="primary"
                    radius="full"
                    variant="light"
                    onPress={triggerUpload}
                  >
                    <FaImage />
                  </Button>
                </div>

                <Button
                  className="px-4 py-2"
                  color="primary"
                  onPress={handleSend}
                >
                  发送
                </Button>

                <input
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </Card>
        </ModalContent>
      </Modal>
    </>
  );
}
