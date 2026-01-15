"use client";
import {
  Button,
  Checkbox,
  Tab,
  Tabs,
  Spinner,
  addToast,
} from "@heroui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaArrowRight } from "react-icons/fa";

import OrderItem from "./order-item";
import RefundList from "./refund-list";
import RefundModal from "./refund-modal";

import Progress from "@/components/common/order-progress";
import PaginationBar from "@/components/common/pagination-bar";
import { useOrderList, useOrderMutations } from "@/hook/api";
import { FullscreenLoader } from "@/components/ui";
import { useSelection } from "@/hook/common";
import { useConfirm } from "@/components/common/modal/confirm-provider";

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};

type OrderModalState =
  | { type: "cancel"; orderId: string }
  | { type: "revoke"; refundId: string }
  | { type: "refund"; order: any }
  | null;
function OrderTabContent({
  orders,
  isFetching,
  total,
  activeTab,
  isFooter,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: any) {
  const t = useTranslations("dashboard.order");
  const router = useRouter();
  const [modal, setModal] = useState<OrderModalState>(null);
  const {
    selectedIds,
    isSelected,
    hasSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
  } = useSelection((orders as any) ?? [], { idKey: "orderCode" });
  const { confirm } = useConfirm();
  const { batchPayMutation, refundMutation, cancelMutation, revokeMutation } =
    useOrderMutations();

  const handleOrderSubmit = async () => {
    const bizCode = await batchPayMutation.mutateAsync({
      orderCodeSet: selectedIds,
    });

    router.push(`/payment/${bizCode}`);
  };

  // 提交退款逻辑
  const handleRefundSubmit = async () => {
    if (modal?.type !== "refund") return;

    // 只提交被勾选的商品
    const selectedProducts = modal.order.products
      .filter((p: any) => p.selected && p.refundQuantity)
      .map((p: any) => ({
        sourceProductId: p.sourceProductId,
        sourceSkuId: p.sourceSkuId,
        quantity: p.refundQuantity,
        remark: p?.remark || "",
      }));

    if (selectedProducts.length === 0) {
      addToast({
        title: "Please select the item to be refunded",
        timeout: 1000,
        color: "danger",
      });

      return;
    }
    await refundMutation.mutateAsync({
      orderId: modal.order.orderCode,
      skuList: selectedProducts,
    });
    setModal(null);
  };

  if (isFetching)
    return <Spinner className="flex h-[70vh] flex-col items-center" />;
  if (!orders?.length)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 text-lg mb-2">
        {t("noOrders")}
      </div>
    );

  return (
    <>
      <div className="flex flex-col gap-3">
        {orders.map((order: any) => (
          <OrderItem
            key={order.id}
            activeTab={activeTab}
            order={order}
            revokeRefund={(refundId: string) =>
              confirm({
                title: t("withdrawTitle"),
                content: t("withdrawContent"),
                onConfirm: async () => {
                  await revokeMutation.mutateAsync(refundId);
                  setModal(null);
                },
              })
            }
            selected={isSelected(order.orderCode)}
            texts={t.raw("texts")}
            onCancelOrder={() =>
              confirm({
                title: t("cancelTitle"),
                content: t("cancelContent"),
                onConfirm: async () => {
                  await cancelMutation.mutateAsync({ id: order.orderCode });
                  setModal(null);
                },
              })
            }
            onChange={() => onSelect(order.orderCode)}
            onRequestRefund={() =>
              setModal({
                type: "refund",
                order: {
                  ...order,
                  products: order.products.map((p: any) => ({
                    ...p,
                    selected: true,
                    refundQuantity: p.canRefundQty,
                  })),
                },
              })
            }
          />
        ))}
      </div>
      <div className="mt-10 sticky bottom-0 border-t bg-white z-10 p-4 card-cart">
        {isFooter && (
          <div className="flex justify-between items-center gap-4 ">
            <Checkbox isSelected={isAllSelected} onChange={onToggleSelectAll}>
              {t("selectAll")}
            </Checkbox>
            <Button
              className="w-[150px]"
              color="primary"
              isDisabled={!hasSelected}
              isLoading={batchPayMutation.isPending}
              size="lg"
              onPress={handleOrderSubmit}
            >
              {t("batchPay")}{selectedIds.length ? ` (${selectedIds.length})` : ""}
            </Button>
          </div>
        )}
        {(total as number) > 0 && (
          <PaginationBar
            page={page}
            pageSize={pageSize}
            total={total as number}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>

      {modal?.type === "refund" && (
        <RefundModal
          order={modal.order}
          onCancel={() => setModal(null)}
          onSubmit={handleRefundSubmit}
        />
      )}
    </>
  );
}

export default function OrderPage() {
  const t = useTranslations("dashboard.order");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const { data, isLoading, isFetching } = useOrderList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  );

  if (isLoading) return <FullscreenLoader />;

  return (
    <div className="flex w-full flex-col">
      <div className="mt-5">
        <Progress currentStep={1} />
      </div>
      <div className="w-full p-5 bg-[#ffeee1] rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <h4 className="font-bold text-gray-800">
                {t("promptCard.title")}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {t("promptCard.description")}
              </p>
            </div>
          </div>
          <Button
            color="primary"
            endContent={<FaArrowRight />}
            variant="shadow"
            onPress={() => {
              router.push("/dashboard/warehouse");
            }}
          >
            {t("promptCard.button")}
          </Button>
        </div>
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
          if (key != "refund") {
            setActiveTab(String(key));
            setPage(1);
          }
        }}
      >
        {[
          { key: "all", title: t("all") },
          { key: "waitPay", title: t("waitPay"), isFooter: true },
          { key: "paid", title: t("paid") },
        ].map((tab) => (
          <Tab key={tab.key} title={tab.title}>
            <OrderTabContent
              activeTab={activeTab}
              isFetching={isFetching}
              isFooter={tab.isFooter}
              orders={data?.records || []}
              page={page}
              pageSize={pageSize}
              total={data?.total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </Tab>
        ))}

        <Tab key="refund" title={t("refund")}>
          <RefundList />
        </Tab>
      </Tabs>
    </div>
  );
}
