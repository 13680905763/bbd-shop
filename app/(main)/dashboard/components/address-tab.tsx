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

import { FieldConfig } from "@/components/form/formItem-renderer";
import { useAddressList } from "@/hook/addresses/useAddressList";
import { deleteAddress, updateAddress } from "@/services/address";
import FormModal from "@/components/modal/form-modal";
import ConfirmModal from "@/components/modal/confirm-modal";
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
    name: "postcode",
    label: "邮编",
    placeholder: "请输入邮编",
  },
  {
    type: "checkbox",
    name: "defaultAddress",
    label: "设为默认地址",
  },
  {
    type: "checkbox",
    name: "defaultAddress",
    label: "设为默认地址",
  },
];

type ModalType = "add" | "edit" | "delete" | null;
const initAddress = {
  id: "",
  recipient: "",
  phone: "",
  countryId: "",
  stateId: "",
  city: "",
  addressType: "",
  postcode: "",
  defaultAddress: 1,
};

export default function AddressTab() {
  const { data, isLoading, mutate } = useAddressList();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentRowData, setCurrentRowData] = useState<any>(initAddress);

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
    console.log("当前行数据:", currentRowData);
    if (modalType === "add") {
      console.log("currentRowData", { ...currentRowData, addressType: 1 });

      // await addAddress({
      //   recipient: `"jack"${Math.random().toFixed(2)}`,
      //   phone: "1355495214",
      //   email: "jack56798@google.com",
      //   country: "USA",
      //   city: "NEW YORK",
      //   address: "TRUMP ROAD NO.123",
      //   postcode: "1458523",
      //   addressType: 1,
      //   defaultAddress: 1,
      // }); // 新增接口
    } else if (modalType === "edit") {
      await updateAddress(currentRowData); // 编辑接口
      console.log(666);
    } else if (modalType === "delete") {
      await deleteAddress(currentRowData.id);
    }
    mutate();
    setModalType(null);
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

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        123
        {/* {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))} */}
      </div>
    );
  }

  //   if (!data.length) {
  //     return (
  //       <Empty
  //         description={t("address.emptyDescription")}
  //         title={t("address.emptyTitle")}
  //       />
  //     );
  //   }

  return (
    <>
      <Button color="primary" radius="none" onPress={handleAdd}>
        + 添加地址
      </Button>
      <Spacer y={2} />
      <Table
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
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.id}>
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
