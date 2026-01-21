"use client";

import React, { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { useBonus } from "@/hook/api";
import { CommonTable } from "@/components/common";


export default function PromotionBonusPage() {
  const t: any = useTranslations("dashboard.promotion.bonus");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data,
    isLoading,
    isFetching,
  } = useBonus({
    current: page,
    size: pageSize,
  });
  const tableColumns = [
    {
      key: "bizType",
      label: t("tableColumns.bizType"),
    },
    {
      key: "amount",
      label: t("tableColumns.amount"),
    },
    {
      key: "currentBalance",
      label: t("tableColumns.currentBalance"),
    },
    {
      key: "createTime",
      label: t("tableColumns.createTime"),
    },
  ]
  return (
    <>
      <div className="font-bold my-4">{t('title')}</div>
      <CommonTable
        columns={tableColumns}
        data={data}
        isLoading={isFetching}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </>
  );
}
