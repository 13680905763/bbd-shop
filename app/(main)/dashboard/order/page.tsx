"use client";
import {
  Button,
  Checkbox,
  Tab,
  Tabs,
  Spinner,
  addToast,
  Card,
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
import { useOrderList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import {
  batchPayOrder,
  OrderRefund,
  putOrderCancel,
  putOrderRevoke,
} from "@/services";
import ConfirmModal from "@/components/modal/confirm-modal";
import { queryClient } from "@/lib/react-query";
import { useSelection } from "@/hook/useSelection";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<OrderModalState>(null);
  // ================= 使用 useSelection =================
  const {
    selectedIds,
    isSelected,
    hasSelected,
    toggle,
    isAllSelected,
    toggleSelectAll,
  } = useSelection((orders as any) ?? [], { idKey: "orderCode" });

  const handleOrderSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const bizCode = await batchPayOrder({
        orderCodeSet: selectedIds,
      });

      router.push(`/payment/${bizCode}`);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
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
    await OrderRefund({
      orderId: modal.order.id,
      skuList: selectedProducts,
    });

    queryClient.invalidateQueries({ queryKey: ["orderList"] });
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
              setModal({ type: "revoke", refundId })
            }
            selected={isSelected(order.orderCode)}
            texts={t.raw("texts")}
            onCancelOrder={() =>
              setModal({ type: "cancel", orderId: order.id })
            }
            onChange={() => toggle(order.orderCode)}
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
            <Checkbox isSelected={isAllSelected} onChange={toggleSelectAll}>
              {t("selectAll")}
            </Checkbox>
            <Button
              className="w-[150px]"
              color="primary"
              isDisabled={!hasSelected}
              isLoading={isSubmitting}
              size="lg"
              onPress={handleOrderSubmit}
            >
              {t("batchPay")}
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

      {modal?.type === "cancel" && (
        <ConfirmModal
          isOpen
          content={t("cancelContent")}
          title={t("cancelTitle")}
          onConfirm={async () => {
            await putOrderCancel({ id: modal.orderId });
            queryClient.invalidateQueries({ queryKey: ["orderList"] });
            setModal(null);
          }}
          onOpenChange={() => setModal(null)}
        />
      )}
      {modal?.type === "revoke" && (
        <ConfirmModal
          isOpen
          content={t("withdrawContent")}
          title={t("withdrawTitle")}
          onConfirm={async () => {
            await putOrderRevoke(modal.refundId);
            queryClient.invalidateQueries({ queryKey: ["orderList"] });
            setModal(null);
          }}
          onOpenChange={() => setModal(null)}
        />
      )}
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
      <Card className="w-full p-5 bg-[#ffeee1] ">
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
      </Card>
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
