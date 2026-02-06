"use client";
import React from "react";
import { useTranslations } from "next-intl";

import {
  AddressTab,
  SecurityTab,
  UserBalanceCard,
  ProfileTab,
} from "./components";

import { BillingAddress } from "@/components/domain";
import { CommonTabs } from "@/components/common";

export default function DashBoard() {
  const t = useTranslations("dashboard.page");

  const tabs = [
    {
      key: "profile",
      title: t("tabs.profile"),
      content: <ProfileTab />,
    },
    {
      key: "address",
      title: t("tabs.address"),
      content: <AddressTab />,
    },
    {
      key: "security",
      title: t("tabs.security"),
      content: <SecurityTab />,
    },
    {
      key: "billingAddress",
      title: t("tabs.billingAddress"),
      content: <BillingAddress />,
    },
  ];

  return (
    <div className="flex flex-col gap-6 bg-[#f8f8f8] -mx-5">
      <UserBalanceCard />
      <div className="bg-[#fff] rounded-lg flex-1 flex w-full flex-col px-5">
        <CommonTabs tabs={tabs} />
      </div>
    </div>
  );
}
