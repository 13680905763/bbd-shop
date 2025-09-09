"use client";
import { Button, Checkbox, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import OrderItem from "./order-item";

import Progress from "@/components/common/order-progress";
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
  const t = useTranslations("Dashboard.OrderPage");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    content: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const { data, isLoading } = useOrderList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  );

  const allIds = data?.records.map((o: any) => o.orderCode) || [];
  const selectedIds = Object.entries(selected)
    .filter(([_, value]) => value)
    .map(([key]) => key);
  const allSelected =
    allIds.length > 0 && allIds.every((orderCode) => selected[orderCode]);

  // 初始化选中状态（仅首次）
  useEffect(() => {
    if (data?.records && Object.keys(selected).length === 0) {
      const initialSelected = Object.fromEntries(
        data.records.map((item: any) => [item.orderCode, false]),
      );

      setSelected(initialSelected);
    }
  }, [data]);

  const toggleAll = (checked: boolean) => {
    setSelected(Object.fromEntries(allIds.map((id) => [id, checked])));
  };

  const toggleOrder = (orderCode: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [orderCode]: checked }));
  };

  const handleOrderSubmit = async () => {
    const bizCode = await batchPayOrder({ orderCodeSet: selectedIds });

    router.push(`/order/pay-order/${bizCode}`);
  };

  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/order/pay-order/${bizCode}`);
  };

  const onCancelOrder = async (orderId: string): Promise<void> => {
    await putOrderCancel({ id: orderId });
    queryClient.invalidateQueries({ queryKey: ["orderList"] });
  };

  const onRequestRefund = async (orderId: string): Promise<void> => {
    await OrderRefund({ orderId });
    queryClient.invalidateQueries({ queryKey: ["orderList"] });
  };

  const EmptyOrder = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
      <p className="text-lg mb-2">{t("noOrders")}</p>
    </div>
  );

  const OrderTabContent = ({
    orders,
    footer,
  }: {
    orders: any[];
    footer?: React.ReactNode;
  }) => {
    if (!orders?.length) return <EmptyOrder />;
    console.log(t.raw("texts"));

    return (
      <>
        <div className="flex flex-col gap-3">
          {orders.map((order: any) => (
            <OrderItem
              key={order.id}
              activeTab={activeTab}
              order={order}
              selected={!!selected[order.orderCode]}
              texts={t.raw("texts")}
              onCancelOrder={() =>
                setModalConfig({
                  title: t("cancelTitle"),
                  content: t("cancelContent"),
                  onConfirm: async () => {
                    await onCancelOrder(order.id);
                  },
                })
              }
              onChange={(e: any) =>
                toggleOrder(order.orderCode, e.target.checked)
              }
              onPayOrderRedirect={onPayOrderRedirect}
              onRequestRefund={() =>
                setModalConfig({
                  title: t("refundTitle"),
                  content: t("refundContent"),
                  onConfirm: async () => {
                    await onRequestRefund(order.id);
                  },
                })
              }
            />
          ))}
        </div>
        <div className="mt-10 sticky bottom-0 border-t bg-white z-10 p-4 card-cart">
          {footer}
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
    );
  };

  if (isLoading) return <FullscreenLoader />;

  return (
    <div className="flex w-full flex-col">
      <div className="mt-5">
        <Progress currentStep={1} />
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
        <Tab key="all" title={t("all")}>
          <OrderTabContent orders={data?.records || []} />
        </Tab>

        <Tab key="waitPay" title={t("waitPay")}>
          <OrderTabContent
            footer={
              <div className="flex justify-between items-center gap-4">
                <Checkbox
                  isSelected={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                >
                  {t("selectAll")}
                </Checkbox>
                <Button
                  className="w-[150px]"
                  color="primary"
                  isDisabled={!selectedIds.length}
                  size="lg"
                  onPress={handleOrderSubmit}
                >
                  {t("batchPay")}
                </Button>
              </div>
            }
            orders={data?.records || []}
          />
        </Tab>

        <Tab key="paid" title={t("paid")}>
          <OrderTabContent orders={data?.records || []} />
        </Tab>
      </Tabs>

      {modalConfig && (
        <ConfirmModal
          content={modalConfig.content}
          isOpen={!!modalConfig}
          title={modalConfig.title}
          onConfirm={async () => {
            await modalConfig.onConfirm();
            setModalConfig(null);
          }}
          onOpenChange={() => setModalConfig(null)}
        />
      )}
    </div>
  );
}
