"use client";

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Modal,
  ModalContent,
  Textarea,
  Image,
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

  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const historyLoadingRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  const socketRef = useRef<WebSocket | null>(null);
  const receiverIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  /** 初始化 WebSocket */
  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBase) return;

    const wsUrl = apiBase.replace(/^http/, "ws") + "/ws";
    const socket = new WebSocket(wsUrl);

    socketRef.current = socket;

    socket.onopen = () => console.log("✅ WebSocket 已连接");
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
      } catch (err) {
        console.error("解析消息失败:", err, event.data);
      }
    };
    socket.onclose = () => console.log("❌ WebSocket 已关闭");
    socket.onerror = (err) => console.error("⚠️ WebSocket 错误:", err);

    return () => socket.close();
  }, []);

  /** 发送消息 */
  const sendMessage = (msgText: string, type: Message["type"] = "TEXT") => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const payload: any = {
      sender: "CUSTOMER",
      type,
      content: msgText,
      sendTime: new Date().toISOString(),
    };

    if (receiverIdRef.current) payload.receiverId = receiverIdRef.current;
    socket.send(JSON.stringify(payload));

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: msgText, type },
    ]);
  };

  const handleSend = () => {
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
    if (historyLoadingRef.current || !hasMoreHistory) return;
    historyLoadingRef.current = true;

    try {
      const res: any = await fetchChatHistory(user!.id, historyPage);
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

      setHasMoreHistory(historyPage < lastPage);
      setHistoryPage((prev) => prev + 1);

      if (initialLoad) {
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

  /** 首次加载历史 */
  useEffect(() => {
    if (!user?.id) return;
    loadHistory(true);
  }, [user]);

  /** 初次加载完成后滚动到底部 */
  useEffect(() => {
    if (!isInitialLoadRef.current || messages.length === 0) return;

    const scrollToBottom = () => {
      const container = scrollContainerRef.current;

      if (!container) {
        requestAnimationFrame(scrollToBottom);

        return;
      }
      container.scrollTop = container.scrollHeight;
      isInitialLoadRef.current = false;
    };

    requestAnimationFrame(scrollToBottom);
  }, [messages]);

  /** 上拉加载历史 */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
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

  return (
    <>
      {/* 右下角按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          isIconOnly
          className="w-14 h-14 shadow-lg"
          color="primary"
          radius="full"
          onPress={() => setIsOpen(true)}
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
            <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-4">
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
              {hasAgent && (
                <div className="text-xs text-gray-400 text-center mb-2">
                  客服已接入
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
