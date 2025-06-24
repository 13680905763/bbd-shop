"use client";

import { useState } from "react";
import { Button, Divider, Input } from "@heroui/react";
import { useRouter } from "next/navigation";

import CommonModal from "./common-modal";

import { createOrderByRecharge } from "@/services";

interface RechargeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const presetAmounts = [50, 100, 200, 500, 1000, 5000];

export default function RechargeModal({
  isOpen,
  onOpenChange,
}: RechargeModalProps) {
  const [amount, setAmount] = useState<string>("");
  const router = useRouter();

  const handlePresetClick = (value: number) => {
    setAmount(value.toString());
  };

  const handleConfirm = async () => {
    console.log("充值金额:", amount);

    const num = parseFloat(amount);

    if (!isNaN(num) && num > 0) {
      console.log("充值ZHONG");
      const res: any = await createOrderByRecharge({
        currencyAmount: 1,
        currencyCode: "CNY",
      });

      console.log("res", res);

      if (res.code === 200) {
        router.push(`/order/pay-order/${res.data}/?recharge=${true}`);
      }
      //   onOpenChange(false);
      setAmount(""); // reset after confirm
    } else {
      alert("请输入有效金额");
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      title="充值"
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <Input
        placeholder="请输入充值金额"
        value={amount}
        variant="bordered"
        onChange={(e) => setAmount(e.target.value)}
      />
      <Divider className="my-2" />
      <div className="grid grid-cols-3 gap-4">
        {presetAmounts.map((item) => (
          <Button
            key={item}
            className="border border-[#ccc] bg-white"
            onPress={() => handlePresetClick(item)}
          >
            {item}
          </Button>
        ))}
      </div>
    </CommonModal>
  );
}
