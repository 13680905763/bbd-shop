"use client";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Tab,
  Tabs,
  Spinner,
  Textarea,
  addToast,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Image } from "antd";
import { useTranslations } from "next-intl";

import OrderItem from "./order-item";

import Progress from "@/components/common/order-progress";
import PaginationBar from "@/components/common/pagination-bar";
import { useOrderList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import {
  batchPayOrder,
  getRefundList,
  OrderRefund,
  putOrderCancel,
  putOrderRevoke,
} from "@/services";
import ConfirmModal from "@/components/modal/confirm-modal";
import { queryClient } from "@/lib/react-query";
import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  waitPay: "201",
  paid: "203",
};

export default function OrderPage() {
  const t = useTranslations("Dashboard.OrderPage");
  const { currency } = useGlobalStore();
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pager, setPager] = useState(1);
  const [pageSizer, setPageSizer] = useState(10);
  const [totalr, setTotalr] = useState(10);
  const [refundList, setRefundList] = useState([]);
  const router = useRouter();

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  // === 新增两个 state 分开控制 ===
  const [cancelConfig, setCancelConfig] = useState<{
    title: string;
    content: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [revokeConfig, setRevokeConfig] = useState<{
    title: string;
    content: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const [refundConfig, setRefundConfig] = useState<{
    order: any;
  } | null>(null);

  const { data, isLoading, isFetching } = useOrderList(
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

  const fetchData = async () => {
    try {
      const res = await getRefundList({
        current: pager,
        size: pageSizer,
      });

      setRefundList(res.records);
      setTotalr(res?.total);
    } catch (err) {
      console.error("获取服务列表失败:", err);
    } finally {
    }
  };

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

    router.push(`/payment/${bizCode}`);
  };

  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/payment/${bizCode}`);
  };

  const onCancelOrder = async (orderId: string): Promise<void> => {
    await putOrderCancel({ id: orderId });
    queryClient.invalidateQueries({ queryKey: ["orderList"] });
  };
  const onRevokeOrder = async (refundId: string): Promise<void> => {
    await putOrderRevoke(refundId);
    queryClient.invalidateQueries({ queryKey: ["orderList"] });
  };

  const onRequestRefund = async (order: any): Promise<void> => {
    const productsWithRefund = order.products.map((p: any) => ({
      ...p,
      selected: true, // 默认不勾选
      refundQuantity: p.canRefundQty, // 默认退款数量为原订单数量
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
      orderId: refundConfig.order.id,
      skuList: selectedProducts,
    });

    queryClient.invalidateQueries({ queryKey: ["orderList"] });
    setRefundConfig(null);
  };
  const handleSelect = (index: number, checked: boolean) => {
    const newProducts = refundConfig?.order.products.map((p: any, i: number) =>
      i === index ? { ...p, selected: checked } : p,
    );

    setRefundConfig({
      ...refundConfig,
      order: { ...refundConfig?.order, products: newProducts },
    });
  };

  const handleQtyChange = (index: number, value: number) => {
    const newProducts = refundConfig?.order.products.map((p: any, i: number) =>
      i === index ? { ...p, refundQuantity: value } : p,
    );

    setRefundConfig({
      ...refundConfig,
      order: { ...refundConfig?.order, products: newProducts },
    });
  };
  const handleRemarkChange = (index: number, value: string) => {
    const newProducts = refundConfig?.order.products.map((p: any, i: number) =>
      i === index ? { ...p, remark: value } : p,
    );

    setRefundConfig({
      ...refundConfig,
      order: { ...refundConfig?.order, products: newProducts },
    });
  };

  useEffect(() => {
    fetchData();
  }, [pager, pageSizer]);
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
    if (isFetching)
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <div className="text-lg mb-2">
            <Spinner />
          </div>
        </div>
      );
    if (!orders?.length) return <EmptyOrder />;

    return (
      <>
        <div className="flex flex-col gap-3">
          {orders.map((order: any) => (
            <OrderItem
              key={order.id}
              activeTab={activeTab}
              order={order}
              revokeRefund={(refundId: any) => {
                console.log("refundId", refundId);
                setRevokeConfig({
                  title: t("withdrawTitle"),
                  content: t("withdrawContent"),
                  onConfirm: async () => {
                    await onRevokeOrder(refundId);
                  },
                });
              }}
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
  const renderCell = ({
    item,
    columnKey,
    currency,
  }: {
    item: any;
    columnKey: string;
    currency?: any;
  }) => {
    const value = item[columnKey];

    // 商品标题
    if (columnKey === "productTitle") {
      return (
        <div className="text-base text-gray-800 leading-snug line-clamp-2">
          {value}
        </div>
      );
    }

    // SKU属性
    if (columnKey === "propAndValue") {
      return (
        <div className="text-sm text-gray-500 leading-snug line-clamp-2">
          {value?.propName_valueName}
        </div>
      );
    }
    // 金额统一格式
    if (columnKey === "refundAmount") {
      return `${currency?.symbol}${Number(value).toFixed(2)}`;
    }

    // 图片列
    if (columnKey === "picUrl") {
      const imgSrc = item.skuUrl || value;

      return (
        <Image
          alt="商品图片"
          height={50}
          referrerPolicy="no-referrer"
          src={imgSrc}
          width={50}
        />
      );
    }

    // 时间格式化
    if (columnKey === "createTime" || columnKey === "updateTime") {
      return value ? value.replace("T", " ").slice(0, 19) : "--";
    }

    return value || "--";
  };
  const columns = [
    { key: "orderCode", label: t("refundTable.orderCode") },
    { key: "picUrl", label: t("refundTable.picUrl") },
    { key: "productTitle", label: t("refundTable.productTitle") },
    { key: "propAndValue", label: "sku" },
    { key: "refundAmount", label: t("refundTable.refundAmount") },
    { key: "applyRemark", label: t("refundTable.applyRemark") },
    { key: "handleRemark", label: t("refundTable.handleRemark") },
    { key: "status", label: t("refundTable.status") },
    // { key: "createTime", label: t("refundTable.createTime") },
    { key: "updateTime", label: t("refundTable.updateTime") },
  ];

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
          if (key != "refund") {
            setActiveTab(String(key));
            setPage(1);
          } else {
            setPager(1);
          }
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
        <Tab key="refund" title={t("refund")}>
          <Table
            isHeaderSticky
            removeWrapper
            classNames={{
              wrapper:
                "p-0 rounded-none border border-default-200 min-w-[900px]",
              thead: "bg-default-50",
              th: "text-default-600 font-medium !rounded-none text-sm",
              tr: "border-b last:border-b-0",
              td: "text-sm text-default-700",
            }}
            radius="none"
            shadow="none"
          >
            <TableHeader columns={columns}>
              {(column: any) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>

            <TableBody
              emptyContent={t("refundTable.emptyContent")}
              isLoading={isLoading}
              items={refundList}
              loadingContent={<Spinner />}
            >
              {(item: any) => (
                <TableRow key={item.id}>
                  {(columnKey: any) => (
                    <TableCell className="text-sm text-default-700 break-words whitespace-normal">
                      {renderCell({
                        item,
                        columnKey,
                        currency,
                      })}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-10 sticky bottom-0 border-t bg-white z-10 p-4 card-cart">
            {(totalr as number) > 0 && (
              <PaginationBar
                page={pager}
                pageSize={pageSizer}
                total={totalr as number}
                onPageChange={setPager}
                onPageSizeChange={setPageSizer}
              />
            )}
          </div>
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
      {revokeConfig && (
        <ConfirmModal
          content={revokeConfig.content}
          isOpen={!!revokeConfig}
          title={revokeConfig.title}
          onConfirm={async () => {
            await revokeConfig.onConfirm();
            setRevokeConfig(null);
          }}
          onOpenChange={() => setRevokeConfig(null)}
        />
      )}
      {refundConfig && (
        <CommonModal
          isOpen={!!refundConfig}
          title={t("refundTitle")}
          onConfirm={handleRefundSubmit}
          onOpenChange={() => setRefundConfig(null)}
        >
          <div className="space-y-3">
            {refundConfig?.order?.products.map(
              (product: any, index: number) => (
                <Card
                  key={index}
                  className={`border rounded-lg shadow-sm transition-all duration-150 ${
                    product.selected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white"
                  }`}
                  isPressable={false}
                >
                  <CardBody className="flex flex-col p-4 gap-3">
                    {/* 第一行：商品选择 + 基本信息 + 数量/价格 */}
                    <div className="flex gap-3">
                      {/* 左：选择框 */}
                      <Checkbox
                        className="mt-1"
                        isDisabled={
                          product.isRefunded || product.canRefundQty === 0
                        }
                        isSelected={product.selected || false}
                        size="sm"
                        onValueChange={(checked) =>
                          handleSelect(index, checked)
                        }
                      />

                      {/* 商品图片 */}
                      <div className="w-[70px] h-[70px] flex-shrink-0">
                        <Image
                          alt={product.productTitle}
                          className="w-full h-full object-cover rounded-md"
                          height={70}
                          src={
                            product.skuPicUrl ||
                            product.picUrl ||
                            "/placeholder.png"
                          }
                          width={70}
                        />
                      </div>

                      {/* 商品基本信息 */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-gray-900 text-sm line-clamp-2">
                          {product.productTitle}
                        </span>
                        <span className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                          {product?.propAndValue?.propName_valueName || "-"}
                        </span>

                        {product.canRefundQty === 0 && (
                          <span className="text-red-400 text-xs mt-0.5">
                            {t("unrefundable")}
                          </span>
                        )}
                      </div>

                      {/* 价格 + 数量输入 */}
                      <div className="flex flex-col items-end justify-center gap-1">
                        <span className="text-gray-900 font-semibold text-sm">
                          {currency.symbol}
                          {product.price}
                        </span>
                        <span className="text-gray-500 text-xs">
                          x{product.purchaseQuantity}
                        </span>

                        <div className="flex items-center gap-1 mt-1">
                          <input
                            className="w-16 px-2 py-1 border rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                            disabled={
                              !product.selected ||
                              product.isRefunded ||
                              product.canRefundQty === 0
                            }
                            max={product.canRefundQty}
                            min={1}
                            type="number"
                            value={product.refundQuantity}
                            onChange={(e) =>
                              handleQtyChange(index, Number(e.target.value))
                            }
                          />
                          <span className="text-gray-400 text-xs">
                            {t("refundable")} {product.canRefundQty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 第二行：备注输入框 */}
                    <div className="">
                      <Textarea
                        classNames={{
                          inputWrapper:
                            "bg-white border border-gray-300 rounded-md shadow-none " +
                            "focus-within:bg-white focus-within:border-primary " +
                            "focus-within:ring-1 focus-within:ring-primary transition-colors",
                          input:
                            "text-sm text-gray-800 placeholder:text-gray-400",
                        }}
                        minRows={2}
                        placeholder={t("remarkPlaceholder")}
                        value={product.remark || ""}
                        onChange={(e) =>
                          handleRemarkChange(index, e.target.value)
                        }
                      />
                    </div>
                  </CardBody>
                </Card>
              ),
            )}
          </div>
        </CommonModal>
      )}
    </div>
  );
}
