// /components/home/AnnouncementBar.tsx
"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { FiVolume2 } from "react-icons/fi";

export default function HomeAnnouncementBar() {
  const t = useTranslations("home.announcement");

  return (
    <div className={`bg-[#ffeee1] text-[#4a1f05] `}>
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <div className="flex items-center space-x-3">
          {/* 喇叭图标 */}
          <FiVolume2 className="w-5 h-5 text-[#f0700c] animate-pulse" />

          {/* 公告文字标签 */}
          <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wide bg-[#f0700c]/10 text-[#f0700c] rounded-md">
            {t("label")}
          </span>

          {/* 消息内容 */}
          <span className="font-medium text-sm md:text-base text-[#4a1f05]">
            {t("message")}
          </span>
        </div>
      </div>
    </div>
  );
}
