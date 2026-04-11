"use client";

import { useState, useRef } from "react";
import { Button, Modal, ModalContent } from "@heroui/react";
import { motion } from "framer-motion";

export default function GlobalVideoPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const isDraggingRef = useRef(false);

  const videoUrl =
    "https://bbd-buy.oss-cn-hongkong.aliyuncs.com/VIDEO/%E4%BB%8B%E7%BB%8D.mp4";

  return (
    <>
      <motion.div
        drag
        // 1. 整体容器尺寸大幅缩小，更紧凑
        className="fixed bottom-24 right-6 z-50 pointer-events-auto w-14 h-14 flex justify-center items-center"
        dragMomentum={false}
      // onDragEnd={() => {
      //   // Add a small delay to prevent click event right after drag
      //   setTimeout(() => (isDraggingRef.current = false), 100);
      // }}
      // onDragStart={() => (isDraggingRef.current = true)}
      >
        {/* CSS 绘制的天线 - 变细变短，点缀即可 */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 pointer-events-none opacity-80">
          <div className="absolute top-0 left-0 w-0.5 h-6 bg-gray-600 rotate-[ -35deg ] origin-bottom rounded-full" />
          <div className="absolute top-0 right-0 w-0.5 h-6 bg-gray-600 rotate-[ 35deg ] origin-bottom rounded-full" />
        </div>

        <Button
          // 2. 按钮尺寸缩小，去掉了 radius="full"，自定义圆角模拟小电视外壳
          className="w-full h-full p-0.5 flex flex-col gap-0 shadow-xl bg-[#3a3a3a] text-white hover:scale-110 active:scale-95 transition-all duration-300 rounded-[14px] border-2 border-[#2a2a2a]"
          onPress={() => {
            if (isDraggingRef.current) return;
            setIsOpen(true);
          }}
        >
          {/* 3. 模拟小电视屏幕 - 尺寸变小，文字依然清晰 */}
          <div className="relative w-full h-full flex flex-col justify-center items-center bg-gradient-to-tr from-[#f0700c] to-[#ff9d4d] rounded-[8px] shadow-inner overflow-hidden">
            {/* 4. 文字 - 调整字体大小和间距，确保紧凑清晰 */}
            <span className="text-[9px] font-extrabold uppercase leading-tight tracking-tighter text-center drop-shadow-sm">
              How To
              <br />
              Buy
            </span>

            {/* 5. 精简指示灯 - 变成右上角静止的小红点 */}
            <div className="absolute top-1 right-1 w-1 h-1 bg-red-600 rounded-full" />
          </div>
        </Button>
      </motion.div>
      <Modal
        backdrop="blur"
        classNames={{
          base: "bg-black/90",
          closeButton: "z-50 text-white hover:bg-white/20 text-xl",
        }}
        isOpen={isOpen}
        placement="center"
        size="4xl"
        onOpenChange={setIsOpen}
      >
        <ModalContent className="p-0 overflow-hidden border-none">
          {(onClose) => (
            <div className="relative aspect-video w-full flex items-center justify-center bg-black">
              <video
                autoPlay
                controls
                className="w-full h-full object-contain"
                src={videoUrl}

              ><track kind="captions" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
