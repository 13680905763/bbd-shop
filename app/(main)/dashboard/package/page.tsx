"use client";
import { Tab, Tabs } from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import OrderItem from "./order-item";

import Progress from "@/components/common/progress";
import PaginationBar from "@/components/common/pagination-bar";
import { createWarehousePreviewKeyByCart } from "@/services";
import { usePackageList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";

// 仓库包裹类型
interface WarehouseRecord {
  id: string;
  packageCode: string;
  [key: string]: any; // 其他字段按需补充
}

interface WarehouseListResponse {
  records: WarehouseRecord[];
  total: number;
}

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  pay: "TO PAY",
  shipping: "SHIPPING",
  receivde: "RECEIVED",
};

export default function WarehousePage() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof tabKeyToStatusCode>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data, isLoading } = usePackageList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  ) as { data?: WarehouseListResponse; isLoading: boolean };

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const onPayOrderRedirect = (bizCode: string) => {
    router.push(`/warehouse/pay-order/${bizCode}`);
  };
  // 所有 packageCode
  const allIds = useMemo<string[]>(() => {
    return data?.records.map((w) => w.packageCode) || [];
  }, [data]);

  // 是否全选
  const allSelected = useMemo(() => {
    return (
      allIds.length > 0 && allIds.every((packageCode) => selected[packageCode])
    );
  }, [allIds, selected]);

  // 切换全选
  const toggleAll = (checked: boolean) => {
    const newSelected = Object.fromEntries(allIds.map((id) => [id, checked]));

    setSelected(newSelected);
  };

  // 选中的 packageCode
  const selectedIds = useMemo<string[]>(() => {
    return Object.entries(selected)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  }, [selected]);

  // 提交
  const handleWarehouseSubmit = async () => {
    const key = await createWarehousePreviewKeyByCart({
      packageSet: selectedIds,
    });

    router.push("/warehouse/submit-warehouse?key=" + key);
  };

  // 初始化选中状态
  useEffect(() => {
    if (data?.records) {
      const initialSelected: Record<string, boolean> = data.records.reduce(
        (acc, item) => {
          acc[item.packageCode] = false;

          return acc;
        },
        {} as Record<string, boolean>,
      );

      setSelected(initialSelected);
    }
  }, [data]);
  const EmptyPackage = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
      <p className="text-lg mb-2">暂无运单</p>
    </div>
  );

  if (isLoading) return <FullscreenLoader loading={isLoading} />;
  console.log("onPayOrderRedirect111", onPayOrderRedirect);

  return (
    <div className="flex w-full flex-col">
      <div className="mt-5">
        <Progress
          currentStep={3}
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
          const k = String(key) as keyof typeof tabKeyToStatusCode;

          setActiveTab(k);
          setPage(1);
          setPageSize(k === "submit" ? 100 : 10);
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
                {data?.records?.map((order) => (
                  <OrderItem
                    key={order.packingPackageCode}
                    activeTab={activeTab}
                    order={order}
                    onPayOrderRedirect={onPayOrderRedirect}
                  />
                ))}
              </div>
              <div className="mt-10 sticky bottom-0 border-t-[1px] bg-white z-10 card-cart p-4 py-6">
                {data && data.total > 0 && (
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
          ) : (
            <EmptyPackage />
          )}
        </Tab>

        {/* 可提交 */}
        <Tab
          key="pay"
          title={
            <div className="flex items-center space-x-2">
              <span>待付款</span>
            </div>
          }
        >
          {data?.records?.length ? (
            <>
              <div className="flex flex-col gap-3">
                {data?.records?.map((order) => (
                  <OrderItem
                    key={order.outboundId}
                    activeTab={activeTab}
                    order={order}
                    onPayOrderRedirect={onPayOrderRedirect}
                  />
                ))}
              </div>
              <div className="mt-10 sticky bottom-0 border-t-[1px] bg-white z-10 card-cart p-4 py-6">
                {data && data.total > 0 && (
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
          ) : (
            <EmptyPackage />
          )}
        </Tab>
        <Tab
          key="shipping"
          title={
            <div className="flex items-center space-x-2">
              <span>运输中</span>
            </div>
          }
        >
          {data?.records?.length ? (
            <>
              <div className="flex flex-col gap-3">
                {data?.records?.map((order) => (
                  <OrderItem
                    key={order.outboundId}
                    activeTab={activeTab}
                    order={order}
                    onPayOrderRedirect={onPayOrderRedirect}
                  />
                ))}
              </div>
              <div className="mt-10 sticky bottom-0 border-t-[1px] bg-white z-10 card-cart p-4 py-6">
                {data && data.total > 0 && (
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
          ) : (
            <EmptyPackage />
          )}
        </Tab>
        <Tab
          key="receivde"
          title={
            <div className="flex items-center space-x-2">
              <span>已收货</span>
            </div>
          }
        >
          {data?.records?.length ? (
            <>
              <div className="flex flex-col gap-3">
                {data?.records?.map((order) => (
                  <OrderItem
                    key={order.outboundId}
                    activeTab={activeTab}
                    order={order}
                    onPayOrderRedirect={onPayOrderRedirect}
                  />
                ))}
              </div>
              <div className="mt-10 sticky bottom-0 border-t-[1px] bg-white z-10 card-cart p-4 py-6">
                {data && data.total > 0 && (
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
          ) : (
            <EmptyPackage />
          )}
        </Tab>
      </Tabs>
    </div>
  );
}
