import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import React from "react";
import clsx from "clsx";

import { useGlobalStore } from "@/store";

export default function CouponCard({ coupon }: { coupon: any }) {
  const t = useTranslations("components.block.coupon");
  const { currency } = useGlobalStore();

  const isAvailable = coupon.status === 1;
  // Use orange for available, gray for others
  const getBgClass = () => {
    if (!isAvailable) return "bg-[#cccccc]";
    switch (coupon.usedFor) {
      case 0:
        return "bg-[#f0700c]"; // All - Orange (Default)
      case 1:
        return "bg-[#ef4444]"; // Waybill - Red
      case 2:
        return "bg-[#8b5cf6]"; // Order - Purple
      default:
        return "bg-[#f0700c]";
    }
  };

  const bgClass = getBgClass();

  // Define badge styles based on usedFor value
  const getUsedForStyle = (usedFor: number) => {
    switch (usedFor) {
      case 0:
        return "bg-white/20 text-white"; // All
      case 1:
        return "bg-white/20 text-white"; // Waybill
      case 2:
        return "bg-white/20 text-white"; // Order
      default:
        return "bg-white/20 text-white";
    }
  };

  return (
    <div
      className={clsx(
        "w-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col relative text-white",
        bgClass,
      )}
    >
      {/* Top: Title */}
      <div className="p-4 pb-3 px-8">
        <div
          className="font-bold text-base line-clamp-1"
          title={coupon.couponTitle}
        >
          {coupon.couponTitle}
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="relative h-4 w-full">
        <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-white/50" />
        {/* Cutouts matching the page background */}
        <div className="absolute top-0 -left-2 w-4 h-4 bg-[#f8f8f8] rounded-full" />
        <div className="absolute top-0 -right-2 w-4 h-4 bg-[#f8f8f8] rounded-full" />
      </div>

      {/* Middle: Discount & Threshold */}
      <div className="px-6 py-3 flex items-baseline gap-2">
        <div className="font-bold text-3xl">
          {coupon.couponType === 1 ? (
            <>
              <span className=" mr-0.5">{currency.symbol}</span>
              {coupon.couponDenomination}
            </>
          ) : (
            <>
              {coupon?.couponDiscount
                ? Number(coupon.couponDiscount * 100)
                : "0"}
              <span className=" ml-0.5">%</span>
            </>
          )}
        </div>
        <div className="text-sm opacity-90">
          {t("minSpend", {
            amount: coupon.thresholdAmount,
          })}
        </div>

        <div
          className={clsx(
            "text-xs px-2 py-0.5 rounded-full font-medium ml-auto",
            getUsedForStyle(coupon.usedFor),
          )}
        >
          {coupon?.usedForMsg}
        </div>
      </div>

      {/* Bottom: Time & Description */}
      <div className="px-8 pb-4 flex flex-col gap-1 text-sm opacity-80">
        <div>
          {dayjs(coupon.createTime).format("YYYY-MM-DD")} ~{" "}
          {dayjs(coupon.expirationDate).format("YYYY-MM-DD")}
        </div>
        <div className="line-clamp-1" title={coupon.remark}>
          {coupon.remark}
        </div>
      </div>
    </div>
  );
}
