import { Avatar, Tab, Tabs } from "@heroui/react";
import React from "react";

export default function CouponTab() {
  return (
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
  );
}
