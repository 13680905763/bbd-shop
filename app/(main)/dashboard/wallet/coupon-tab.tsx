import React, { useState } from "react";
import { useTranslations } from "next-intl";

import { useUserCoupon } from "@/hook/api";
import CouponCard from "@/components/block/coupon-card";
import { Coupon } from "@/types/wallet";
import { CommonTabs } from "@/components/common";
import { BlockSpinner, EmptyState } from "@/components/ui";
import CouponRedemption from "./coupon-redemption";
const tabKeyToStatusCode: Record<string, number> = {
  unused: 1, // 可用
  used: 2, // 已使用
  expired: 3, // 过期
};

export default function CouponTab() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof tabKeyToStatusCode>("unused");
  const { data, isFetching } = useUserCoupon({
    status: tabKeyToStatusCode[activeTab],
  });
  const t = useTranslations("dashboard.wallet.coupon");
  const renderTabContent = () => {
    if (!data?.length && !isFetching) return <EmptyState />;

    return (
      <div className="relative">
        {isFetching && <BlockSpinner />}
        <div className="grid grid-cols-3 gap-6">
          {data?.map((coupon: Coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </div>
    );
  };
  const tabs = [
    { key: "unused", title: t("unused"), content: renderTabContent() },
    { key: "used", title: t("used"), content: renderTabContent() },
    { key: "expired", title: t("expired"), content: renderTabContent() },
  ];

  return (
    <>
      <CouponRedemption />
      <CommonTabs
        tabs={tabs}
        onSelectionChange={(key: any) => setActiveTab(key)}
      />
    </>
  );
}
