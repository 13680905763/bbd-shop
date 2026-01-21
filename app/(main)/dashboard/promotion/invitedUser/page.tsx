"use client";

import React, { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { useInvitedUsers } from "@/hook/api";
import { CommonTable } from "@/components/common";

export default function InvitedUser() {
  const t = useTranslations("dashboard.promotion.invitedUser");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data,
    isLoading,
    isFetching,
  } = useInvitedUsers({
    current: page,
    size: pageSize,
  });

  const tableColumns = [
    {
      key: "name",
      label: t("tableColumns.name"),
    },
    {
      key: "email",
      label: t("tableColumns.email"),
    },
    {
      key: "createTime",
      label: t("tableColumns.createTime"),
    },
  ];
  // if (isLoading) return <FullscreenLoader />;
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
