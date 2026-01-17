"use client";

import React, { memo } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export default memo(function BusinessProgress({
  currentStep,
}: {
  currentStep: number;
}) {
  const t = useTranslations("components.ui.businessProgress"); // 从语言包读取步骤
  const steps = [
    t("step1"), // "选择商品"
    t("step2"), // "支付订单"
    t("step3"), // "质检与仓储"
    t("step4"), // "打包"
    t("step5"), // "收货"
  ];

  return (
    <div className="bg-[#ffeee1] h-[116px] rounded-2xl p-4 flex items-center justify-around mb-4 w-full">
      {steps.map((step, index) => {
        const isActive = index <= currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-sm font-bold">
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isActive
                    ? "bg-[#f0700c] text-white font-bold"
                    : "bg-[#ccc] text-white border-[#ffb98a]",
                )}
              >
                {index + 1}
              </div>
              <div
                className={clsx(
                  "mt-4",
                  isActive ? "text-[#f0700c]" : "text-[#ccc]",
                )}
              >
                {step}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 -mt-10 mx-4 border-t-2 border-dashed border-[#ffb98a]" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});
