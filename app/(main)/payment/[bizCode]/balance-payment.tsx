import React, { useState } from "react";
import { Button } from "@heroui/react";
import { IoWallet } from "react-icons/io5";

import { CustomRadio } from "./custom-radio";

import { useGlobalStore } from "@/store";
import { price } from "@/components/primitives";
import RechargeModal from "@/components/modal/recharge.modal";

// 余额支付选项
export const BalancePayment = ({ payment, wallet, t }: any) => {
  const { currency } = useGlobalStore();
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);

  return (
    <>
      <CustomRadio value={payment.id}>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <IoWallet className="w-14 h-14 text-[#f0700c]" />
            <div>{t("balance")}</div>
            <div className={price({ size: "xl2" })}>
              {currency.symbol}
              {wallet?.availabalBalance}
            </div>
          </div>
          <Button color="primary" onPress={() => setIsRechargeOpen(true)}>
            {t("recharge")}
          </Button>
        </div>
      </CustomRadio>
      <RechargeModal isOpen={isRechargeOpen} onOpenChange={setIsRechargeOpen} />
    </>
  );
};
