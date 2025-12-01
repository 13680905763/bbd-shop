"use client";
import { Button, Checkbox, Spinner, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import WarehouseItem from "./warehouse-item";

import Progress from "@/components/common/order-progress";
import PaginationBar from "@/components/common/pagination-bar";
import { createWarehousePreviewKeyByCart } from "@/services";
import { useWarehouseList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";

interface WarehouseRecord {
  id: string;
  packageCode: string;
  [key: string]: any;
}
interface WarehouseListResponse {
  records: WarehouseRecord[];
  total: number;
}

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  submit: "302",
};

export default function WarehousePage() {
  const t = useTranslations("Dashboard.WarehousePage");
  const [activeTab, setActiveTab] =
    useState<keyof typeof tabKeyToStatusCode>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data, isLoading, isFetching } = useWarehouseList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  ) as {
    data?: WarehouseListResponse;
    isLoading: boolean;
    isFetching: boolean;
  };

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const allIds = useMemo<string[]>(() => {
    return data?.records.map((w) => w.packageCode) || [];
  }, [data]);

  const allSelected = useMemo(() => {
    return (
      allIds.length > 0 && allIds.every((packageCode) => selected[packageCode])
    );
  }, [allIds, selected]);

  const toggleAll = (checked: boolean) => {
    const newSelected = Object.fromEntries(allIds.map((id) => [id, checked]));

    setSelected(newSelected);
  };

  const selectedIds = useMemo<string[]>(() => {
    return Object.entries(selected)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  }, [selected]);

  const handleWarehouseSubmit = async () => {
    const key = await createWarehousePreviewKeyByCart({
      packageSet: selectedIds,
    });

    router.push("/submit/warehouse?key=" + key);
  };

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
      <p className="text-lg mb-2">{t("emptyText")}</p>
    </div>
  );

  if (isLoading) return <FullscreenLoader />;

  /** Tab 内容组件 */
  const WarehouseTabContent = ({ footer }: { footer?: React.ReactNode }) => {
    if (!data?.records?.length) return <EmptyWarehouse />;
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
          {data?.records?.map((warehouse) => (
            <WarehouseItem
              key={warehouse.id}
              activeTab={activeTab}
              selected={!!selected[warehouse.packageCode]}
              texts={t.raw("texts")}
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

  return (
    <div className="flex w-full flex-col">
      <div className="mt-5">
        <Progress currentStep={2} />
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
          <WarehouseTabContent />
        </Tab>
        <Tab key="submit" title={<span>{t("submitTab")}</span>}>
          <WarehouseTabContent
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
                  onPress={handleWarehouseSubmit}
                >
                  {t("submitPackage")}
                </Button>
              </div>
            }
          />
        </Tab>
      </Tabs>
    </div>
  );
}
