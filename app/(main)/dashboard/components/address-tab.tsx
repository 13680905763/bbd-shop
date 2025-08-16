"use client";
import {
  Button,
  Spacer,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useCallback, useState } from "react";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { FieldConfig } from "@/components/form/formItem-renderer";
import { addAddress, deleteAddress, updateAddress } from "@/services/address";
import FormModal from "@/components/modal/form-modal";
import ConfirmModal from "@/components/modal/confirm-modal";
import { useAddressList } from "@/hook";
const addressColumns = [
  {
    key: "recipient",
    label: "收货人",
  },
  {
    key: "phone",
    label: "电话",
  },
  {
    key: "address",
    label: "详情地址",
  },
  {
    key: "actions",
    label: "操作",
  },
];
const fieldsaddress: FieldConfig[] = [
  {
    type: "input",
    name: "recipient",
    label: "收件人",
    placeholder: "请输入收件人姓名",
  },
  {
    type: "input",
    name: "phone",
    label: "联系方式",
    placeholder: "请输入联系方式",
  },
  {
    type: "area",
    name: "area",
    label: "area",
    placeholder: "area",
  },

  {
    type: "input",
    name: "address",
    label: "详细地址",
    placeholder: "请输入您详细地址",
  },
  {
    type: "input",
    name: "doorNo",
    label: "门牌号",
    placeholder: "请输入您的门牌号",
  },
  {
    type: "input",
    name: "postcode",
    label: "邮编",
    placeholder: "请输入邮编",
  },

  {
    type: "checkbox",
    name: "defaultAddress",
    label: "设为默认地址",
  },
];

type ModalType = "add" | "edit" | "delete" | null;
const initAddress = {
  recipient: "",
  phone: "",
  countryId: "",
  stateId: "",
  city: "",
  addressType: "",
  postcode: "",
  defaultAddress: 0,
  doorNo: "",
};

export default function AddressTab() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const { data, isLoading } = useAddressList();
  const [currentRowData, setCurrentRowData] = useState<any>(initAddress);
  const queryClient = useQueryClient();

  console.log("data", data);

  const handleAdd = () => {
    setCurrentRowData(initAddress);
    setModalType("add");
  };

  const handleEdit = (row: any) => {
    setCurrentRowData(row);
    setModalType("edit");
  };

  const handleDelete = (row: any) => {
    setCurrentRowData(row);
    setModalType("delete");
  };
  // 地址保存时处理
  const handleSave = async () => {
    const { createTime, updateTime, customerId, ...filteredData } =
      currentRowData;

    try {
      if (modalType === "add") {
        await addAddress({ ...currentRowData, addressType: 1 }); // 新增接口
      } else if (modalType === "edit") {
        await updateAddress(filteredData); // 编辑接口
      } else if (modalType === "delete") {
        await deleteAddress({ id: currentRowData.id });
      }
      setModalType(null);
    } catch {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["addressList"] }); // 手动刷新
    }
  };
  const renderCell = useCallback((rows: any, columnKey: any) => {
    const cellValue = rows[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              color="primary"
              radius="none"
              size="sm"
              onPress={() => handleEdit(rows)}
            >
              编辑
            </Button>
            <Button
              className="button-default"
              radius="none"
              size="sm"
              onPress={() => handleDelete(rows)}
            >
              删除
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (isLoading) return <div>加载中...</div>;

  return (
    <>
      <Button color="primary" radius="none" size="sm" onPress={handleAdd}>
        + 添加地址
      </Button>
      <Spacer y={2} />

      <Table
        aria-label="address-table"
        classNames={{
          wrapper: "p-0 rounded-none border-1",
          tr: "border-b-1 last:border-b-0",
          th: "text-default-500 !rounded-none",
        }}
        radius="none"
        shadow="none"
      >
        <TableHeader columns={addressColumns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No address information available at the moment."}
          items={data}
        >
          {(item: any) => (
            <TableRow key={item?.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <FormModal
        fields={fieldsaddress}
        formData={currentRowData}
        isOpen={modalType === "add" || modalType === "edit"}
        title={modalType === "add" ? "添加地址" : "编辑地址"}
        onChange={setCurrentRowData}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
        onSave={handleSave}
      />
      <ConfirmModal
        content={`确定要删除该地址吗？`}
        isOpen={modalType === "delete"}
        onConfirm={(close) => {
          handleSave();
          close();
        }}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />
    </>
  );
}
