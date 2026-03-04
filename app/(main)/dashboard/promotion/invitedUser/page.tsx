"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Chip, getKeyValue } from "@heroui/react";

import { useInvitedUsers } from "@/hook/api";
import { CommonTable } from "@/components/common";

export default function InvitedUser() {
  const t = useTranslations("dashboard.promotion.invitedUser");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isFetching } = useInvitedUsers({
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
      key: "status",
      label: t("tableColumns.status"),
    },
    {
      key: "createTime",
      label: t("tableColumns.createTime"),
    },
  ];

  const renderCell = useCallback(
    (item: any, columnKey: any) => {
      const cellValue = item[columnKey as keyof typeof item];

      switch (columnKey) {
        case "status":
          return (
            <Chip
              className={
                cellValue === 1 ? "bg-[#f0700c]/20 text-[#f0700c]" : ""
              }
              color={cellValue === 1 ? undefined : "default"}
              size="sm"
              variant="flat"
            >
              {t(`status.${cellValue}`)}
            </Chip>
          );
        default:
          return getKeyValue(item, columnKey);
      }
    },
    [t],
  );

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
        renderCell={renderCell}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </>
  );
}
