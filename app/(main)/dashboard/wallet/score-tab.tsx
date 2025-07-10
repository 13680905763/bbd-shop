import {
  Avatar,
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
import { IoRepeat } from "react-icons/io5";

import WalletCard from "./wallet-card";

import CommonModal from "@/components/modal/common-modal";

const columns = [
  {
    key: "name",
    label: "AC单号",
  },
  {
    key: "role",
    label: "类型",
  },
  {
    key: "status",
    label: "收入/支出",
  },
];
const rows = [
  {
    key: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
];

export default function ScoreTab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <WalletCard
        actions={
          <Button color="primary" size="md" onPress={() => setIsOpen(true)}>
            <IoRepeat className="w-5 h-5" />
            积分兑换优惠券
          </Button>
        }
        number={5268}
        title="积分"
      />
      <div className="font-bold my-4">积分流水</div>
      <Table
        removeWrapper
        aria-label="Example table with dynamic content"
        classNames={{}}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CommonModal
        isOpen={isOpen}
        showFooter={false}
        title="积分兑换"
        onOpenChange={setIsOpen}
      >
        <div>
          <div className="w-full p-5 rounded-lg border-1 border-[#ccc] flex justify-between items-center mb-4">
            <div className="flex gap-6">
              <div>
                <Avatar
                  size="lg"
                  src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
                />
              </div>
              <div>
                <div className="text-money-xl">CAD 999</div>
                <div className="text-xs">
                  <div>所需积分：50</div>
                  <div>需要会员等级：1</div>
                </div>
              </div>
            </div>
            <div>
              <Button color="primary">兑换</Button>
            </div>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
