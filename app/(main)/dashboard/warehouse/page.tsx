"use client";
import { Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";

import WarehouseItem from "./warehouse-item";

import Progress from "@/components/common/progress";
import PaginationBar from "@/components/common/pagination-bar";
import { useWarehouseList } from "@/hook/warehouse/useWarehouseList";

export default function WarehousePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useWarehouseList(page, pageSize);

  if (isLoading) return <div>加载中...</div>;

  return (
    <div className="flex w-full flex-col">
      <div className="mt-5">
        <Progress
          currentStep={1}
          steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
        />
      </div>
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
          key="all"
          title={
            <div className="flex items-center space-x-2">
              <span>全部</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            {data?.records?.map((warehouse: any) => (
              <WarehouseItem key={warehouse.id} warehouse={warehouse} />
            ))}
          </div>
          <div className="mt-10 sticky bottom-0 border-t-[1px] bg-white z-10 card-cart p-4 py-6  ">
            {(data?.total as number) > 0 && (
              <PaginationBar
                page={page}
                pageSize={pageSize}
                total={data?.total as number}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            )}
          </div>
        </Tab>
        <Tab
          key="waitPay"
          title={
            <div className="flex items-center space-x-2">
              <span>可提交包裹</span>
            </div>
          }
        >
          213
        </Tab>
      </Tabs>
    </div>
  );
}
