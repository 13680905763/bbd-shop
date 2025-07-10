import {
  Button,
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { useState } from "react";
import { IoAddCircleOutline, IoWallet } from "react-icons/io5";

import WalletCard from "./wallet-card";

import FormModal from "@/components/modal/form-modal";
import { FieldConfig } from "@/components/form/formItem-renderer";
import RechargeModal from "@/components/modal/recharge.modal";
import { useWalletStore } from "@/store";
import { useWalletDetailList } from "@/hook";
const columns = [
  {
    key: "bizReference",
    label: "业务号",
  },
  {
    key: "bizType",
    label: "业务类型",
  },
  {
    key: "amount",
    label: "交易金额",
  },
  {
    key: "currentBalance",
    label: "账户余额",
  },
  {
    key: "createTime",
    label: "交易时间",
  },
];

const WithdrawalFields: FieldConfig[] = [
  {
    type: "input",
    name: "name12311",
    label: "姓名123123",
    placeholder: "请输入姓名",
  },
  {
    type: "select",
    name: "country",
    label: "银行",
    placeholder: "选择银行",
    options: [
      {
        label: "中国银行",
        value: "Argentina",
        // icon: "https://flagcdn.com/ar.svg",
      },
      {
        label: "建设银行",
        value: "Venezuela",
        // icon: "https://flagcdn.com/ve.svg",
      },
      {
        label: "paypal",
        value: "Brazil",
        // icon: "https://flagcdn.com/ve.svg",
      },
    ],
  },
  {
    type: "input",
    name: "phone123",
    label: "卡号",
    placeholder: "请确认卡号",
  },
  {
    type: "input",
    name: "phone12123",
    label: "金额",
    placeholder: "请输入金额",
  },
];

export default function BalanceTab() {
  const wallet = useWalletStore((state) => state.wallet);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useWalletDetailList();
  const walletDetailList =
    data?.pages?.flatMap((page: any) => page?.records) ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenWithdrawal, setIsOpenWithdrawal] = useState(false);
  const [formData, setFormData] = useState({});
  const handleSave = async () => {
    console.log("修改密码");
  };

  return (
    <div>
      <WalletCard
        actions={
          <>
            <Button color="primary" size="md" onPress={() => setIsOpen(true)}>
              <IoAddCircleOutline className="w-5 h-5" />
              充值
            </Button>
            <Button
              className="button-default"
              size="md"
              onPress={() => setIsOpenWithdrawal(true)}
            >
              <IoWallet className="w-5 h-5" />
              提现
            </Button>
          </>
        }
        number={wallet?.availabalBalance as number}
        title="余额"
      />
      <div className="font-bold my-4">余额流水</div>
      <Table
        isHeaderSticky
        // bottomContent={
        //   <div className="flex w-full justify-center">
        //     <Pagination
        //       isCompact
        //       showControls
        //       showShadow
        //       page={10}
        //       // total={WalletDetail.total}
        //       total={1}
        //       onChange={(page) => fetchNextPage()}
        //     />
        //   </div>
        // }
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "p-0 rounded-none  border-1",
          tr: "border-b-1 last:border-b-0 !shadow-none",
          th: "text-default-500 !rounded-none",
        }}
        radius="none"
        shadow="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={walletDetailList}>
          {(item: any) => (
            <TableRow key={item?.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <RechargeModal isOpen={isOpen} onOpenChange={setIsOpen} />

      <FormModal
        fields={WithdrawalFields}
        formData={formData}
        isOpen={isOpenWithdrawal}
        title={"提现"}
        onChange={setFormData}
        onOpenChange={setIsOpenWithdrawal}
        onSave={handleSave}
      />
    </div>
  );
}
