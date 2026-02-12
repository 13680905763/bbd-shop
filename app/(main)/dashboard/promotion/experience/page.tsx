"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

import { useExperience } from "@/hook/api";
import { CommonTable } from "@/components/common";

export default function PromotionExperiencePage() {
  const t: any = useTranslations("dashboard.promotion.experience");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isFetching } = useExperience({
    current: page,
    size: pageSize,
  });

  const tableColumns = [
    {
      key: "email",
      label: t("tableColumns.email"),
    },
    {
      key: "experience",
      label: t("tableColumns.experience"),
    },
    {
      key: "createTime",
      label: t("tableColumns.createTime"),
    },
  ];

  return (
    <>
      <div className="font-bold my-4">{t("title")}</div>
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
