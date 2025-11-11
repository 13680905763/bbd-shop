"use client";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoCloseCircleOutline, IoSwapHorizontalOutline } from "react-icons/io5";

import PackageItem from "./package-item";

import Progress from "@/components/common/order-progress";
import PaginationBar from "@/components/common/pagination-bar";
import { usePackageList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import {
  batchPayPackage,
  refundPayPackage,
  refundPrePayPackage,
  withdrawPayPackage,
} from "@/services";
import CommonModal from "@/components/modal/common-modal";
import ConfirmModal from "@/components/modal/confirm-modal";
import { queryClient } from "@/lib/react-query";
import { useGlobalStore } from "@/store";

// 仓库包裹类型
interface WarehouseRecord {
  id: string;
  packageCode: string;
  packingPackageCode: string;
  outboundId?: string;
  [key: string]: any;
}
interface WarehouseListResponse {
  records: WarehouseRecord[];
  total: number;
}

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  pay: "203",
  shipping: "205",
  receivde: "206",
};

export default function WarehousePage() {
  const t = useTranslations("Dashboard.PackagePage");
  const { currency } = useGlobalStore();
  const [activeTab, setActiveTab] =
    useState<keyof typeof tabKeyToStatusCode>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const { data, isLoading, isFetching } = usePackageList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  ) as {
    data?: WarehouseListResponse;
    isLoading: boolean;
    isFetching: boolean;
  };
  // 在组件里定义 loading 状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const [refundConfig, setRefundConfig] = useState<any>(null);
  const [withdrawConfig, setWithdrawConfig] = useState<any>(null);

  console.log("activeTab", activeTab);

  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/warehouse/pay-order/${bizCode}`);
  };

  // 所有 packageCode
  const allIds = useMemo<string[]>(
    () => data?.records.map((w) => w.packingPackageCode) || [],
    [data],
  );

  const allSelected = useMemo(
    () => allIds.length > 0 && allIds.every((id) => selected[id]),
    [allIds, selected],
  );

  const toggleAll = (checked: boolean) => {
    setSelected(Object.fromEntries(allIds.map((id) => [id, checked])));
  };

  const selectedIds = useMemo(
    () =>
      Object.entries(selected)
        .filter(([_, v]) => v)
        .map(([k]) => k),
    [selected],
  );

  // 批量支付
  const handlePackageSubmit = async () => {
    if (isSubLoading) return;
    setIsSubLoading(true);
    try {
      const bizCode = await batchPayPackage({ packageSet: selectedIds });

      if (bizCode) {
        router.push(`/order/pay-order/${bizCode}`);
      }
    } catch {
    } finally {
      setIsSubLoading(false);
    }
  };
  // 单个支付
  const handlePackageSubmitItem = async (selectedIds: any) => {
    if (isSubLoading) return;
    setIsSubLoading(true);
    try {
      const bizCode = await batchPayPackage({ packageSet: [selectedIds] });

      if (bizCode) {
        router.push(`/order/pay-order/${bizCode}`);
      }
    } catch {
    } finally {
      setIsSubLoading(false);
    }
  };

  // 初始化选中状态
  useEffect(() => {
    if (data?.records) {
      setSelected(
        data.records.reduce(
          (acc, item) => ({ ...acc, [item.packingPackageCode]: false }),
          {} as Record<string, boolean>,
        ),
      );
    }
  }, [data]);
  console.log("selectedIds", selectedIds);

  // 空状态组件
  const EmptyPackage = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
      <p className="text-lg mb-2">{t("noTracking")}</p>
    </div>
  );
  const PackageTabContent = ({
    packList,
    footer,
  }: {
    packList: any[];
    footer?: React.ReactNode;
  }) => {
    if (!packList?.length) return <EmptyPackage />;
    if (isFetching)
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <div className="text-lg mb-2">
            <Spinner />
          </div>
        </div>
      );

    return (
      <>
        <div className="flex flex-col gap-3">
          {packList.map((order: any) => (
            <PackageItem
              key={order.packingPackageCode || order.outboundId}
              activeTab={activeTab}
              handlePackageSubmitItem={handlePackageSubmitItem}
              order={order}
              selected={
                activeTab === "pay"
                  ? !!selected[order.packingPackageCode]
                  : undefined
              }
              texts={t.raw("texts")}
              onChange={
                activeTab === "pay"
                  ? (e: any) =>
                      setSelected((prev: any) => ({
                        ...prev,
                        [order.packingPackageCode]: e.target.checked,
                      }))
                  : undefined
              }
              onPayOrderRedirect={onPayOrderRedirect}
              onRequestRefund={() => {
                onRequestRefund(order);
              }}
              onRequestWithdraw={() => {
                setWithdrawConfig({ ...order });
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

  const onRequestRefund = async (order: any): Promise<void> => {
    const res = await refundPrePayPackage(order.id);

    setRefundConfig({ ...res });
  };
  // 提交退款逻辑
  // 提交退款逻辑
  const handleRefundSubmit = async (type: "cancel" | "refund") => {
    if (!refundConfig) {
      // toast.error("退款配置异常，请稍后重试");
      return;
    }
    console.log("refundConfig", refundConfig?.param?.id);
    try {
      setIsSubmitting(true);

      // 1. 根据不同类型处理不同逻辑
      if (type === "cancel") {
        const bizCode = await refundPayPackage(refundConfig?.param?.id);

        if (bizCode) {
          router.push("/order/pay-order/" + bizCode);
        }
      } else if (type === "refund") {
        // await requestRefund(refundConfig.orderId);
      }

      // 2. 提交成功
      // toast.success(type === "cancel" ? "订单已取消" : "退款申请已提交");

      // 3. 清空配置
      // setRefundConfig(null);

      // 4. 可选：刷新页面或重新拉取订单数据
      // router.refresh?.();
    } catch {
    } finally {
      setIsSubmitting(false);
      // 3. 清空配置
      setRefundConfig(null);
      queryClient.invalidateQueries({ queryKey: ["packageList"] }); // 手动刷新
    }
  };

  if (isLoading || isSubLoading) return <FullscreenLoader />;

  return (
    <div className="flex w-full flex-col">
      <div className="mt-5">
        <Progress currentStep={3} />
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
          const k = String(key) as keyof typeof tabKeyToStatusCode;

          setActiveTab(k);
          setPage(1);
          setPageSize(k === "submit" ? 100 : 10);
          router.push(`/dashboard/package?tab=${key}`);
        }}
      >
        <Tab key="all" title={t("all")}>
          <PackageTabContent packList={data?.records || []} />
        </Tab>

        <Tab key="pay" title={t("pay")}>
          <PackageTabContent
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
                  onPress={handlePackageSubmit}
                >
                  {t("batchPay")}
                </Button>
              </div>
            }
            packList={data?.records || []}
          />
        </Tab>

        <Tab key="shipping" title={t("shipping")}>
          <PackageTabContent packList={data?.records || []} />
        </Tab>

        <Tab key="receivde" title={t("receivde")}>
          <PackageTabContent packList={data?.records || []} />
        </Tab>
      </Tabs>

      {refundConfig && (
        <CommonModal
          // footer={""}
          footer={<div />}
          isOpen={!!refundConfig}
          title={t("refundModal.title")}
          // onConfirm={handleRefundSubmit}
          // title={t("refundTitle")}
          onOpenChange={() => setRefundConfig(null)}
        >
          <div className="flex justify-center gap-6 py-6">
            {/* 确认取消 */}
            <Card
              isPressable
              className="w-52 border border-gray-200 rounded-2xl hover:border-red-500 hover:bg-red-50 transition-all duration-200 shadow-sm"
              onPress={() => handleRefundSubmit("cancel")}
            >
              <CardBody className="flex flex-col items-center justify-between text-center px-3 py-4 space-y-3">
                {/* 上半部分：图标与文字 */}
                <div className="flex flex-col items-center space-y-1">
                  {isSubmitting ? (
                    <Spinner color="danger" size="lg" />
                  ) : (
                    <IoCloseCircleOutline className="text-red-500 w-10 h-10" />
                  )}
                  <p
                    className={`text-base font-semibold ${
                      isSubmitting ? "text-gray-500" : "text-red-600"
                    }`}
                  >
                    {isSubmitting
                      ? t("refundModal.cancelCard.submittingTitle")
                      : t("refundModal.cancelCard.title")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isSubmitting
                      ? t("refundModal.cancelCard.submittingSubtitle")
                      : t("refundModal.cancelCard.subtitle")}
                  </p>
                </div>

                {/* 下半部分：费用明细 */}
                <div className="w-full bg-white rounded-xl border-t border-gray-100 pt-2 text-sm text-gray-700">
                  <div className="flex justify-between px-2 py-1">
                    <span>{t("refundModal.cancelCard.serviceFee")}</span>
                    <span>
                      {currency.symbol}
                      {refundConfig?.serviceFee ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between px-2 py-1">
                    <span>{t("refundModal.cancelCard.packingFee")}</span>
                    <span>
                      {currency.symbol}
                      {refundConfig?.packingFee ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between px-2 py-1 font-semibold text-red-600">
                    <span>{t("refundModal.cancelCard.totalFee")}</span>
                    <span>
                      {currency.symbol}
                      {refundConfig?.totalFee ?? 0}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* 更换路线 */}
            <Card
              isPressable
              className="w-48 h-40 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              // onPress={() => handleRefundSubmit("changeRoute")}
            >
              <CardBody className="flex flex-col items-center justify-center text-center">
                <IoSwapHorizontalOutline className="text-blue-500 w-8 h-8" />
                <p className="text-lg font-semibold text-blue-600">
                  {t("refundModal.changeRouteCard.title")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("refundModal.changeRouteCard.subtitle")}
                </p>
              </CardBody>
            </Card>
          </div>
        </CommonModal>
      )}

      <ConfirmModal
        content={t("withdrawModal.content")}
        isOpen={!!withdrawConfig}
        onConfirm={async () => {
          if (!withdrawConfig) return;
          console.log("withdrawConfig", withdrawConfig);

          try {
            // 调用后端撤销接口，例如 withdrawCancelPackage
            await withdrawPayPackage(withdrawConfig.id);
            // setWithdrawConfig(null);
          } catch {
          } finally {
            queryClient.invalidateQueries({ queryKey: ["packageList"] }); // 手动刷新
          }
        }}
        onOpenChange={() => setWithdrawConfig(null)}
      />
    </div>
  );
}
