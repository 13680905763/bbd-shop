import React, { useState, useEffect } from "react";
import { cn } from "@heroui/react";

import { CouponCard } from "@/components/block";
import CommonModal from "@/components/modal/common-modal";

interface CouponSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  couponList: any[];
  selectedCoupon: any;
  onConfirm: (coupon: any) => void;
  t: any;
  isFetching: boolean;
}

export const CouponSelectionModal = ({
  isOpen,
  onOpenChange,
  couponList,
  selectedCoupon: initialSelectedCoupon,
  onConfirm,
  t,
  isFetching,
}: CouponSelectionModalProps) => {
  const [tempSelectedCoupon, setTempSelectedCoupon] = useState<any>(
    initialSelectedCoupon,
  );

  useEffect(() => {
    if (isOpen) {
      setTempSelectedCoupon(initialSelectedCoupon);
    }
  }, [isOpen, initialSelectedCoupon]);

  return (
    <CommonModal
      confirmText={t("confirm") || "Confirm"}
      isDisabled={isFetching}
      isOpen={isOpen}
      showCancel={false}
      size="4xl"
      title={t("selectCoupon") || "Select Coupon"}
      onConfirm={() => {
        onConfirm(tempSelectedCoupon);
        onOpenChange(false);
      }}
      onOpenChange={onOpenChange}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {couponList.map((coupon: any) => (
          <div
            key={coupon.id}
            className={cn(
              "cursor-pointer rounded-lg border-2 transition-all relative flex items-center p-2 gap-3",
              tempSelectedCoupon?.id === coupon.id
                ? "border-[#f0700c] bg-[#fff5eb]"
                : "border-gray-200 hover:border-gray-300",
            )}
            role="button"
            onClick={() =>
              setTempSelectedCoupon(
                tempSelectedCoupon?.id === coupon.id ? null : coupon,
              )
            }
          >
            {/* Check Icon / Radio */}
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                tempSelectedCoupon?.id === coupon.id
                  ? "border-[#f0700c] bg-[#f0700c]"
                  : "border-gray-300",
              )}
            >
              {tempSelectedCoupon?.id === coupon.id && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                  />
                </svg>
              )}
            </div>

            {/* Card Content */}
            <div className="flex-1">
              <CouponCard coupon={coupon} />
            </div>
          </div>
        ))}
      </div>
    </CommonModal>
  );
};
