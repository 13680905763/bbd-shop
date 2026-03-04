import React from "react";
import { useTranslations } from "next-intl";

import { CouponCard } from "@/components/block";

interface CouponSelectorProps {
  couponList: any[];
  selectedCoupon: any;
  onOpenModal: () => void;
}

export const CouponSelector = ({
  couponList,
  selectedCoupon,
  onOpenModal,
}: CouponSelectorProps) => {
  const t = useTranslations("payment");

  if (!couponList || couponList.length === 0) {
    return null;
  }

  return (
    <div className="my-4">
      <p className="text-title mb-2">{t("coupon")}</p>
      {selectedCoupon ? (
        <div
          className="relative group cursor-pointer"
          role="button"
          onClick={onOpenModal}
        >
          <CouponCard coupon={selectedCoupon} />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg text-white font-medium">
            {t("changeCoupon") || "Change Coupon"}
          </div>
        </div>
      ) : (
        <div
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-between cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
          role="button"
          onClick={onOpenModal}
        >
          <span className="text-gray-600 font-medium">
            {t("selectCoupon") || "Select Coupon"}
          </span>
          <span className="text-primary font-bold">
            {couponList.length} {t("available") || "Available"} &gt;
          </span>
        </div>
      )}
    </div>
  );
};
