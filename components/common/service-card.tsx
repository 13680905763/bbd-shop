"use client";
import { Card } from "@heroui/react";
import { Image } from "antd";

interface ServiceCardProps {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function ServiceCard({
  id,
  serviceName,
  sample,
  price,
  isSelected,
  onSelect,
}: any) {
  return (
    <Card
      isPressable
      className={`flex-1 p-3 rounded-xl border  transition ${
        isSelected ? "border-primary border-2 bg-orange-50" : "border-gray-200"
      } hover:shadow-md cursor-pointer`}
      shadow="none"
      onClick={() => onSelect?.(id)}
    >
      <div className="flex items-center gap-3">
        {/* 服务图片 */}
        <Image
          alt={serviceName}
          className=" object-cover rounded-md  border-gray-200"
          height={80}
          src={sample}
          width={80}
        />

        {/* 服务信息 */}
        <div className="flex flex-col flex-1">
          <span className="text-base font-medium">{serviceName}</span>
          <span className="text-primary font-semibold mt-1">¥{price}</span>
        </div>
      </div>
    </Card>
  );
}
