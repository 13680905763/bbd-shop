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

import FormModal from "@/components/modal/form-modal";
import { FieldConfig } from "@/components/form/formItem-renderer";
import RechargeModal from "@/components/modal/recharge.modal";
import { useGlobalStore, useWalletStore } from "@/store";
import { useWalletDetailList } from "@/hook";
import { getWalletInfo } from "@/services/wallet";

interface BalanceTabProps {
  tableColumns: any[];
  withdrawalFields: FieldConfig[];
  texts: {
    title: string;
    recharge: string;
    withdraw: string;
    tableTitle: string;
    noData: string;
    withdrawModalTitle: string;
  };
}

export default function BalanceTab({
  tableColumns,
  withdrawalFields,
  texts,
}: BalanceTabProps) {
  const wallet = useWalletStore((state) => state.wallet);
  const { currency } = useGlobalStore();

  const { data, isLoading } = useWalletDetailList();

  const walletDetailList =
    data?.pages?.flatMap((page: any) => page?.records) ?? [];

  const [isOpenRecharge, setIsOpenRecharge] = useState(false);
  const [isOpenWithdrawal, setIsOpenWithdrawal] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSave = async () => {
    console.log("保存提现数据:", formData);
  };

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const wallet = await getWalletInfo();

        useWalletStore.getState().setWallet(wallet);
      } catch {}
    };

    fetchWallet();
  }, []);

  return (
    <div>
      {/* 钱包卡片区域 */}
      <div className="flex justify-between bg-[#ffeee1] rounded-lg p-8">
        <div className="flex items-center gap-2">
          <IoWallet className="w-6 h-6 text-[#f0700c]" />
          <div className="text-lg font-bold">{texts.title}</div>
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
            {texts.recharge}
          </Button>
          <Button
            className="button-default"
            size="md"
            onPress={() => setIsOpenWithdrawal(true)}
          >
            <IoWallet className="w-5 h-5" />
            {texts.withdraw}
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="font-bold my-4">{texts.tableTitle}</div>
      <Table
        isHeaderSticky
        classNames={{
          wrapper: "p-0 rounded-none border-1",
          tr: "border-b-1 last:border-b-0 !shadow-none",
          th: "text-default-500 !rounded-none",
        }}
        radius="none"
        shadow="none"
      >
        <TableHeader columns={tableColumns}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={texts.noData}
          isLoading={isLoading}
          items={walletDetailList}
          loadingContent={<Spinner />}
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
      <FormModal
        fields={withdrawalFields}
        formData={formData}
        isOpen={isOpenWithdrawal}
        title={texts.withdrawModalTitle}
        onChange={setFormData}
        onOpenChange={setIsOpenWithdrawal}
        onSave={handleSave}
      />
    </div>
  );
}
