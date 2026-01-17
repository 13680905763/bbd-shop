import React from "react";
import { Avatar } from "@heroui/react";
import { useTranslations } from "next-intl";

import { RouteItem } from "./types";

import { useGlobalStore } from "@/store";

interface RouteItemHeaderProps {
  route: RouteItem;
}
export default function RouteItemHeader({ route }: RouteItemHeaderProps) {
  const t = useTranslations("estimation");
  const { currency } = useGlobalStore();

  return (
    <>
      <div className="flex gap-5 items-start">
        <div className="flex flex-col justify-center items-center w-[240px]">
          <Avatar className="w-20 h-20" radius="sm" src={route.logoUrl} />
          <p className="mt-1 text-sm font-semibold text-center">
            {route.templateName}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-[220px]">
          <div className="text-gray-500 text-sm">{t("price")}</div>
          <div className="text-lg font-bold">
            {currency.symbol}&nbsp;
            {route.shippingFee}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-[220px]">
          <div className="text-gray-500 text-sm">{t("time")}</div>
          <div className="text-lg font-bold">
            {route.shippingLine.minDays}-{route.shippingLine.maxDays} days
          </div>
        </div>
        <div className="flex-1">
          <span className="text-sm text-[#acacac] font-normal">
            {route.shippingLine.description}
          </span>
        </div>
      </div>
      {route.disable && route.prompt && (
        <div className="mt-2 p-2 bg-red-50 text-red-500 text-sm rounded-lg text-center">
          {route.prompt}
        </div>
      )}
    </>
  );
}
