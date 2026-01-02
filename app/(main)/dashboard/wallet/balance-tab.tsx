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

import { FieldConfig } from "@/components/form/formItem-renderer";
import RechargeModal from "@/components/modal/recharge.modal";
import { useGlobalStore, useWalletStore } from "@/store";
import { getWalletDetailList, getWalletInfo } from "@/services/wallet";
import PaginationBar from "@/components/common/pagination-bar";

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

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(10);

  const [walletRecords, setWalletRecords] = useState([]);

  const [isOpenRecharge, setIsOpenRecharge] = useState(false);
  const [isOpenWithdrawal, setIsOpenWithdrawal] = useState(false);
  const [formData, setFormData] = useState({});

  /** ✅ fetchData  */
  const fetchData = async () => {
    try {
      const res: any = await getWalletDetailList(page, pageSize);
      const wallet = await getWalletInfo();

      console.log("res", res);
      useWalletStore.getState().setWallet(wallet);
      setWalletRecords(res?.records || []);
      setTotal(res?.pages || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    console.log("保存提现数据:", formData);
  };

  useEffect(() => {
    fetchData();
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
            isDisabled
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
        bottomContent={
          <>
            {!loading && (
              <div className=" sticky bottom-0 border-t bg-white z-10 p-4 ">
                <PaginationBar
                  page={page}
                  pageSize={pageSize}
                  total={total as number}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            )}
          </>
        }
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
          isLoading={loading}
          items={walletRecords}
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
