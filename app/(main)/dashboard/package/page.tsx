"use client";
import { Button, Tab, Tabs, useDisclosure } from "@heroui/react";
import React from "react";

import CommonGoodsItem from "@/components/common-goods-item";

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
    label: "收货人",
  },
  {
    key: "role",
    label: "电话",
  },
  {
    key: "status",
    label: "详情地址",
  },
  {
    key: "actions",
    label: "操作",
  },
];

export default function PackagePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const renderCell = React.useCallback((rows: any, columnKey: any) => {
    const cellValue = rows[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button onPress={onOpen}>查看详情</Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
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
              <span>全部</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <CommonGoodsItem
              createdAt="2025-04-26 03:21:07"
              items={[
                {
                  imageUrl: "https://heroui.com/images/hero-card-complete.jpeg",
                  title:
                    "裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生阔腿卫裤",
                  specs: "颜色: 黑色+白花灰; 尺码: L",
                  remark: "",
                  quantity: 123,
                  unitPrice: 266,
                  totalPrice: 266,
                  domesticShipping: 0,
                },
              ]}
              orderId="CNF48892882637667"
              status="未支付"
            />
          </div>
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>未支付</span>
            </div>
          }
        >
          312
        </Tab>
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <span>已支付</span>
            </div>
          }
        >
          31231
        </Tab>
        <Tab
          key="video2s"
          title={
            <div className="flex items-center space-x-2">
              <span>已发货</span>
            </div>
          }
        >
          31231
        </Tab>
        <Tab
          key="videos3"
          title={
            <div className="flex items-center space-x-2">
              <span>已收货</span>
            </div>
          }
        >
          31231
        </Tab>
      </Tabs>
    </div>
  );
}
