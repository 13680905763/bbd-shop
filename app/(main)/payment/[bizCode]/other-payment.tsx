import React from "react";
import { Radio, cn, Image } from "@heroui/react";

// 其他支付方式选项
export const OtherPayment = ({ payment }: any) => (
  <Radio
    classNames={{
      base: cn(
        "inline-flex min-w-[100%] w-full bg-content1 m-0 mb-2 hover:bg-content2 items-center justify-start",
        "cursor-pointer rounded-lg gap-2 p-3 border-1",
        "data-[selected=true]:border-primary",
      ),
      labelWrapper: "w-full",
      label: "w-full",
    }}
    value={payment.id}
  >
    <div className="w-full flex items-center gap-3">
      <Image
        className="object-contain"
        height={60}
        src={payment.logoUrl}
        width={60}
      />
      <span className="text-sm font-semibold">{payment.payName}</span>
    </div>
  </Radio>
);
