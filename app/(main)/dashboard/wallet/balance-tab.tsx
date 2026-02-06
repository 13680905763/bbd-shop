"use client";

import {
  Button,
} from "@heroui/react";
import React, { useState } from "react";
import { IoAddCircleOutline, IoWallet } from "react-icons/io5";

import RechargeModal from "@/components/modal/recharge.modal";
import { useGlobalStore } from "@/store";
import { useWalletInfo, useWalletDetailList } from "@/hook/api";
import { FullscreenLoader } from "@/components/ui";
import { useTranslations } from "next-intl";
import { CommonTable } from "@/components/common";


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
    isFetching,
    error: walletDetailListError,
  } = useWalletDetailList({
    current: page,
    size: pageSize,
  });


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
      <CommonTable
        columns={tableColumns}
        data={walletDetailList}
        isLoading={walletDetailListLoading || isFetching}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        renderCell={(item, columnKey) => {
          const value = item[columnKey as keyof typeof item];
          if (columnKey === "amount" || columnKey === "currentBalance") {
             const numValue = Number(value);
             return <span>{numValue < 0 ? `-${currency.symbol}${Math.abs(numValue)}` : `${currency.symbol}${numValue}`}</span>;
          }
          return <span>{value}</span>;
        }}
      />

      {/* 充值弹窗 */}
      <RechargeModal isOpen={isOpenRecharge} onOpenChange={setIsOpenRecharge} />
    </div>
  );
}
