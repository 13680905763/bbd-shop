"use client";
import { Avatar, Chip, Card } from "@heroui/react";

interface BackendRoute {
  id?: string;
  templateName?: string; // 模板名
  methodName?: string; // 运输方式名
  logoUrl?: string; // logo
  minDays?: number;
  maxDays?: number;
  firstWeightFee?: number; // 首重价格
  description?: string; // 描述
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
  if (!data) return null;

  const {
    id = "",
    templateName = "",
    methodName = "",
    logoUrl = "",
    minDays = 0,
    maxDays = 0,
    firstWeightFee = 0,
    description = "",
  } = data;

  const name = templateName || methodName;
  const price = `$ ${firstWeightFee.toFixed(2)}`;
  const time = minDays && maxDays ? `${minDays}-${maxDays} days` : "暂无时效";

  return (
    <Card
      isPressable
      className={`p-4 border ${
        isSelected ? "border-primary border-2" : "border-gray-200"
      } rounded-xl transition hover:shadow-md bg-white`}
      shadow="none"
      onPress={() => onSelect?.(id)}
    >
      <div className="flex gap-5 items-start">
        {/* 左侧图片 + 名称 */}
        <div className="flex flex-col justify-center items-center w-[140px]">
          <Avatar className="w-20 h-20" radius="sm" src={logoUrl} />
          <p className="mt-2 text-sm font-semibold text-center">{name}</p>
          <div className="flex gap-2 mt-1 flex-wrap justify-center">
            {/* 可以根据业务规则动态加标签 */}
            <Chip color="primary" size="sm">
              可投保
            </Chip>
            <Chip className="text-[#fff]" color="success" size="sm">
              免税
            </Chip>
          </div>
        </div>

        {/* 价格 */}
        <div className="flex flex-col items-center justify-center w-[120px]">
          <div className="text-gray-500 text-sm">价格</div>
          <div className="text-lg font-bold">{price}</div>
        </div>

        {/* 时间 */}
        <div className="flex flex-col items-center justify-center w-[120px]">
          <div className="text-gray-500 text-sm">时间</div>
          <div className="text-lg font-bold">{time}</div>
        </div>

        {/* 备注 */}
        <div className="flex-1">
          <span className="text-sm text-gray-600">{description}</span>
        </div>
      </div>
    </Card>
  );
}
