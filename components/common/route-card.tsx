"use client";
import { Avatar, Card } from "@heroui/react";

import { useGlobalStore } from "@/store";

interface BackendRoute {
  id?: string;
  templateName?: string; // 模板名
  methodName?: string; // 运输方式名
  logoUrl?: string; // logo
  minDays?: number;
  maxDays?: number;
  billTypeCode?: string;
  shippingLine: any;
  firstWeightFee?: number; // 首重价格
  firstVolumeFee?: number; // 首重价格
  description?: string; // 描述
  disable?: boolean; // 是否禁用
  prompt?: string; // 禁用提示
  shippingFee?: number; // 运费
}

interface RouteCardProps {
  data: BackendRoute;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function RouteCard({
  data,
  isSelected,
  onSelect,
}: RouteCardProps) {
  const { currency } = useGlobalStore();

  if (!data) return null;

  const {
    id = "",
    templateName = "",
    methodName = "",
    logoUrl = "",
    shippingLine = {},
    firstWeightFee = 0,
    firstVolumeFee = 0,
    billTypeCode = "",
    description = "",
    disable = false,
    prompt = "",
    shippingFee = 0,
  } = data;

  console.log("data", data);

  const name = templateName || methodName;
  const time =
    shippingLine.minDays && shippingLine.maxDays
      ? `${shippingLine.minDays}-${shippingLine.maxDays} days`
      : "暂无时效";

  return (
    <Card
      className={`p-4 border ${
        isSelected ? "border-primary border-2" : "border-gray-200"
      } rounded-xl transition hover:shadow-md bg-white`}
      isBlurred={false}
      isDisabled={disable}
      isPressable={!disable}
      shadow="none"
      onPress={() => {
        if (disable) return;
        onSelect?.(id);
      }}
    >
      <div className="flex gap-5 items-start">
        {/* 左侧图片 + 名称 */}
        <div className="flex flex-col justify-center items-center w-[140px]">
          <Avatar className="w-20 h-20" radius="sm" src={logoUrl} />
          <p className="mt-2 text-sm font-semibold text-center">{name}</p>
        </div>

        {/* 价格 */}
        <div className="flex flex-col items-center justify-center w-[120px] ">
          <div className="text-gray-500 text-sm">Price</div>
          <div className="text-lg font-bold">
            {currency.symbol}
            {shippingFee}
          </div>
        </div>

        {/* 时间 */}
        <div className="flex flex-col items-center justify-center w-[120px]">
          <div className="text-gray-500 text-sm">Time</div>
          <div className="text-lg font-bold">{time}</div>
        </div>

        {/* 备注 */}
        <div className="flex-1">
          <span className="text-sm text-gray-600 text-left">
            {shippingLine.description}
          </span>
        </div>
      </div>
      {disable && prompt && (
        <div className="mt-2 p-2 bg-red-50 text-red-500 text-sm rounded-lg">
          {prompt}
        </div>
      )}
    </Card>
  );
}
