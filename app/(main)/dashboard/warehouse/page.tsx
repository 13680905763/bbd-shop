"use client";
import { Button, Checkbox, Spinner, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import WarehouseItem from "./warehouse-item";

import PaginationBar from "@/components/common/pagination-bar";
import { useSelection } from "@/hook/common";
import {
  BlockSpinner,
  BusinessProgress,
  EmptyState,
  FullscreenLoader,
} from "@/components/ui";
import { useWarehousePackageList, useCreateWaybillPreview } from "@/hook/api";
const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  submit: "302",
};

export default function WarehousePage() {
  const t = useTranslations("dashboard.warehouse");
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<keyof typeof tabKeyToStatusCode>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const { data, isLoading, isFetching } = useWarehousePackageList({
    current: page,
    size: pageSize,
    statusCode: tabKeyToStatusCode[activeTab],
  });
  const { mutateAsync: createPreview, isPending } = useCreateWaybillPreview();
  const {
    selectedIds,
    isSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
    onClearAll,
  } = useSelection(data?.records || [], { idKey: "packageCode" });

  useEffect(() => {
    onClearAll();
  }, [page, activeTab, onClearAll]);

  const handleSubmit = async () => {
    const key = await createPreview(selectedIds);
    router.push(`/submit/warehouse?key=${key}`);
  };

  const renderWarehouseContent = () => {
    if (!data?.records?.length) return <EmptyState />;

    return (
      <div className="relative">
        {/* 列表 */}
        {(isFetching) && <BlockSpinner />}
        <div className="space-y-3 ">
          {data.records.map((warehouse) => (
            <WarehouseItem
              key={warehouse.id}
              isSelected={isSelected}
              packageItem={warehouse}
              showCheckbox={activeTab === "submit"}
              onSelect={onSelect}
            />
          ))}
        </div>

        {/* 底部 */}
        <div className="mt-10 sticky bottom-0 z-10 border-t bg-white p-4 border border-gray-200 rounded-lg">
          {activeTab === "submit" && (
            <div className="flex items-center justify-between">
              <Checkbox isSelected={isAllSelected} onChange={onToggleSelectAll}>
                {t("selectAll")}
              </Checkbox>
              <Button
                className="w-[200px]"
                color="primary"
                isDisabled={!selectedIds.length}
                isLoading={isPending}
                size="lg"
                onPress={handleSubmit}
              >
                {t("submitPackage")}
                {selectedIds.length ? ` (${selectedIds.length})` : ""}
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
        <BusinessProgress currentStep={2} />
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
        <Tab key="all" title={<span>{t("allTab")}</span>}>
          {renderWarehouseContent()}
        </Tab>
        <Tab key="submit" title={<span>{t("submitTab")}</span>}>
          {renderWarehouseContent()}
        </Tab>
      </Tabs>
    </div>
  );
}
