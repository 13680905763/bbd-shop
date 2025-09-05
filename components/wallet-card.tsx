"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Chip } from "@heroui/react";
import { IoWallet } from "react-icons/io5";

export interface UserInfo {
  name: string;
  email: string;
  avatarUrl?: string;
  vipLevel?: number;
}

interface BalanceButtonProps {
  label: string;
  amount: number | string;
  onClick: () => void;
}

const BalanceButton = ({ label, amount, onClick }: BalanceButtonProps) => (
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

interface UserBalanceCardProps {
  userInfo: UserInfo;
  availabalBalance: number;
  score?: number;
  bgColor?: string;
  text: {
    balance: string;
    score: string;
    vip: (level: number) => string;
  };
}

const UserBalanceCard = ({
  userInfo,
  availabalBalance,
  score = 0,
  bgColor = "bg-[#ffeee1]",
  text,
}: UserBalanceCardProps) => {
  const router = useRouter();

  return (
    <div className={`flex justify-between rounded-lg p-8 ${bgColor}`}>
      {/* 左侧用户信息 */}
      <div className="flex flex-1 items-center gap-6">
        <Avatar className="w-20 h-20 text-large" src={userInfo.avatarUrl} />
        <div className="flex-1">
          <p className="text-title-2xl">{userInfo.name}</p>
          <p>{userInfo.email}</p>
          <Chip color="primary" size="sm">
            {text.vip(userInfo.vipLevel ?? 1)}
          </Chip>
        </div>
      </div>

      {/* 右侧余额/积分按钮 */}
      <div className="flex gap-4 flex-[2]">
        <BalanceButton
          amount={availabalBalance ?? 0}
          label={text.balance}
          onClick={() => router.push("/dashboard/wallet?tab=balance")}
        />
        <BalanceButton
          amount={score}
          label={text.score}
          onClick={() => router.push("/dashboard/wallet?tab=score")}
        />
      </div>
    </div>
  );
};

export default UserBalanceCard;
