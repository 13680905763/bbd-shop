import React from "react";
import clsx from "clsx";

type OrderProgressProps = {
  steps: string[];
  currentStep: number; // 从 0 开始的索引
};

const Progress: React.FC<OrderProgressProps> = ({ steps, currentStep }) => {
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
                    ? "bg-[#f0700c] text-[#fff] font-bold"
                    : "bg-[#ccc] text-white  border-[#ffb98a]",
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
};

export default Progress;
