"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
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
  const t = useTranslations("components.modal.recharge");
  const { currency } = useGlobalStore();

  const [amount, setAmount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handlePresetClick = (value: number) => {
    setAmount(value.toString());
    setErrorMessage("");
  };

  // Normalize comma to dot for parsing
  const normalizeAmount = (val: string) => val.replace(/,/g, ".");

  const handleConfirm = async () => {
    if (!amount) {
      setErrorMessage(t("placeholder"));

      return;
    }

    const num = parseFloat(normalizeAmount(amount));

    if (isNaN(num) || num <= 0) {
      setErrorMessage(t("placeholder"));

      return;
    }

    if (!isNaN(num) && num > 0) {
      const bizCode: any = await createOrderByRecharge({
        currencyAmount: num,
        currencyCode: currency.label,
      });

      router.push(`/payment/${bizCode}`);
      setAmount(""); // reset after confirm
      setErrorMessage("");
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      title={t("title")}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-4">
        <Input
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">
                {currency.label}
              </span>
            </div>
          }
          errorMessage={errorMessage}
          isInvalid={!!errorMessage}
          placeholder={t("placeholder")}
          size="lg"
          type="text"
          inputMode="decimal"
          value={amount}
          variant="bordered"
          onChange={(e) => {
            // Only allow digits, dots, and commas
            const val = e.target.value.replace(/[^0-9.,]/g, "");
            setAmount(val);
            if (val) setErrorMessage("");
          }}
        />
        <div className="grid grid-cols-3 gap-3">
          {presetAmounts.map((item) => (
            <Button
              key={item}
              className={`border transition-colors ${
                amount === item.toString()
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-default-200 bg-transparent hover:bg-default-100"
              }`}
              variant="flat"
              onPress={() => handlePresetClick(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </CommonModal>
  );
}
