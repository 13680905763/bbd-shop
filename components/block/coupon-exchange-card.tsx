import { useTranslations } from "next-intl";
import React from "react";
import clsx from "clsx";

import { useGlobalStore } from "@/store";

interface CouponExchangeCardProps {
  coupon: any;
  onExchange?: (coupon: any) => void;
}

export default function CouponExchangeCard({
  coupon,
  onExchange,
}: CouponExchangeCardProps) {
  const t = useTranslations("components.ui.coupon");
  const { currency } = useGlobalStore();

  const bgClass = "bg-[#f0700c]";

  return (
    <div
      className={clsx(
        "w-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col relative text-white",
        bgClass,
      )}
    >
      {/* Top: Title */}
      <div className="p-4 pb-3 px-8">
        <div className="font-bold text-base line-clamp-1" title={coupon.title}>
          {coupon.title}
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="relative h-4 w-full">
        <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-white/50" />
        <div className="absolute top-0 -left-2 w-4 h-4 bg-[#f8f8f8] rounded-full" />
        <div className="absolute top-0 -right-2 w-4 h-4 bg-[#f8f8f8] rounded-full" />
      </div>

      {/* Middle: Discount & Threshold */}
      <div className="px-8 py-3 flex items-baseline gap-3">
        <div className="font-bold text-4xl">
          {coupon.type === 1 ? (
            <>
              <span className="mr-0.5">{currency.symbol}</span>
              {coupon.denomination}
            </>
          ) : (
            <>
              {coupon?.discount ? Number(coupon.discount * 100) : "0"}
              <span className="ml-0.5">%</span>
            </>
          )}
        </div>
        <div className="text-sm opacity-90">
          {t("minSpend", {
            amount: Math.floor(Number(coupon.thresholdAmount)),
          })}
        </div>
      </div>

      {/* Bottom: Validity & Points & Button */}
      <div className="px-8 pb-4 flex flex-col gap-2 text-sm opacity-80">
        <div className="flex justify-between items-center">
          <div>
            {t("validity")}: {t("days", { count: coupon.expirationDate })}
          </div>
        </div>

        <div className="flex justify-between items-center mt-1">
          <div className="font-bold text-base text-white">
            {coupon.exchangePoints} {t("points")}
          </div>
          {onExchange && (
            <button
              className="bg-white text-[#f0700c] px-6 py-2 rounded-lg text-xs font-bold bg-white "
              onClick={() => onExchange(coupon)}
            >
              {t("redeem")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
