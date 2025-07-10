import { IoWallet } from "react-icons/io5";
import React from "react";

interface WalletCardProps {
  number: number;
  title: string;
  actions?: React.ReactNode;
}

export default function WalletCard({
  number,
  title,
  actions,
}: WalletCardProps) {
  return (
    <div className="flex justify-between bg-[#ffeee1] rounded-lg  p-8">
      <div className="flex gap-4 flex-[2]">
        <>
          <div className="flex-1 flex items-center gap-2 p-5">
            <IoWallet className="w-5 h-5 text-[#f0700c]" />
            <div>{title}</div>
            <div className="flex items-center gap-2">
              <span className="text-money-3xl">{number}</span>
            </div>
          </div>
          {actions && <div className="flex items-center gap-4">{actions}</div>}
        </>
      </div>
    </div>
  );
}
