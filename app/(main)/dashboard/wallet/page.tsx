"use client";
import React, { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import BalanceTab from "./balance-tab";
import ScoreTab from "./score-tab";
import CouponTab from "./coupon-tab";

import { CommonTabs } from "@/components/common";
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
  const tabs = [
    { key: "balance", title: t("tab.balance"), content: <BalanceTab /> },
    { key: "score", title: t("tab.score"), content: <ScoreTab /> },
    { key: "coupon", title: t("tab.coupon"), content: <CouponTab /> },
  ];

  return (
    <div className="flex w-full flex-col">
      <CommonTabs
        defaultSelectedKey={currentTab}
        tabs={tabs}
        onSelectionChange={(key) => changeTab(key)}
      />
    </div>
  );
}
