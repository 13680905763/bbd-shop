"use client";
import React, { useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import { useTranslations } from "next-intl";

import AddressTab from "./components/address-tab";
import ProfileTab from "./components/profile-tab";
import { SecurityTab } from "./components/security-tab";
import BillingAddressTab from "./components/billing-address-tab";

import UserBalanceCard, { UserInfo } from "@/components/wallet-card";
import { useUserStore, useWalletStore } from "@/store";
import { useBillingAddress } from "@/hook";
import { getWalletInfo } from "@/services/wallet";

interface TabConfig {
  key: string;
  component: React.ReactNode;
}

export default function DashBoard() {
  const user = useUserStore((state) => state.user);
  const wallet = useWalletStore((state) => state.wallet);
  const t = useTranslations("Dashboard.Page");

  useBillingAddress();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const wallet = await getWalletInfo();

        useWalletStore.getState().setWallet(wallet);
      } catch {}
    };

    fetchWallet();
  }, []);

  // 动态生成 Tabs 配置
  const tabLabels = t.raw("Tabs") as { key: string; label: string }[];
  const tabsConfig: TabConfig[] = tabLabels.map((tab) => {
    let component: React.ReactNode = null;

    switch (tab.key) {
      case "profile":
        component = <ProfileTab defaultformData={user} />;
        break;
      case "address":
        component = <AddressTab />;
        break;
      case "security":
        component = <SecurityTab />;
        break;
      case "billingAddress":
        component = <BillingAddressTab />;
        break;
    }

    return { key: tab.key, component };
  });

  return (
    <div className="flex flex-col gap-6 bg-[#f8f8f8] -mx-5">
      <UserBalanceCard
        availabalBalance={wallet?.availabalBalance ?? 0}
        score={5262}
        text={{
          balance: t("UserBalanceCard.balance"),
          score: t("UserBalanceCard.score"),
          vip: (level) => `VIP${level}`,
        }}
        userInfo={user as UserInfo}
      />

      <div className="bg-[#fff] rounded-lg flex-1">
        <div className="flex w-full flex-col px-5">
          <Tabs
            aria-label="Options"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0",
              cursor: "w-full bg-[#f0700c]",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-[#f0700c]",
            }}
            color="primary"
            variant="underlined"
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
      </div>
    </div>
  );
}
