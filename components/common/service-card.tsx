"use client";

import { Card } from "@heroui/react";
import { Image } from "antd";
import { useState } from "react";

import { useGlobalStore } from "@/store";

export default function ServiceCard({
  id,
  serviceName,
  sample,
  price,
  isSelected,
  onSelect,
  initialCount = 1,
  onCountChange,
}: any) {
  const { currency } = useGlobalStore();
  const [count, setCount] = useState(initialCount);

  const updateCount = (v: number) => {
    const next = Math.max(1, v);

    setCount(next);
    onCountChange?.(id, next);
  };

  return (
    <Card
      isPressable
      as="div"
      className={`p-3 rounded-xl border transition cursor-pointer ${
        isSelected ? "border-primary bg-orange-50" : "border-gray-200 bg-white"
      }`}
      shadow="none"
      onClick={() => onSelect?.(id)}
    >
      <div className="flex gap-3">
        {/* 左侧图片 */}
        <div className="h-20 w-20 flex-shrink-0">
          <Image
            alt={serviceName}
            className="rounded-md object-cover"
            height={80}
            src={sample}
            width={80}
          />
        </div>

        {/* 右侧内容区域 */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* 服务名称（2 行展示） */}
          <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
            {serviceName}
          </p>

          {/* 价格 + Stepper */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="text-primary font-semibold whitespace-nowrap">
              {currency.symbol}
              {price}
            </span>

            {/* 数量 Stepper（右侧） */}
            <div
              className="flex items-center bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
              role="button"
              onClick={(e) => e.stopPropagation()} // 避免点 + - 触发选中卡片
            >
              {/* 减号 */}
              <button
                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                onClick={() => updateCount(count - 1)}
              >
                -
              </button>

              {/* 数量显示 */}
              <span className="px-2 min-w-[24px] text-center text-gray-900 text-sm">
                {count}
              </span>

              {/* 加号 */}
              <button
                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                onClick={() => updateCount(count + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
