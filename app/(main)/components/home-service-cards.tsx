// /components/home/ServiceCards.tsx
"use client";

import React from "react";
import { Image } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function HomeServiceCards() {
  const t = useTranslations("home.services");

  const services = [
    {
      key: "service1",
      title: t("service1.title"),
      describe: t("service1.describe"),
      src: "/images/page/icon01.png",
    },
    {
      key: "service2",
      title: t("service2.title"),
      describe: t("service2.describe"),
      src: "/images/page/icon02.png",
    },
    {
      key: "service3",
      title: t("service3.title"),
      describe: t("service3.describe"),
      src: "/images/page/icon03.png",
    },
    {
      key: "service4",
      title: t("service4.title"),
      describe: t("service4.describe"),
      src: "/images/page/icon04.png",
    },
  ];

  return (
    <div className="flex justify-evenly">
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
