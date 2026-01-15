"use client";
import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { useTranslations } from "next-intl";

import {
  AddressTab,
  SecurityTab,
  UserBalanceCard,
  ProfileTab
} from "./components";

import { BillingAddress } from "@/components/domain";

interface TabConfig {
  key: string;
  component: React.ReactNode;
}

export default function DashBoard() {
  const t = useTranslations("dashboard.page");
  // 动态生成 Tabs 配置
  const tabs = [
    {
      key: "profile",
      label: t("tabs.profile"),
    },
    {
      key: "address",
      label: t("tabs.address"),
    },
    {
      key: "security",
      label: t("tabs.security"),
    },
    {
      key: "billingAddress",
      label: t("tabs.billingAddress"),
    },
  ];
  const tabsConfig: TabConfig[] = tabs.map((tab) => {
    let component: React.ReactNode = null;

    switch (tab.key) {
      case "profile":
        component = <ProfileTab />;
        break;
      case "address":
        component = <AddressTab />;
        break;
      case "security":
        component = <SecurityTab />;
        break;
      case "billingAddress":
        component = <BillingAddress />;
        break;
    }

    return { key: tab.key, component };
  });
  return (
    <div className="flex flex-col gap-6 bg-[#f8f8f8] -mx-5">
      <UserBalanceCard/>

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
            {tabs.map((tab) => (
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
