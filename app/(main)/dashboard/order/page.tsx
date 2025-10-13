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
import CommonModal from "@/components/modal/common-modal";

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
  // === 新增两个 state 分开控制 ===
  const [cancelConfig, setCancelConfig] = useState<{
    title: string;
    content: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const [refundConfig, setRefundConfig] = useState<{
    order: any;
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

  const onRequestRefund = async (order: any): Promise<void> => {
    const productsWithRefund = order.products.map((p: any) => ({
      ...p,
      selected: true, // 默认不勾选
      refundQuantity: p.quantity, // 默认退款数量为原订单数量
    }));

    setRefundConfig({
      order: {
        ...order,
        products: productsWithRefund,
      },
    });
    // await OrderRefund({ orderId });
    // queryClient.invalidateQueries({ queryKey: ["orderList"] });
  };

  useEffect(() => {
    if (refundConfig) {
      console.log("refundConfig updated:", refundConfig);
    }
  }, [refundConfig]);
  useEffect(() => {
    if (data?.records) {
      console.log("data?.records", data?.records);
    }
  }, [data?.records]);
  // 提交退款逻辑
  const handleRefundSubmit = async () => {
    if (!refundConfig) return;

    // 只提交被勾选的商品
    const selectedProducts = refundConfig.order.products
      .filter((p: any) => p.selected)
      .map((p: any) => ({
        sourceProductId: p.sourceProductId,
        sourceSkuId: p.sourceSkuId,
        quantity: p.refundQuantity,
      }));

    if (selectedProducts.length === 0) {
      alert("请选择要退款的商品");

      return;
    }
    console.log("555", {
      orderId: refundConfig.order.id,
      skuList: selectedProducts,
    });

    await OrderRefund({
      orderId: refundConfig.order.id,
      skuList: selectedProducts,
    });

    queryClient.invalidateQueries({ queryKey: ["orderList"] });
    setRefundConfig(null);
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
                setCancelConfig({
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
              onRequestRefund={() => {
                onRequestRefund(order);
              }}
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

      {cancelConfig && (
        <ConfirmModal
          content={cancelConfig.content}
          isOpen={!!cancelConfig}
          title={cancelConfig.title}
          onConfirm={async () => {
            await cancelConfig.onConfirm();
            setCancelConfig(null);
          }}
          onOpenChange={() => setCancelConfig(null)}
        />
      )}
      {refundConfig && (
        <CommonModal
          isOpen={!!refundConfig}
          title={t("refundTitle")}
          onConfirm={handleRefundSubmit}
          onOpenChange={() => setRefundConfig(null)}
        >
          {refundConfig?.order?.products.map((product: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 mb-2 border rounded-md bg-white shadow-sm"
            >
              {/* 左侧：勾选 + 商品信息 */}
              <div className="flex items-center gap-3">
                <input
                  checked={product.selected || false}
                  className="w-4 h-4"
                  type="checkbox"
                  onChange={(e) => {
                    const newProducts = refundConfig.order.products.map(
                      (p: any, i: number) =>
                        i === index ? { ...p, selected: e.target.checked } : p,
                    );

                    setRefundConfig({
                      ...refundConfig,
                      order: { ...refundConfig.order, products: newProducts },
                    });
                  }}
                />
                <div className="w-[60px] h-[60px] flex-shrink-0">
                  <img
                    alt={product.productTitle}
                    className="w-full h-full object-cover rounded"
                    src={product.skuPicUrl || product?.picUrl}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 line-clamp-2">
                    {product.productTitle}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {product?.sku?.propName_valueName || "-"}
                  </span>
                  {product?.remark && (
                    <span className="text-gray-400 text-xs">
                      {product.remark}
                    </span>
                  )}
                </div>
              </div>

              {/* 右侧：价格、数量 */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-gray-700 text-sm font-medium">
                  ${product.price}
                </span>
                <span className="text-gray-500 text-sm">
                  x{product.quantity}
                </span>

                <div className="flex gap-2 mt-1">
                  <input
                    className="w-16 px-2 py-1 border rounded text-sm"
                    max={product.quantity}
                    min={1}
                    type="number"
                    value={product.refundQuantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const newProducts = refundConfig.order.products.map(
                        (p: any, i: number) =>
                          i === index ? { ...p, refundQuantity: value } : p,
                      );

                      setRefundConfig({
                        ...refundConfig,
                        order: { ...refundConfig.order, products: newProducts },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CommonModal>
      )}
    </div>
  );
}
