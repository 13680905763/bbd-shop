// /components/home/ServiceCards.tsx
"use client";

import React from "react";
import { Image } from "@heroui/react";

export interface ServiceItem {
  key: string;
  title: string;
  describe: string;
  src: string;
}

interface ServiceCardsProps {
  services: ServiceItem[];
  className?: string;
}

export default function HomeServiceCards({
  services,
  className,
}: ServiceCardsProps) {
  return (
    <div className={`flex justify-evenly ${className ?? ""}`}>
      {services.map((item) => (
        <div key={item.key} className="w-[22%] p-8 bg-[#fff] rounded-lg">
          <Image alt={item.title} height={120} src={item.src} width={170} />
          <h6 className="text-[18px] leading-[60px] font-bold">{item.title}</h6>
          <div className="text-[14px] leading-[24px] text-[#7d8fb3]">
            {item.describe}
          </div>
        </div>
      ))}
    </div>
  );
}
