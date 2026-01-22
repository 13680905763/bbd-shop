"use client";

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
import { IoAddCircleOutline, IoWallet } from "react-icons/io5";

import RechargeModal from "@/components/modal/recharge.modal";
import { useGlobalStore } from "@/store";
import PaginationBar from "@/components/common/pagination-bar";
import { useWalletInfo, useWalletDetailList } from "@/hook/api";
import { BlockSpinner, EmptyState, FullscreenLoader } from "@/components/ui";
import { useTranslations } from "next-intl";


export default function BalanceTab() {
  const {
    data: wallet,
    isLoading,
    error,
  } = useWalletInfo();
  const t = useTranslations("dashboard.wallet.balance");

  const { currency } = useGlobalStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isOpenRecharge, setIsOpenRecharge] = useState(false);

  const {
    data: walletDetailList,
    isLoading: walletDetailListLoading,
    error: walletDetailListError,
  } = useWalletDetailList({
    current: page,
    size: pageSize,
  });
  const total = walletDetailList?.total || 10;


  const tableColumns = [
    {
      key: "bizReference",
      label: t("tableColumns.bizReference"),
    },
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
  if (isLoading) return <FullscreenLoader />;
  return (
    <div>
      {/* 钱包卡片区域 */}
      <div className="flex justify-between bg-[#ffeee1] rounded-lg p-8">
        <div className="flex items-center gap-2">
          <IoWallet className="w-6 h-6 text-[#f0700c]" />
          <div className="text-lg font-bold">{t("title")}</div>
          <span className="text-money-3xl">
            {currency.symbol}
            {wallet?.availabalBalance}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            color="primary"
            size="md"
            onPress={() => setIsOpenRecharge(true)}
          >
            <IoAddCircleOutline className="w-5 h-5" />
            {t("recharge")}
          </Button>
          <Button
            isDisabled
            className="button-default"
            size="md"
          // onPress={() => setIsOpenWithdrawal(true)}
          >
            <IoWallet className="w-5 h-5" />
            {t("withdraw")}
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="font-bold my-4">{t("tableTitle")}</div>
      <Table
        className="relative"
        // isHeaderSticky
        bottomContent={
          <>
            {!walletDetailListLoading &&
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
      // classNames={{
      //   wrapper: "p-0 rounded-none border-1",
      //   tr: "border-b-1 last:border-b-0 !shadow-none",
      //   th: "text-default-500 !rounded-none",
      // }}
      // radius="none"
      // shadow="none"
      >
        <TableHeader columns={tableColumns}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={<EmptyState className="!h-auto" />}
          loadingContent={<BlockSpinner />}
          isLoading={walletDetailListLoading}
          items={walletDetailList?.records || []}
        >
          {(item: any) => (
            <TableRow key={item?.id}>
              {(columnKey) => {
                const value = getKeyValue(item, columnKey);
                const formatted =
                  (columnKey === "amount" || columnKey === "currentBalance") &&
                    value !== undefined
                    ? Number(value) < 0
                      ? `-${currency.symbol}${Math.abs(Number(value))}`
                      : `${currency.symbol}${value}`
                    : value;

                return <TableCell>{formatted}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 充值弹窗 */}
      <RechargeModal isOpen={isOpenRecharge} onOpenChange={setIsOpenRecharge} />

      {/* 提现弹窗 */}
      {/* <FormModal
        fields={withdrawalFields}
        formData={formData}
        isOpen={isOpenWithdrawal}
        title={texts.withdrawModalTitle}
        onChange={setFormData}
        onOpenChange={setIsOpenWithdrawal}
        onSave={handleSave}
      /> */}
    </div>
  );
}
