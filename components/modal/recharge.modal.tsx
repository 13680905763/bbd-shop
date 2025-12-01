"use client";

import { useState } from "react";
import { Button, Divider, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import CommonModal from "./common-modal";

import { createOrderByRecharge } from "@/services";
import { useGlobalStore } from "@/store";

interface RechargeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const presetAmounts = [50, 100, 200, 500, 1000, 5000];

export default function RechargeModal({
  isOpen,
  onOpenChange,
}: RechargeModalProps) {
  const t = useTranslations("Components.RechargeModal");
  const { currency } = useGlobalStore();

  const [amount, setAmount] = useState<string>("");
  const router = useRouter();

  const handlePresetClick = (value: number) => {
    setAmount(value.toString());
  };

  const handleConfirm = async () => {
    const num = parseFloat(amount);

    if (!isNaN(num) && num > 0) {
      const bizCode: any = await createOrderByRecharge({
        currencyAmount: Number(amount),
        currencyCode: currency.label,
      });

      router.push(`/payment/${bizCode}`);
      //   onOpenChange(false);
      setAmount(""); // reset after confirm
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      title={t("title")}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <Input
        placeholder={t("placeholder")}
        size="lg"
        type="number"
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
