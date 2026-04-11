"use client";

import { Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

import { useGlobalStore } from "@/store";
import { useConsumeList } from "@/hook/api";
import { CommonTable } from "@/components/common";

export default function ConsumeTab() {
  const t = useTranslations("dashboard.wallet.consume");
  const { currency } = useGlobalStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bizTypeCode, setBizTypeCode] = useState<string | undefined>(undefined);

  const { data, isLoading, isFetching } = useConsumeList({
    current: page,
    size: pageSize,
    bizTypeCode,
  });

  const tableColumns = [
    { key: "bizReference", label: t("tableColumns.bizReference") },
    { key: "bizType", label: t("tableColumns.bizType") },
    { key: "payAmount", label: t("tableColumns.payAmount") },
    { key: "method", label: t("tableColumns.method") },
    { key: "createTime", label: t("tableColumns.createTime") },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Tabs
        aria-label="Consumption Categories"
        color="primary"
        variant="underlined"
        onSelectionChange={(key) => {
          setPage(1);
          setBizTypeCode(key === "ALL" ? undefined : (key as string));
        }}
      >
        <Tab key="ALL" title={t("all")} />
        <Tab key="ORDER" title={t("order")} />
        <Tab key="WAYBILL" title={t("waybill")} />
      </Tabs>

      <CommonTable
        columns={tableColumns}
        data={data}
        isLoading={isLoading || isFetching}
        page={page}
        pageSize={pageSize}
        renderCell={(item, columnKey) => {
          const value = item[columnKey as keyof typeof item];

          if (columnKey === "payAmount") {
            const numValue = Number(value);

            return (
              <span className="font-medium">
                {currency.symbol}
                {numValue.toFixed(2)}
              </span>
            );
          }
          if (columnKey === "method") {
            return <span>{item.payName || item.paymentMethod}</span>;
          }

          return <span>{value}</span>;
        }}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
