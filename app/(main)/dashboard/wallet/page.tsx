"use client";
import { Tab, Tabs } from "@heroui/react";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

import BalanceTab from "./balance-tab";
import ScoreTab from "./score-tab";
import CouponTab from "./coupon-tab";

const TABS = ["balance", "score", "coupon"] as const;

type TabKey = (typeof TABS)[number];
export default function WalletPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = searchParams.get("tab") || "balance";

  const changeTab = useCallback(
    (key: React.Key) => {
      const tabKey = key as TabKey;

      router.push(`/dashboard/wallet?tab=${tabKey}`);
    },
    [router],
  );

  return (
    <div className="flex w-full flex-col ">
      <Tabs
        aria-label="Options"
        classNames={{
          base: "mt-2 w-full bg-white p-2",
          tabList: "gap-6 w-full relative rounded-none p-0 ",
          cursor: "w-full bg-[#f0700c] ",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#f0700c]",
        }}
        color="primary"
        selectedKey={currentTab}
        variant="underlined"
        onSelectionChange={changeTab}
      >
        <Tab
          key="balance"
          title={
            <div className="flex items-center space-x-2">
              <span>余额</span>
            </div>
          }
        >
          <BalanceTab />
        </Tab>
        <Tab
          key="score"
          title={
            <div className="flex items-center space-x-2">
              <span>积分</span>
            </div>
          }
        >
          <ScoreTab />
        </Tab>
        <Tab
          key="coupon"
          title={
            <div className="flex items-center space-x-2">
              <span>优惠券</span>
            </div>
          }
        >
          <CouponTab />
        </Tab>
      </Tabs>
    </div>
  );
}
