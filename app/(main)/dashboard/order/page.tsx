"use client";
import { Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import OrderItem from "./order-item";

import Progress from "@/components/common/progress";
import PaginationBar from "@/components/common/pagination-bar";
import { useOrderList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { putOrderCancel } from "@/services";
import ConfirmModal from "@/components/modal/confirm-modal";

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};

interface Order {
  id: string;
  [key: string]: any;
}

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pendingCancelOrderId, setPendingCancelOrderId] = useState<
    string | null
  >(null);

  const router = useRouter();

  const { data, isLoading, refetch } = useOrderList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  );

  if (isLoading) return <FullscreenLoader loading={isLoading} />;

  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/order/pay-order/${bizCode}`);
  };

  const onCancelOrder = async (orderId: string) => {
    try {
      await putOrderCancel({ id: orderId });
      refetch?.(); // 刷新列表
    } catch (err) {
      console.error("取消订单失败:", err);
    }
  };

  const EmptyOrder = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
      <p className="text-lg mb-2">暂无订单</p>
    </div>
  );

  const renderTabContent = (orders: Order[], showCancel: boolean = false) => {
    if (!orders || orders.length === 0) return <EmptyOrder />;

    return (
      <>
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onCancelOrder={
                showCancel ? () => setPendingCancelOrderId(order.id) : undefined
              }
              onPayOrderRedirect={onPayOrderRedirect}
            />
          ))}
        </div>
        <div className="mt-10 sticky bottom-0 border-t-[1px] bg-white z-10 card-cart p-4 py-6">
          {data?.total && data.total > 0 && (
            <PaginationBar
              page={page}
              pageSize={pageSize}
              total={data.total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>
      </>
    );
  };

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
        <Tab key="all" title="全部">
          {renderTabContent(data?.records || [], true)}
        </Tab>
        <Tab key="waitPay" title="未支付">
          {renderTabContent(data?.records || [], true)}
        </Tab>
        <Tab key="paid" title="已支付">
          {renderTabContent(data?.records || [], false)}
        </Tab>
      </Tabs>

      <ConfirmModal
        content="确定要取消当前订单吗？"
        isOpen={!!pendingCancelOrderId}
        title="取消订单"
        onConfirm={(onClose) => {
          if (pendingCancelOrderId) {
            onCancelOrder(pendingCancelOrderId).finally(() => onClose());
            setPendingCancelOrderId(null);
          }
        }}
        onOpenChange={() => setPendingCancelOrderId(null)}
      />
    </div>
  );
}
