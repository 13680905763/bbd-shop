"use client";
import React from "react";
import { Tabs, Tab } from "@heroui/react";

import AddressTab from "./components/address-tab";
import ProfileTab from "./components/profile-tab";
import { SecurityTab } from "./components/security-tab";
import BillingAddressTab from "./components/billing-address-tab";

import UserBalanceCard from "@/components/wallet-card";
import { useUserStore, useWalletStore } from "@/store";
import { useBillingAddress } from "@/hook";

export default function DashBoard() {
  const user = useUserStore((state) => state.user);
  const wallet = useWalletStore((state) => state.wallet);

  useBillingAddress();

  return (
    <div className=" flex flex-col gap-6 bg-[#f8f8f8] -mx-5">
      <UserBalanceCard
        availabalBalance={wallet?.availabalBalance as number}
        balanceUSD="66.55"
        userInfo={user}
      />

      <div className="bg-[#fff] rounded-lg flex-1">
        <div className="flex w-full flex-col px-5">
          <Tabs
            aria-label="Options"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0  ",
              cursor: "w-full bg-[#f0700c]",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-[#f0700c]",
            }}
            color="primary"
            variant="underlined"
          >
            <Tab
              key="profile"
              title={
                <div className="flex items-center space-x-2">
                  <span>个人信息</span>
                </div>
              }
            >
              <ProfileTab defaultformData={user} />
            </Tab>
            <Tab
              key="address"
              title={
                <div className="flex items-center space-x-2">
                  <span>收货地址</span>
                </div>
              }
            >
              <AddressTab />
            </Tab>
            <Tab
              key="security"
              title={
                <div className="flex items-center space-x-2">
                  <span>账号安全</span>
                </div>
              }
            >
              <SecurityTab />
            </Tab>
            <Tab
              key="billingAddress"
              title={
                <div className="flex items-center space-x-2">
                  <span>信用卡账单地址</span>
                </div>
              }
            >
              <BillingAddressTab />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
