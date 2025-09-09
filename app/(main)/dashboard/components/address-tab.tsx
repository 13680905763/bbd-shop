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
import FullscreenLoader from "@/components/common/fullscreen-loader";

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

interface AddressTabProps {
  texts: {
    title: { add: string; edit: string; deleteConfirm: string };
    buttons: { add: string; edit: string; delete: string };
    tableColumns: { key: string; label: string }[];
    tableEmpty: string;
  };
  fields: FieldConfig[];
  tableColumns: any;
}

export default function AddressTab({
  texts,
  fields,
  tableColumns,
}: AddressTabProps) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const { data, isLoading } = useAddressList();
  const [currentRowData, setCurrentRowData] = useState<any>(initAddress);
  const queryClient = useQueryClient();

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

  const handleSave = async () => {
    const { createTime, updateTime, customerId, ...filteredData } =
      currentRowData;

    try {
      if (modalType === "add") {
        await addAddress({
          ...currentRowData,
          addressType: 1,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
        });
      } else if (modalType === "edit") {
        await updateAddress({
          ...filteredData,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
          city: filteredData?.city || filteredData?.state,
        });
      } else if (modalType === "delete") {
        await deleteAddress({ id: currentRowData.id });
      }
      setModalType(null);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    }
  };

  const renderCell = useCallback(
    (rows: any, columnKey: any) => {
      const cellValue = rows[columnKey];

      if (columnKey === "actions") {
        return (
          <div className="relative flex items-center gap-2">
            <Button
              color="primary"
              radius="none"
              size="sm"
              onPress={() => handleEdit(rows)}
            >
              {texts.buttons.edit}
            </Button>
            <Button
              className="button-default"
              radius="none"
              size="sm"
              onPress={() => handleDelete(rows)}
            >
              {texts.buttons.delete}
            </Button>
          </div>
        );
      }

      return cellValue;
    },
    [texts.buttons],
  );

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <Button color="primary" radius="none" size="sm" onPress={handleAdd}>
        {texts.buttons.add}
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
        <TableHeader columns={tableColumns}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={texts.tableEmpty} items={data}>
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
        fields={fields}
        formData={currentRowData}
        isOpen={modalType === "add" || modalType === "edit"}
        title={modalType === "add" ? texts.title.add : texts.title.edit}
        onChange={setCurrentRowData}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
        onSave={handleSave}
      />

      <ConfirmModal
        content={texts.title.deleteConfirm}
        isOpen={modalType === "delete"}
        onConfirm={async () => {
          handleSave();
        }}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />
    </>
  );
}
