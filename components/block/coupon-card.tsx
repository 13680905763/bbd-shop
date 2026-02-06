import { Coupon } from "@/types/wallet";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import React from "react";
import clsx from "clsx";

export default function CouponCard({ coupon }: { coupon: any }) {
   const t = useTranslations("components.block.coupon");

   const isAvailable = coupon.status === 1;
   const themeColor = isAvailable ? "bg-[#f0700c]" : "bg-[#999999]";

   return (
      <div className="w-full h-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white border border-gray-100 flex flex-col ">
         <div className={clsx("py-6 px-4 flex flex-col justify-center items-center text-white gap-6", themeColor)}>
            {/* <div className="font-medium text-xl opacity-95 text-center">
               {t("minSpend", { amount: coupon.thresholdAmount })}
            </div> */}
            <div className="border-2 border-dashed border-white/70  px-6 py-2 flex items-baseline justify-center w-full">
               {coupon.couponType === 1 ? (
                  <>
                     <span className="text-2xl font-bold">{coupon.thresholdAmount}-{coupon.couponDenomination}</span>
                  </>
               ) : (
                  <span className="text-2xl font-bold">{coupon?.discount ? Number(coupon.discount * 100) : "0"}%</span>
               )}
            </div>
         </div>

         <div className="p-5 flex flex-col gap-3 text-sm text-gray-600 bg-[#f9fafb] flex-1">
            <div className="flex flex-col gap-2.5 flex-1">
               <div className="flex items-start">
                  <span className="text-gray-800 w-[70px] flex-shrink-0 font-bold">{t("type")}:</span>
                  <span className="text-gray-700 flex-1 leading-snug scale-90 origin-left">{coupon?.couponTypeMsg}</span>
               </div>
               <div className="flex items-start">
                  <span className="text-gray-800 w-[70px] flex-shrink-0 font-bold">{t("src")}:</span>
                  <span className="text-gray-700 flex-1 leading-snug scale-90 origin-left">{coupon.srcMsg}</span>
               </div>
            </div>

            <div className="border-t border-dashed border-gray-200 mt-3 pt-3 text-gray-400 flex flex-col items-center text-xs gap-1">
               <div className="font-medium">{dayjs(coupon.createTime).format("YYYY/MM/DD")} - {dayjs(coupon.expirationDate).format("YYYY/MM/DD")}</div>
            </div>
         </div>
      </div>
   );
}
