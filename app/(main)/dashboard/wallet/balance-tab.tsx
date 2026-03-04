"use client";

import { Button, Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";
import { IoAddCircleOutline, IoWallet } from "react-icons/io5";
import { useTranslations } from "next-intl";

import RechargeModal from "@/components/modal/recharge.modal";
import { useGlobalStore } from "@/store";
import {
  useWalletInfo,
  useWalletDetailList,
  useWithdrawalHistory,
} from "@/hook/api";
import { FullscreenLoader } from "@/components/ui";
import { CommonTable } from "@/components/common";
import WithdrawModal from "@/components/modal/withdraw.modal";

export default function BalanceTab() {
  const { data: wallet, isLoading, error } = useWalletInfo();
  const t = useTranslations("dashboard.wallet.balance");

  const { currency } = useGlobalStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const [withdrawalPageSize, setWithdrawalPageSize] = useState(10);
  const [isOpenRecharge, setIsOpenRecharge] = useState(false);
  const [isOpenWithdraw, setIsOpenWithdraw] = useState(false);

  const {
    data: walletDetailList,
    isLoading: walletDetailListLoading,
    isFetching,
    error: walletDetailListError,
  } = useWalletDetailList({
    current: page,
    size: pageSize,
  });

  const {
    data: withdrawalList,
    isLoading: withdrawalLoading,
    isFetching: withdrawalFetching,
  } = useWithdrawalHistory({
    current: withdrawalPage,
    size: withdrawalPageSize,
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
  ];

  if (isLoading) return <FullscreenLoader />;

  return (
    <div>
      {/* 钱包卡片区域 */}
      <div className="flex justify-between bg-[#ffeee1] rounded-lg p-8">
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <IoWallet className="w-10 h-10 text-[#f0700c]" />
              <div className="flex flex-col">
                <div className="text-sm text-default-500 font-medium">
                  {t("availableBalance")}
                </div>
                <div className="text-3xl font-bold text-[#f0700c]">
                  {currency.symbol}
                  {wallet?.availabalBalance}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-8 ">
            <div className="flex flex-col gap-1">
              <div className=" text-default-400">{t("totalBalance")}</div>
              <div className=" font-medium text-default-700">
                {currency.symbol}
                {wallet?.balance}
              </div>
            </div>

            <div className="w-[1px] h-8 bg-default-300" />

            <div className="flex flex-col gap-1">
              <div className=" text-default-400">{t("frozenBalance")}</div>
              <div className=" font-medium text-default-700">
                {currency.symbol}
                {wallet?.frozenBalance}
              </div>
            </div>
          </div>
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
            className="button-default"
            size="md"
            onPress={() => setIsOpenWithdraw(true)}
          >
            <IoWallet className="w-5 h-5" />
            {t("withdraw")}
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <Tabs aria-label="Wallet History" className="mt-8">
        <Tab key="transaction" title={t("tableTitle")}>
          <CommonTable
            columns={tableColumns}
            data={walletDetailList}
            isLoading={walletDetailListLoading || isFetching}
            page={page}
            pageSize={pageSize}
            renderCell={(item, columnKey) => {
              const value = item[columnKey as keyof typeof item];

              if (columnKey === "amount" || columnKey === "currentBalance") {
                const numValue = Number(value);

                return (
                  <span>
                    {numValue < 0
                      ? `-${currency.symbol}${Math.abs(numValue)}`
                      : `${currency.symbol}${numValue}`}
                  </span>
                );
              }

              return <span>{value}</span>;
            }}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </Tab>
        <Tab key="withdrawal" title={t("withdrawalHistory")}>
          <div className="flex flex-col gap-4">
            <CommonTable
              columns={[
                { key: "amount", label: t("tableColumns.amount") },
                { key: "feeAmount", label: t("tableColumns.fee") },
                { key: "payAmount", label: t("tableColumns.actualAmount") },
                { key: "status", label: t("tableColumns.status") },
                { key: "createTime", label: t("tableColumns.createTime") },
              ]}
              data={withdrawalList}
              isLoading={withdrawalLoading || withdrawalFetching}
              page={withdrawalPage}
              pageSize={withdrawalPageSize}
              renderCell={(item, columnKey) => {
                const value = item[columnKey as keyof typeof item];

                if (
                  columnKey === "amount" ||
                  columnKey === "feeAmount" ||
                  columnKey === "payAmount"
                ) {
                  return (
                    <span>
                      {currency.symbol}
                      {value}
                    </span>
                  );
                }

                return <span>{value}</span>;
              }}
              onPageChange={setWithdrawalPage}
              onPageSizeChange={setWithdrawalPageSize}
            />
          </div>
        </Tab>
      </Tabs>

      {/* 充值弹窗 */}
      <RechargeModal isOpen={isOpenRecharge} onOpenChange={setIsOpenRecharge} />
      <WithdrawModal
        balance={wallet?.availabalBalance}
        isOpen={isOpenWithdraw}
        onOpenChange={setIsOpenWithdraw}
      />
    </div>
  );
}
