import {
  Button,
  getKeyValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { IoTicketOutline, IoWallet } from "react-icons/io5";

import { usePointsList, useUserInfo } from "@/hook/api";
import { useTranslations } from "next-intl";
import { BlockSpinner, EmptyState } from "@/components/ui";
import PaginationBar from "@/components/common/pagination-bar";

export default function ScoreTab() {
  const t = useTranslations("dashboard.wallet.score");
  const [isOpen, setIsOpen] = useState(false);
  const { data: user, isLoading: userLoading, error } = useUserInfo();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: scoreList,
    isLoading: scoreListLoading,
    error: scoreListError,
  } = usePointsList({
    current: page,
    size: pageSize,
  });
  const total = scoreList?.total || 10;
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
      key: "availablePoints",
      label: t("tableColumns.availablePoints"),
    },
    {
      key: "createTime",
      label: t("tableColumns.createTime"),
    },
  ];

  return (
    <div>
      <div className="flex justify-between bg-[#ffeee1] rounded-lg p-8">
        <div className="flex items-center gap-2">
          <IoWallet className="w-6 h-6 text-[#f0700c]" />
          <div className="text-lg font-bold">{t("title")}</div>
          <span className="text-money-3xl">{user?.myPoints}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            color="primary"
            size="md"
            isDisabled
          // onPress={() => setIsOpenRecharge(true)}
          >
            <IoTicketOutline className="w-5 h-5 " />
            {t("exchangeCoupon")}
          </Button>
        </div>
      </div>

      <div className="font-bold my-4">{t("details")}</div>
      <Table
        className="relative"
        bottomContent={
          <>
            {!scoreListLoading &&
              <div className="">
                <PaginationBar
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            }
          </>
        }
      >
        <TableHeader columns={tableColumns}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={<EmptyState className="!h-auto" />}
          loadingContent={<BlockSpinner />}
          isLoading={scoreListLoading}
          items={scoreList?.records || []}
        >
          {(item: any) => (
            <TableRow key={item?.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
