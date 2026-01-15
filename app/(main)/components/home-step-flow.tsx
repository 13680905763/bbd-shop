// /components/home/StepFlow.tsx
"use client";

import { useTranslations } from "next-intl";
import React from "react";

export default function HomeStepFlow() {
  const t = useTranslations("home.steps");
  const steps = [
    {
      key: "step1",
      title: t("step1.title"),
      describe: t("step1.describe"),
    },
    {
      key: "step2",
      title: t("step2.title"),
      describe: t("step2.describe"),
    },
    {
      key: "step3",
      title: t("step3.title"),
      describe: t("step3.describe"),
    },
    {
      key: "step4",
      title: t("step4.title"),
      describe: t("step4.describe"),
    },
  ];

  return (
    <div className="h-[116px] rounded-2xl p-4 flex items-center justify-around mb-4 w-[70%]  ">
      {steps.map((step, index) => (
        <React.Fragment key={step.title}>
          <div className="flex flex-col items-center text-sm font-bold">
            {/* 圆圈编号 */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center
                bg-[#f0700c]/70 text-white font-bold text-xl shadow-md"
            >
              {index + 1}
            </div>

            {/* 步骤标题 */}
            <div className="mt-4 text-gray-800 font-semibold">{step.title}</div>

            {/* 步骤描述 */}
            <div className="mt-2 text-gray-800 font-medium text-center text-xs">
              {step.describe}
            </div>
          </div>

          {/* 中间虚线分隔 */}
          {index < steps.length - 1 && (
            <div className="flex-1 -mt-10 mx-4 border-t-2 border-dashed border-white/50" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
