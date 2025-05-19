"use client";
import {
  Avatar,
  getKeyValue,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@heroui/react";
import React from "react";

import UserBalanceCard from "@/components/wallet-card";
const rows = [
  {
    key: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
];

const columns = [
  {
    key: "name",
    label: "AC单号",
  },
  {
    key: "role",
    label: "类型",
  },
  {
    key: "status",
    label: "收入/支出",
  },
];

export default function WalletPage() {
  return (
    <div className="flex w-full flex-col ">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 ",
          cursor: "w-full bg-[#f0700c]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#f0700c]",
        }}
        color="primary"
        variant="underlined"
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <span>余额</span>
            </div>
          }
        >
          <UserBalanceCard
            balanceCNY="52,999.68"
            balanceUSD="66.55"
            bgColor="bg-[#ffeee1]"
          />
          <div className="font-bold my-4">余额流水</div>
          <Table
            removeWrapper
            aria-label="Example table with dynamic content"
            classNames={{}}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>积分</span>
            </div>
          }
        >
          <UserBalanceCard
            balanceCNY="52,999.68"
            balanceUSD="66.55"
            bgColor="bg-[#ffeee1]"
            type="score"
          />

          <div className="font-bold my-4">积分流水</div>
          <Table
            removeWrapper
            aria-label="Example table with dynamic content"
            classNames={{}}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Tab>
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <span>优惠券</span>
            </div>
          }
        >
          <Tabs
            aria-label="Options"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 ",
              cursor: "w-full bg-transparent",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-[#f0700c]",
            }}
            color="primary"
            variant="underlined"
          >
            <Tab
              key="photos"
              title={
                <div className="flex items-center space-x-2">
                  <span>可用优惠券</span>
                </div>
              }
            >
              <div className="w-full p-5 rounded-lg border border-[#ccc] flex justify-between items-center">
                <div className="flex gap-6">
                  <div>
                    <Avatar
                      size="lg"
                      src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
                    />
                  </div>
                  <div>
                    <div className="text-money-xl">CAD 999</div>
                    <div className="text-xs">
                      <div>所需积分：50</div>
                      <div>需要会员等级：1</div>
                    </div>
                  </div>
                </div>
                <div>未使用</div>
              </div>
            </Tab>
            <Tab
              key="music"
              title={
                <div className="flex items-center space-x-2">
                  <span>已使用优惠券</span>
                </div>
              }
            >
              123
            </Tab>
            <Tab
              key="music1"
              title={
                <div className="flex items-center space-x-2">
                  <span>已过期优惠券</span>
                </div>
              }
            >
              321
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>
    </div>
  );
}
