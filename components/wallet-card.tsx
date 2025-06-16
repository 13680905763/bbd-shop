import { IoWallet } from "react-icons/io5";
import React from "react";
import { Avatar, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";

interface UserBalanceCardProps {
  type?: string;
  availabalBalance: string;
  balanceUSD: string;
  bgColor?: string;
  children?: React.ReactNode; // 左侧内容插槽
  userInfo: any;
}

const UserBalanceCard = ({
  availabalBalance,
  userInfo,
}: UserBalanceCardProps) => {
  const router = useRouter();

  return (
    <div className="flex justify-between bg-[#fff] rounded-lg  p-8">
      <div className="flex  flex-1 items-center gap-6">
        <Avatar className="w-20 h-20 text-large" src={userInfo.avatarUrl} />
        <div className="flex-1">
          <p className="text-title-2xl">{userInfo.name}</p>
          <p>{userInfo.email}</p>
          <Chip color="primary" size="sm">
            VIP1
          </Chip>
        </div>
      </div>
      <div className="flex gap-4 flex-[2]">
        <button
          className="flex-1"
          onClick={() => router.push("/dashboard/wallet?tab=balance")}
        >
          <div className=" flex items-center gap-2 p-5">
            <IoWallet className="w-5 h-5 text-[#f0700c]" />
            <div>余额</div>
            <div className="flex items-center gap-2">
              <span className="text-money-3xl">
                ￥{availabalBalance ?? null}
              </span>
            </div>
          </div>
        </button>
        <button
          className="flex-1"
          onClick={() => router.push("/dashboard/wallet?tab=score")}
        >
          <div className=" flex items-center gap-2 p-5">
            <IoWallet className="w-5 h-5 text-[#f0700c]" />
            <div>积分</div>
            <div className="flex items-center gap-2">
              <span className="text-money-3xl">5262</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default UserBalanceCard;
