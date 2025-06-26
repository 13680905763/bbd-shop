"use client";
import { Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import OrderItem from "./order-item";

import Progress from "@/components/common/progress";
import { getOrderList } from "@/services";
import PaginationBar from "@/components/common/pagination-bar";

export default function OrderPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderList, setOrderList] = useState<any>([]);
  const [total, setTotal] = useState(0); // 记得在请求时设置
  const router = useRouter();
  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/order/pay-order/${bizCode}`);
  };

  useEffect(() => {
    getOrderList({ current: page, size: pageSize }).then((res) => {
      console.log("res", res);

      setOrderList(res.data.records);
      setTotal(res.data.total); // 设置总条数
    });
  }, [page, pageSize]);

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
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <span>全部</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            {orderList?.map((order: any) => (
              <OrderItem
                key={order.id}
                order={order}
                onPayOrderRedirect={onPayOrderRedirect}
              />
            ))}
          </div>
          <div className="mt-10 sticky bottom-0 border-t-[1px] bg-white z-10 card-cart p-4 py-6  ">
            {total > 0 && (
              <PaginationBar
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            )}
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
      </Tabs>
    </div>
  );
}
