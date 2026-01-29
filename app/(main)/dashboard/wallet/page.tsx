"use client";
import { Tab, Tabs } from "@heroui/react";
import React, { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import BalanceTab from "./balance-tab";
import ScoreTab from "./score-tab";
import CouponTab from "./coupon-tab";

interface TabConfig {
  key: string;
  component: React.ReactNode;
}

export default function WalletPage() {
  const t = useTranslations("dashboard.wallet");

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "balance";

  const changeTab = useCallback(
    (key: React.Key) => {
      router.push(`/dashboard/wallet?tab=${key}`);
    },
    [router],
  );

  // 动态生成 Tabs 配置
  const tabLabels = [
    { key: "balance", label: t("tab.balance") },
    { key: "score", label: t("tab.score") },
    { key: "coupon", label: t("tab.coupon") },
  ];

  const tabsConfig: TabConfig[] = tabLabels.map((tab) => {
    let component: React.ReactNode = null;

    switch (tab.key) {
      case "balance":
        component = (
          <BalanceTab />
        );
        break;
      case "score":
        component = (
          <ScoreTab />
        );
        break;
      case "coupon":
        component = <CouponTab />;
        // component = <div>coupon</div>;
        break;
    }

    return { key: tab.key, component };
  });

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Wallet Tabs"
        classNames={{
          base: "mt-2 w-full bg-white p-2",
          tabList: "gap-6 w-full relative rounded-none p-0",
          cursor: "w-full bg-[#f0700c]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#f0700c]",
        }}
        color="primary"
        selectedKey={currentTab}
        variant="underlined"
        onSelectionChange={changeTab}
      >
        {tabLabels.map((tab) => (
          <Tab
            key={tab.key}
            title={
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
              </div>
            }
          >
            {tabsConfig.find((c) => c.key === tab.key)?.component}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
