"use client";
import { Button, Checkbox, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import WarehouseItem from "./warehouse-item";

import Progress from "@/components/common/progress";
import PaginationBar from "@/components/common/pagination-bar";
import { createWarehousePreviewKeyByCart } from "@/services";
import { useWarehouseList } from "@/hook";

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
  submit: "CAN OUTBOUND",
};

export default function WarehousePage() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof tabKeyToStatusCode>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data, isLoading } = useWarehouseList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  ) as { data?: WarehouseListResponse; isLoading: boolean };

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const router = useRouter();

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
  const EmptyWarehouse = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
      <p className="text-lg mb-2">暂无包裹</p>
    </div>
  );

  if (isLoading) return <div>加载中...</div>;

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
          const k = String(key) as keyof typeof tabKeyToStatusCode;

          setActiveTab(k);
          setPage(1);
          setPageSize(k === "submit" ? 100 : 10);
        }}
      >
        {/* 全部 */}
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
                {data?.records?.map((warehouse) => (
                  <WarehouseItem
                    key={warehouse.id}
                    activeTab={activeTab}
                    warehouse={warehouse}
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
            <EmptyWarehouse />
          )}
        </Tab>

        {/* 可提交 */}
        <Tab
          key="submit"
          title={
            <div className="flex items-center space-x-2">
              <span>可提交包裹</span>
            </div>
          }
        >
          {data?.records?.length ? (
            <>
              <div className="flex flex-col gap-3">
                {data?.records?.map((warehouse) => (
                  <WarehouseItem
                    key={warehouse.id}
                    activeTab={activeTab}
                    selected={!!selected[warehouse.packageCode]}
                    warehouse={warehouse}
                    onChange={(e: any) => {
                      setSelected((prev) => ({
                        ...prev,
                        [warehouse.packageCode]: e.target.checked,
                      }));
                    }}
                  />
                ))}
              </div>
              <div className="mt-10 sticky bottom-0 border-t-[1px] bg-white z-10 card-cart">
                <div className="flex justify-between items-center p-4 gap-4">
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
                      onPress={handleWarehouseSubmit}
                    >
                      提交包裹
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyWarehouse />
          )}
        </Tab>
      </Tabs>
    </div>
  );
}
