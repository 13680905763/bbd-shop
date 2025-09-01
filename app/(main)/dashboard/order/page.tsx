"use client";
import { Button, Checkbox, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import OrderItem from "./order-item";

import Progress from "@/components/common/progress";
import PaginationBar from "@/components/common/pagination-bar";
import { useOrderList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { batchPayOrder, OrderRefund, putOrderCancel } from "@/services";
import ConfirmModal from "@/components/modal/confirm-modal";
import { queryClient } from "@/lib/react-query";
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
  const [pendingCancelOrderId, setPendingCancelOrderId] = useState<
    string | null
  >(null);
  const [pendingRequestRefundId, setPendingRequestRefundId] = useState<
    string | null
  >(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const { data, isLoading } = useOrderList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  );

  console.log("data", data);
  const allIds = useMemo<string[]>(() => {
    return data?.records.map((o: any) => o.orderCode) || [];
  }, [data]);

  // 是否全选
  const allSelected = useMemo(() => {
    return (
      allIds.length > 0 && allIds.every((orderCode) => selected[orderCode])
    );
  }, [allIds, selected]);

  // 切换全选
  const toggleAll = (checked: boolean) => {
    const newSelected = Object.fromEntries(allIds.map((id) => [id, checked]));

    setSelected(newSelected);
  };

  // 选中的 orderCode
  const selectedIds = useMemo<string[]>(() => {
    return Object.entries(selected)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  }, [selected]);

  // 提交
  const handleOrderSubmit = async () => {
    console.log("selectedIds", selectedIds);

    const bizCode = await batchPayOrder({
      orderCodeSet: selectedIds,
    });

    console.log("bizCode", bizCode);

    router.push(`/order/pay-order/${bizCode}`);
  };

  // 初始化选中状态
  useEffect(() => {
    if (data?.records) {
      const initialSelected: Record<string, boolean> = data.records.reduce(
        (acc, item: any) => {
          acc[item.orderCode] = false;

          return acc;
        },
        {} as Record<string, boolean>,
      );

      setSelected(initialSelected);
    }
  }, [data]);
  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/order/pay-order/${bizCode}`);
  };
  const onCancelOrder = async (orderId: string): Promise<void> => {
    try {
      // 调用取消接口
      await putOrderCancel({ id: orderId });

      // 刷新列表数据
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    } catch (err) {
      console.error("取消订单失败:", err);
    }
  };
  const onRequestRefund = async (orderId: string): Promise<void> => {
    try {
      console.log("orderId", orderId);

      // // 调用取消接口
      await OrderRefund({ orderId: orderId });

      // 刷新列表数据
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    } catch (err) {
      console.error("取消订单失败:", err);
    }
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
                    onCancelOrder={() => setPendingCancelOrderId(order.id)}
                    onPayOrderRedirect={onPayOrderRedirect}
                    onRequestRefund={() => setPendingRequestRefundId(order.id)}
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
                    activeTab={activeTab}
                    order={order}
                    selected={!!selected[order.orderCode]}
                    onCancelOrder={() => setPendingCancelOrderId(order.id)}
                    onChange={(e: any) => {
                      setSelected((prev) => ({
                        ...prev,
                        [order.orderCode]: e.target.checked,
                      }));
                    }}
                    onPayOrderRedirect={onPayOrderRedirect}
                    onRequestRefund={() => setPendingRequestRefundId(order.id)}
                  />
                ))}
              </div>
              <div className="mt-10 sticky bottom-0 border-t-[1px] bg-white z-10 p-4  card-cart  ">
                <div className="flex justify-between items-center  gap-4">
                  <div className="flex gap-4">
                    <div className="p-2 flex gap-2">
                      <Checkbox
                        isSelected={allSelected}
                        onChange={(e) => toggleAll(e.target.checked)}
                      >
                        全选
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      className="w-[150px]"
                      color="primary"
                      isDisabled={selectedIds.length === 0}
                      size="lg"
                      onPress={handleOrderSubmit}
                    >
                      批量支付
                    </Button>
                  </div>
                </div>
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
                    onRequestRefund={() => setPendingRequestRefundId(order.id)}
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
      <ConfirmModal
        content="确定要取消当前订单吗？"
        isOpen={!!pendingCancelOrderId}
        title="取消订单"
        onConfirm={async (onClose): Promise<void> => {
          if (!pendingCancelOrderId) return;
          await onCancelOrder(pendingCancelOrderId);
          setPendingCancelOrderId(null);
          onClose();
        }}
        onOpenChange={() => setPendingCancelOrderId(null)}
      />
      <ConfirmModal
        content="确定申请退款当前订单吗？"
        isOpen={!!pendingRequestRefundId}
        title="申请退款"
        onConfirm={async (onClose): Promise<void> => {
          if (!pendingRequestRefundId) return;
          await onRequestRefund(pendingRequestRefundId);
          setPendingRequestRefundId(null);
          onClose();
        }}
        onOpenChange={() => setPendingRequestRefundId(null)}
      />
    </div>
  );
}
