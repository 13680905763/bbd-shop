"use client";

import { useState, useMemo, useEffect } from "react";
import { Input, addToast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { IoInformationCircleOutline } from "react-icons/io5";

import CommonModal from "./common-modal";

import { useGlobalStore } from "@/store";
import { useApplyWithdrawal } from "@/hook/api";

interface WithdrawModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  balance?: number;
}

export default function WithdrawModal({
  isOpen,
  onOpenChange,
  balance = 0,
}: WithdrawModalProps) {
  // using recharge translation for common terms if needed, or fallback to hardcoded
  const t = useTranslations("components.modal.withdraw");
  const { currency } = useGlobalStore();
  const { mutateAsync: applyWithdrawal } = useApplyWithdrawal();

  const [amount, setAmount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const feeRate = 0.01;

  useEffect(() => {
    if (!isOpen) {
      setAmount("");
      setErrorMessage("");
    }
  }, [isOpen]);

  const { fee, finalAmount } = useMemo(() => {
    const num = parseFloat(amount);

    if (isNaN(num) || num <= 0) {
      return { fee: 0, finalAmount: 0 };
    }
    const calculatedFee = num * feeRate;
    const calculatedFinalAmount = num - calculatedFee;

    return { fee: calculatedFee, finalAmount: calculatedFinalAmount };
  }, [amount]);

  const handleConfirm = async () => {
    if (!amount) {
      setErrorMessage(t("placeholder"));

      return;
    }

    const num = parseFloat(amount);

    if (isNaN(num) || num <= 0) {
      setErrorMessage(t("placeholder"));

      return;
    }

    try {
      await applyWithdrawal({
        currencyAmount: num,
        currencyCode: currency.label,
      });

      addToast({
        title: t("successTitle"),
        color: "success",
        timeout: 1000,
      });

      onOpenChange(false);
      setAmount("");
      setErrorMessage("");
    } catch (error: any) {
      // Error is handled by the hook's onError callback
      console.error(error);
      addToast({
        title: error?.message || t("failMessage"),
        color: "danger",
        timeout: 1000,
      });
    }
  };

  const handleMaxClick = () => {
    setAmount(balance.toString());
    setErrorMessage("");
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
          classNames={{
            input: "text-lg",
          }}
          endContent={
            <div className="flex items-center gap-2">
              <span className="text-default-400 text-small">
                {currency.label}
              </span>
              <button
                className="text-primary text-small font-medium transition-colors cursor-pointer outline-none"
                type="button"
                onClick={handleMaxClick}
              >
                Max
              </button>
            </div>
          }
          errorMessage={errorMessage}
          isInvalid={!!errorMessage}
          label={t("title")}
          placeholder={t("placeholder")}
          size="lg"
          type="number"
          value={amount}
          variant="bordered"
          onChange={(e) => {
            let val = e.target.value;

            if (parseFloat(val) > balance) {
              val = balance.toString();
            }
            setAmount(val);
            if (val) setErrorMessage("");
          }}
        />

        <div className="flex justify-end text-small text-default-500 -mt-2">
          <span>
            {t("available")}:{" "}
            <span className="text-default-700 font-medium">
              {currency.symbol}
              {balance}
            </span>
          </span>
        </div>

        <div className="rounded-medium bg-default-100 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-small text-default-500">{t("fee")}:</span>
            <span className="text-small font-medium ">
              -{currency.symbol}
              {fee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-default-200 pt-2 mt-2">
            <span className="font-semibold text-default-700">
              {t("receive")}:
            </span>
            <span className="font-bold  text-xl">
              {currency.symbol}
              {finalAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-3 text-sm text-[#f0700c]   rounded-lg">
            <IoInformationCircleOutline className="w-4 h-4 flex-shrink-0" />
            <span>{t("tip")}</span>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
