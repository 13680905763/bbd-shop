// /components/home/AnnouncementBar.tsx
"use client";

import React from "react";
import { FiVolume2 } from "react-icons/fi";

interface AnnouncementBarProps {
  texts: {
    label: string; // 公告标签
    message: React.ReactNode; // 公告内容
  };
  className?: string;
}

export default function HomeAnnouncementBar({
  texts,
  className,
}: AnnouncementBarProps) {
  return (
    <div className={`bg-[#ffeee1] text-[#4a1f05] ${className ?? ""}`}>
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <div className="flex items-center space-x-3">
          {/* 喇叭图标 */}
          <FiVolume2 className="w-5 h-5 text-[#f0700c] animate-pulse" />

          {/* 公告文字标签 */}
          <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wide bg-[#f0700c]/10 text-[#f0700c] rounded-md">
            {texts.label}
          </span>

          {/* 消息内容 */}
          <span className="font-medium text-sm md:text-base text-[#4a1f05]">
            {texts.message}
          </span>
        </div>
      </div>
    </div>
  );
}
