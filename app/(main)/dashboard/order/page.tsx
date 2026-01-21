"use client";
import { Button, Checkbox, Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaArrowRight } from "react-icons/fa";

import OrderItem from "./order-item";
import RefundList from "./refund-list";
import RefundModal from "./refund-modal";

import PaginationBar from "@/components/common/pagination-bar";
import { useBatchPayOrder, useCancelOrder, useOrderList, useRefundOrder, useRevokeOrder } from "@/hook/api";
import {
  BlockSpinner,
  BusinessProgress,
  EmptyState,
  FullscreenLoader,
} from "@/components/ui";
import { useEnhancedSelection, useSelection } from "@/hook/common";
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

export default function OrderPage() {
  const t = useTranslations("dashboard.order");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modal, setModal] = useState<OrderModalState>(null);

  const { data, isLoading, isFetching } = useOrderList({
    current: page,
    size: pageSize,
    customerPayStatusCode: tabKeyToStatusCode[activeTab],
    statusCode: tabKeyToStatusCode[activeTab] === '201' ? '101' : '',
  });
  const {
    selectedIds,
    isSelected,
    hasSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
  } = useSelection(data?.records || [], { idKey: "orderCode" });


  const {
    items,
    toggleSelection,
    updateQuantity, // 更新数量
    updateRemark, // 更新备注
    getSelectedItems, // 获取选中结果
  } = useEnhancedSelection(modal?.type === "refund" ? modal?.order?.products || [] : []);
  const { confirm } = useConfirm();
  const { mutateAsync: cancelOrder } = useCancelOrder();
  const { mutateAsync: batchPayOrder, isPending: isBatchPay } = useBatchPayOrder();
  const { mutateAsync: refundOrder, } = useRefundOrder();
  const { mutateAsync: revokeOrder, } = useRevokeOrder();
  const handleBatchPay = async () => {
    const bizCode = await batchPayOrder({
      orderCodeSet: selectedIds,
    });
    router.push(`/payment/${bizCode}`);
  };

  // 取消订单逻辑
  const handleCancel = (orderId: string) => {
    confirm({
      title: t("cancelTitle"),
      content: t("cancelContent"),
      onConfirm: async () => {
        await cancelOrder(orderId);
        setModal(null);
      },
    })
  };
  const handleRefund = (order: any) => {
    setModal({
      type: "refund",
      order: { ...order },
    })
  };
  const handleRevoke = (refundId: string) => {
    confirm({
      title: t("withdrawTitle"),
      content: t("withdrawContent"),
      onConfirm: async () => {
        await revokeOrder(refundId);
        setModal(null);
      },
    })
  };
  // 提交退款逻辑
  const handleRefundSubmit = async () => {
    if (modal?.type !== "refund") return;
    const param = {
      orderId: modal.order.id,
      skuList: getSelectedItems().map((p: any) =>
      ({
        sourceProductId: p?.sourceProductId,
        sourceSkuId: p?.sourceSkuId,
        quantity: p.quantity,
        remark: p.remark || "",
      })
      ),
    }
    console.log('params', param);
    await refundOrder(param);
    setModal(null);
  };

  const renderOrderContent = () => {
    if (!data?.records?.length) return <EmptyState />;

    return (
      <div className="relative">
        {(isFetching) && <BlockSpinner />}
        <div className="space-y-3 relative">
          {data.records.map((order: any) => (
            <OrderItem
              key={order.id}
              showCheckbox={activeTab === "waitPay"}
              order={order}
              onRevoke={handleRevoke}
              isSelected={isSelected}
              onCancel={handleCancel}
              onRefund={handleRefund}
              onChange={onSelect}
            />))}
        </div>
        <div className="mt-10 sticky bottom-0 z-10 border-t bg-white p-4 border border-gray-200 rounded-lg">
          {activeTab === "waitPay" && (
            <div className="flex items-center justify-between">
              <Checkbox isSelected={isAllSelected} onChange={onToggleSelectAll}>
                {t("selectAll")}
              </Checkbox>
              <Button
                className="w-[200px]"
                color="primary"
                isDisabled={!hasSelected}
                isLoading={isBatchPay}
                size="lg"
                onPress={handleBatchPay}
              >
                {t("batchPay")}
                {hasSelected ? ` (${selectedIds.length})` : ""}
              </Button>
            </div>
          )}
          <PaginationBar
            page={page}
            pageSize={pageSize}
            total={data.total as number}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    );
  };
  if (isLoading) return <FullscreenLoader />;
  return (
    <div className="flex w-full flex-col">
      <div className="mt-5">
        <BusinessProgress currentStep={1} />
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
            {renderOrderContent()}
          </Tab>
        ))}

        <Tab key="refund" title={t("refund")}>
          <RefundList />
        </Tab>
      </Tabs>
      {modal?.type === "refund" && (
        <RefundModal
          products={items}
          onCancel={() => setModal(null)}
          onRemarkChange={updateRemark}
          onSelect={toggleSelection}
          onSubmit={handleRefundSubmit}
          onUpdateQuantity={updateQuantity}
          isDisabled={getSelectedItems().length === 0}
        />
      )}
    </div>
  );
}
