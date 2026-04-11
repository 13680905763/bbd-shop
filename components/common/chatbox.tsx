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
  Avatar,
  Badge,
} from "@heroui/react";
import {
  FaComments,
  FaImage,
  FaTimes,
  FaShoppingBag,
  FaBoxOpen,
  FaTrash,
  FaBox,
  FaTruck,
  FaHistory,
  FaRegListAlt,
} from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import dayjs from "dayjs";

import OrderListModal from "./order-list-modal";
import WaybillListModal from "./waybill-list-modal";

import { useGlobalStore, useChatStore } from "@/store";
import { useChat } from "@/hook/chat/useChat";

export default function ChatBox() {
  const { currency } = useGlobalStore();
  const {
    isOpen,
    setIsOpen,
    pendingOrder,
    setPendingOrder,
    pendingWaybill,
    setPendingWaybill,
    chatMode,
    activeBizCode,
    resetToCommon,
    setChatMode,
    setActiveBizCode,
  } = useChatStore();
  const t = useTranslations("components.chatbox");

  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showWaybillModal, setShowWaybillModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  const {
    messages,
    sendMessage,
    sendImage,
    sendOrder,
    sendWaybill,
    loadMoreHistory,
    isLoadingHistory,
    firstLoading,
    hasMoreHistory,
    shouldScrollRef,
    user,
    contextList,
    loadingContexts,
    deleteContext,
  } = useChat(isOpen, activeBizCode);

  // Handle scroll for history loading
  useEffect(() => {
    if (isOpen && pendingOrder && user?.id && !firstLoading) {
      // Delay to ensure websocket is ready and messages are loaded
      const timer = setTimeout(() => {
        const orderWithCurrency = {
          ...pendingOrder,
          products: pendingOrder.products?.map((p: any) => ({
            ...p,
            price: `${currency.symbol}${p.price}`,
          })),
        };

        // Try to send, if it returns true (success), clear the pending order
        const success = sendOrder(
          JSON.stringify(orderWithCurrency),
          pendingOrder.orderCode,
        );

        if (success) {
          setPendingOrder(null);
        }
      }, 1000); // Increased delay to ensure connection is stable

      return () => clearTimeout(timer);
    }
  }, [
    isOpen,
    pendingOrder,
    user?.id,
    sendOrder,
    setPendingOrder,
    currency.symbol,
    firstLoading,
  ]);

  // Handle pending waybill from store
  useEffect(() => {
    if (isOpen && pendingWaybill && user?.id && !firstLoading) {
      const timer = setTimeout(() => {
        const success = sendWaybill(
          JSON.stringify(pendingWaybill),
          pendingWaybill.packingPackageCode,
        );

        if (success) {
          setPendingWaybill(null);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    isOpen,
    pendingWaybill,
    user?.id,
    sendWaybill,
    setPendingWaybill,
    firstLoading,
  ]);

  // Handle scroll for history loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // If loading or no more history, do nothing
    if (isLoadingHistory || !hasMoreHistory) return;

    const target = e.currentTarget;

    if (target.scrollTop <= 10) {
      const container = scrollContainerRef.current;
      const prevScrollHeight = container?.scrollHeight ?? 0;

      loadMoreHistory().then(() => {
        // Restore scroll position after DOM update
        requestAnimationFrame(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            const diff = newScrollHeight - prevScrollHeight;

            if (diff > 0) {
              container.scrollTop = diff;
            }
          }
        });
      });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldScrollRef.current) {
      const container = scrollContainerRef.current;

      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }
      shouldScrollRef.current = false;
    }
  }, [messages, shouldScrollRef]);

  const handleSend = () => {
    const msgText = input.trim();

    if (!msgText) return;
    sendMessage(msgText, "TEXT");
    setInput("");
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file size (e.g., 5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_FILE_SIZE) {
      addToast({
        title: t("imageTooLarge", {
          defaultMessage: "Image size cannot exceed 5MB",
        }),
        color: "danger",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";

      return;
    }

    sendImage(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <motion.div
        drag
        className="fixed bottom-6 right-6 z-50"
        dragMomentum={false}
        onDragEnd={() => setTimeout(() => (isDraggingRef.current = false), 100)}
        onDragStart={() => (isDraggingRef.current = true)}
      >
        <Badge
          color="primary"
          content={user?.msgCount > 99 ? "99+" : user?.msgCount}
          isInvisible={!user?.msgCount || user.msgCount === 0}
          shape="circle"
        >
          <Button
            isIconOnly
            className="w-14 h-14 shadow-lg"
            color="primary"
            radius="full"
            onPress={() => {
              if (isDraggingRef.current) return;
              if (isDraggingRef.current) return;
              if (!user?.id) {
                addToast({
                  title: t("loginFirst"),
                  timeout: 1000,
                  color: "danger",
                });

                return;
              }
              resetToCommon();
              setIsOpen(true);
            }}
          >
            <FaComments className="w-6 h-6" />
          </Button>
        </Badge>
      </motion.div>

      <Modal
        hideCloseButton
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        scrollBehavior="inside"
        size={"5xl"}
        onOpenChange={setIsOpen}
      >
        <ModalContent
          className={`p-0 m-0 fixed shadow-xl overflow-hidden transition-all duration-300  h-[85vh]`}
        >
          <div className="flex h-full w-full overflow-hidden">
            {/* Main Chat Area */}
            <Card className="flex flex-1 flex-col rounded-none border-r">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4  text-white">
                <div className="flex items-center gap-2">
                  <Image
                    alt="logo"
                    className="w-15 h-6 rounded "
                    src="/logo.png"
                  />
                  <span className="text-sm font-semibold text-[#f0700c]">
                    {chatMode === "ORDER"
                      ? `${t("orderNo")} ${activeBizCode}`
                      : chatMode === "WAYBILL"
                        ? `${t("waybillNo")} ${activeBizCode}`
                        : t("onlineSupport")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#f0700c]">
                  <button
                    className="rounded p-1 hover:bg-white/20 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div
                ref={scrollContainerRef}
                className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-3 min-h-[400px]"
                onScroll={handleScroll}
              >
                {firstLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/70">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
                  </div>
                )}
                {isLoadingHistory && !firstLoading && (
                  <div className="flex justify-center py-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                  </div>
                )}
                {messages.length === 0 && !firstLoading && !isLoadingHistory
                  ? null
                  : messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 w-full ${msg.sender === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                        }`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {msg.sender === "bot" ? (
                          <Avatar
                            className="bg-white border p-1"
                            size="sm"
                            src="/logo.png"
                          />
                        ) : (
                          <Avatar
                            name={user?.nickname?.[0] || "U"}
                            size="sm"
                            src={user?.avatarUrl || ""}
                          />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`w-fit max-w-[75%] break-words rounded-lg p-2 ${msg.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                          }`}
                      >
                        <div className="flex flex-col gap-1">
                          {msg.type === "IMAGE" && msg.text ? (
                            <div className="relative inline-block">
                              <Image
                                alt="image"
                                className="max-w-[200px] max-h-[200px] object-contain rounded"
                                src={msg.text}
                              />
                              {msg.sending && (
                                <div className="absolute inset-0 flex items-center justify-center rounded bg-black/20">
                                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                </div>
                              )}
                            </div>
                          ) : msg.type === "ORDER" ? (
                            <div className="rounded bg-orange-100 p-2 font-mono text-sm text-black w-full">
                              {(() => {
                                try {
                                  const order = JSON.parse(msg.text || "{}");

                                  return (
                                    <div className="flex flex-col gap-2">
                                      <div className="font-semibold border-b border-yellow-200 pb-1">
                                        {t("orderNo")}
                                        {order.orderCode}
                                      </div>
                                      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                                        {order.products?.map(
                                          (product: any, idx: number) => (
                                            <div
                                              key={idx}
                                              className="flex gap-2 items-start"
                                            >
                                              <Image
                                                alt="product"
                                                className="w-10 h-10 object-cover rounded flex-shrink-0"
                                                referrerPolicy="no-referrer"
                                                src={
                                                  product.skuPicUrl ||
                                                  product.picUrl
                                                }
                                              />
                                              <div className="flex-1 text-xs">
                                                <div className="line-clamp-2">
                                                  {product.productTitle}
                                                </div>
                                                <div className="text-gray-500 mt-1">
                                                  {t("price")}
                                                  {product.price} x{" "}
                                                  {product.purchaseQuantity}
                                                </div>
                                              </div>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  );
                                } catch {
                                  return <div>{msg.text}</div>;
                                }
                              })()}
                            </div>
                          ) : msg.type === "WAYBILL" ? (
                            <div className="rounded bg-blue-100 p-2 font-mono text-sm text-black w-full">
                              {(() => {
                                try {
                                  const waybill = JSON.parse(
                                    msg.text || "{}",
                                  );

                                  return (
                                    <div className="flex flex-col gap-2">
                                      <div className="font-semibold border-b border-blue-200 pb-1">
                                        {t("waybillNo", {
                                          defaultMessage: "Waybill No: ",
                                        })}
                                        {waybill.packingPackageCode}
                                      </div>
                                      <div className="flex flex-col gap-1 text-xs">
                                        {waybill.shippingCode && (
                                          <div>
                                            <span className="text-gray-500">
                                              {t("trackingNo", {
                                                defaultMessage:
                                                  "Tracking No: ",
                                              })}
                                            </span>
                                            {waybill.shippingCode}
                                          </div>
                                        )}
                                        {waybill.pic &&
                                          waybill.pic.length > 0 && (
                                            <div className="flex gap-2 mt-1 overflow-x-auto no-scrollbar flex-wrap">
                                              {waybill.pic.map(
                                                (
                                                  url: string,
                                                  index: number,
                                                ) => (
                                                  <Image
                                                    key={index}
                                                    alt="waybill pic"
                                                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                                                    referrerPolicy="no-referrer"
                                                    src={url}
                                                  />
                                                ),
                                              )}
                                            </div>
                                          )}
                                        <div className="grid grid-cols-2 gap-1 mt-1">
                                          <div>
                                            <span className="text-gray-500">
                                              {t("weight", {
                                                defaultMessage: "Weight",
                                              })}
                                              :{" "}
                                            </span>
                                            {waybill.weight}g
                                          </div>
                                          <div>
                                            <span className="text-gray-500">
                                              {t("size", {
                                                defaultMessage: "Size",
                                              })}
                                              :{" "}
                                            </span>
                                            {waybill.length}*{waybill.width}*
                                            {waybill.height}cm
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                } catch {
                                  return <div>{msg.text}</div>;
                                }
                              })()}
                            </div>
                          ) : (
                            msg.text
                          )}
                          <div className="flex items-center justify-end gap-1">
                            <span
                              className={`text-[10px] ${msg.sender === "user"
                                ? "text-blue-100"
                                : "text-gray-500"
                                }`}
                            >
                              {dayjs(msg?.createTime).format("MM-DD HH:mm")}
                            </span>
                            {msg.sending && msg.type !== "IMAGE" && (
                              <div className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-white/80 border-t-transparent" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="relative flex flex-col gap-2 border-t bg-white p-3">
                <Textarea
                  ref={textareaRef}
                  classNames={{
                    inputWrapper:
                      "w-full border border-gray-300 rounded-md px-3 py-2",
                    input: "text-base",
                  }}
                  placeholder={t("inputPlaceholder")}
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
                      className="flex h-8 w-8 items-center justify-center"
                      color="primary"
                      radius="full"
                      variant="light"
                      onPress={() => setShowEmojiPicker((prev) => !prev)}
                    >
                      😀
                    </Button>
                    <Button
                      className="flex h-8 w-8 items-center justify-center"
                      color="primary"
                      radius="full"
                      variant="light"
                      onPress={() => fileInputRef.current?.click()}
                    >
                      <FaImage />
                    </Button>
                    {chatMode === "COMMON" && (
                      <>
                        <Button
                          className="flex h-8 w-8 items-center justify-center"
                          color="primary"
                          radius="full"
                          variant="light"
                          onPress={() => setShowOrderModal(true)}
                        >
                          <FaShoppingBag />
                        </Button>
                        <Button
                          className="flex h-8 w-8 items-center justify-center"
                          color="primary"
                          radius="full"
                          variant="light"
                          onPress={() => setShowWaybillModal(true)}
                        >
                          <FaBoxOpen />
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    className="px-4 py-2"
                    color="primary"
                    onPress={handleSend}
                  >
                    {t("send")}
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

            <div className="hidden w-80 flex-col border-l bg-gray-50/50 md:flex">
              <div className="flex items-center gap-2 border-b bg-white px-4 py-4 font-bold text-gray-800 shadow-sm">
                <FaHistory className="text-[#f0700c]" />
                {t("consultationList", {
                  defaultMessage: "Business Consultations",
                })}
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {loadingContexts ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f0700c]/20 border-t-[#f0700c]" />
                    <span className="text-xs text-gray-400 font-medium italic">Loading records...</span>
                  </div>
                ) : contextList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-300">
                    <FaRegListAlt className="w-14 h-14" />
                    <span className="text-sm font-medium">
                      {t("noConsultations", { defaultMessage: "No records" })}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {contextList.map((ctx) => {
                      const isActive = activeBizCode === ctx.bizCode;

                      return (
                        <div
                          key={ctx.id}
                          className={`group relative flex w-full flex-col overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${isActive
                            ? "border-[#f0700c]/30 bg-white shadow-lg ring-1 ring-[#f0700c]/10"
                            : "border-transparent bg-white shadow-sm hover:border-gray-200 hover:shadow-md hover:-translate-y-1"
                            }`}
                        >
                          <button
                            className="absolute inset-0 h-full w-full rounded-2xl"
                            aria-label={`Select ${ctx.title}`}
                            onClick={() => {
                              if (isActive) {
                                resetToCommon();
                              } else {
                                setChatMode(ctx.type === 1 ? "ORDER" : "WAYBILL");
                                setActiveBizCode(ctx.bizCode);
                              }
                            }}
                          />

                          {/* 1. 标题行：独立放在最上方，占据整行 */}
                          <div className="pointer-events-none z-10 mb-2 block w-full">
                            <span
                              className={`block truncate text-sm font-bold transition-colors ${isActive ? "text-[#f0700c]" : "text-gray-800"
                                }`}
                              title={ctx.title} // 鼠标悬停显示全称
                            >
                              {ctx.title}
                            </span>
                          </div>

                          {/* 2. 下方内容区：Icon 和 业务代码并排 */}
                          <div className="pointer-events-none z-10 flex items-center gap-3">
                            {/* Visual Avatar/Icon */}
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${isActive
                                ? "bg-[#f0700c] text-white shadow-lg shadow-[#f0700c]/30"
                                : "bg-gray-50 text-gray-400 group-hover:bg-[#f0700c]/5 group-hover:text-[#f0700c]"
                                }`}
                            >
                              {ctx.type === 1 ? (
                                <FaBox className="h-4 w-4" />
                              ) : (
                                <FaTruck className="h-4 w-4" />
                              )}
                            </div>

                            {/* 业务类型标签和代码 */}
                            <div className="flex flex-col gap-1 truncate">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest ${isActive ? "bg-[#f0700c]/10 text-[#f0700c]" : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                  {ctx.type === 1 ? t("order") : t("waybill")}
                                </span>
                              </div>
                            </div>

                            {/* 删除按钮占位，保持右侧对齐 */}
                            <div className="flex-1" />
                            <button
                              className="relative z-20 flex h-8 w-8 items-center justify-center rounded-full text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteContext(ctx.bizCode);
                              }}
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>

                          {/* 左侧激活指示条 */}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#f0700c] rounded-r-full" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
      {showOrderModal && (
        <OrderListModal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          onSendOrder={(order) => {
            const orderWithCurrency = {
              ...order,
              products: order.products?.map((p: any) => ({
                ...p,
                price: `${currency.symbol}${p.price}`,
              })),
            };

            sendOrder(JSON.stringify(orderWithCurrency), order.orderCode);
            setShowOrderModal(false);
          }}
        />
      )}
      {showWaybillModal && (
        <WaybillListModal
          isOpen={showWaybillModal}
          onClose={() => setShowWaybillModal(false)}
          onSendWaybill={(waybill) => {
            sendWaybill(JSON.stringify(waybill), waybill.packingPackageCode);
            setShowWaybillModal(false);
          }}
        />
      )}
    </>
  );
}
