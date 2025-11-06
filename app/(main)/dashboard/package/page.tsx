"use client";
import { Button, Checkbox, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import PackageItem from "./package-item";

import Progress from "@/components/common/order-progress";
import PaginationBar from "@/components/common/pagination-bar";
import { usePackageList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { batchPayPackage } from "@/services";

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

  const [activeTab, setActiveTab] =
    useState<keyof typeof tabKeyToStatusCode>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const { data, isLoading } = usePackageList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  ) as {
    data?: WarehouseListResponse;
    isLoading: boolean;
  };

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const router = useRouter();

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
      <p className="text-lg mb-2">暂无运单</p>
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
    </div>
  );
}
