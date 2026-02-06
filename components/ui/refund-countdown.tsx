"use client";

import { Statistic } from "antd";
import { useTranslations } from "next-intl";

interface RefundCountdownProps {
  timestamp: number | string;
}

export default function RefundCountdown({ timestamp }: RefundCountdownProps) {
  const t = useTranslations("components.ui.refundCountdown");

  const format = `D ${t("day")} H ${t("hour")} m ${t("minute")} s ${t("second")}`;
  // // 添加调试信息
  // console.log('原始时间戳:', timestamp);
  // console.log('目标时间:', new Date(targetTime).toLocaleString());
  // console.log('当前时间:', new Date().toLocaleString());
  // console.log('剩余毫秒:', targetTime - Date.now());
  // console.log('剩余天数:', (targetTime - Date.now()) / (1000 * 60 * 60 * 24));


  console.log('退款截止时间戳:', Number(timestamp));
  console.log('转换为日期:', new Date(timestamp).toLocaleString('zh-CN'));
  console.log('当前时间戳:', Date.now());
  console.log('差值（毫秒）:', Number(timestamp) - Date.now());
  console.log('差值（天）:', (Number(timestamp) - Date.now()) / (1000 * 60 * 60 * 24));
  // 如果已经过期，显示过期状态
  if (Number(timestamp) <= Date.now()) {
    return (
      <span className="text-xs ml-1 text-red-500">
        ({t("expired")})
      </span>
    );
  }
  return (
    <Statistic.Timer
      type="countdown"
      format={format}
      prefix={'('}
      value={Number(timestamp)}
      valueStyle={{
        fontSize: "12px",
        color: "inherit",
        lineHeight: "inherit",
      }}
    />
  );
}