"use client";
import { Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import OrderItem from "./order-item";

import Progress from "@/components/common/progress";
import PaginationBar from "@/components/common/pagination-bar";
import { useOrderList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};

export default function OrderPage() {
  // 传入订单状态，例如 "ALL"、"WAIT_PAY"
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const { data, isLoading } = useOrderList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  );

  console.log("data", data);

  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/order/pay-order/${bizCode}`);
  };
  const EmptyOrder = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
      <p className="text-lg mb-2">暂无订单</p>
    </div>
  );

  if (isLoading) return <FullscreenLoader loading={isLoading} />;

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
        onSelectionChange={(key) => {
          setActiveTab(String(key));
          setPage(1);
        }}
      >
        <Tab
          key="all"
          title={
            <div className="flex items-center space-x-2">
              <span>全部</span>
            </div>
          }
        >
          {data?.records?.length ? (
            <>
              <div className="flex flex-col gap-3">
                {data?.records?.map((order: any) => (
                  <OrderItem
                    key={order.id}
                    order={order}
                    onPayOrderRedirect={onPayOrderRedirect}
                  />
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
            </>
          ) : (
            <EmptyOrder />
          )}
        </Tab>
        <Tab
          key="waitPay"
          title={
            <div className="flex items-center space-x-2">
              <span>未支付</span>
            </div>
          }
        >
          {data?.records?.length ? (
            <>
              <div className="flex flex-col gap-3">
                {data?.records?.map((order: any) => (
                  <OrderItem
                    key={order.id}
                    order={order}
                    onPayOrderRedirect={onPayOrderRedirect}
                  />
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
            </>
          ) : (
            <EmptyOrder />
          )}
        </Tab>
        <Tab
          key="paid"
          title={
            <div className="flex items-center space-x-2">
              <span>已支付</span>
            </div>
          }
        >
          {data?.records?.length ? (
            <>
              <div className="flex flex-col gap-3">
                {data?.records?.map((order: any) => (
                  <OrderItem
                    key={order.id}
                    order={order}
                    onPayOrderRedirect={onPayOrderRedirect}
                  />
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
            </>
          ) : (
            <EmptyOrder />
          )}
        </Tab>
      </Tabs>
    </div>
  );
}
