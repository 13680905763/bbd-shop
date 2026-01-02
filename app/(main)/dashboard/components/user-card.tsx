"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Chip } from "@heroui/react";
import { IoWallet } from "react-icons/io5";
import { useTranslations } from "next-intl";

import { useGlobalStore } from "@/store";

interface BalanceButtonProps {
  label: string;
  amount: number | string;
  onClick: () => void;
}

export const BalanceButton = ({
  label,
  amount,
  onClick,
}: BalanceButtonProps) => {
  return (
    <button
      aria-label={`${label}: ${amount}`}
      className="flex-1"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 p-5">
        <IoWallet className="w-5 h-5 text-[#f0700c]" />
        <div>{label}</div>
        <div className="flex items-center gap-2">
          <span className="text-money-3xl">{amount}</span>
        </div>
      </div>
    </button>
  );
};

export const UserBalanceCard = ({ userInfo, availabalBalance, score }: any) => {
  const t = useTranslations("dashboard.page.userBalanceCard");

  const router = useRouter();
  const { currency } = useGlobalStore();

  return (
    <div className={`flex justify-between rounded-lg p-8 bg-[#ffeee1]`}>
      {/* 左侧用户信息 */}
      <div className="flex flex-1 items-center gap-6">
        <Avatar className="w-20 h-20 text-large" src={userInfo?.avatarUrl} />
        <div className="flex-1">
          <p className="text-title-2xl">{userInfo?.nickName}</p>
          <p>{userInfo?.email}</p>
          <Chip color="primary" size="sm">
            VIP{userInfo?.vipLv}
          </Chip>
        </div>
      </div>

      {/* 右侧余额/积分按钮 */}
      <div className="flex gap-4 flex-[2]">
        <BalanceButton
          amount={`${currency.symbol}${availabalBalance}`}
          label={t("balance")}
          onClick={() => router.push("/dashboard/wallet?tab=balance")}
        />
        <BalanceButton
          amount={score}
          label={t("score")}
          onClick={() => router.push("/dashboard/wallet?tab=score")}
        />
      </div>
    </div>
  );
};
