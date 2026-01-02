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
import { useState } from "react";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { deleteAddress } from "@/services/address";
import ConfirmModal from "@/components/modal/confirm-modal";
import { useAddressList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import AddressModal from "@/components/modal/address-modal";

type ModalType = "add" | "edit" | "delete" | null;

export function AddressTab() {
  const t = useTranslations("dashboard.page.address");

  const [modalType, setModalType] = useState<ModalType>(null);
  const { data, isLoading } = useAddressList();
  const [currentRowData, setCurrentRowData] = useState<any>(null);
  const queryClient = useQueryClient();

  const tableColumns = [
    {
      key: "recipient",
      label: t("tableColumns.recipient.label"),
    },
    {
      key: "phone",
      label: t("tableColumns.phone.label"),
    },
    {
      key: "address",
      label: t("tableColumns.address.label"),
    },
    {
      key: "actions",
      label: t("tableColumns.actions.label"),
    },
  ];

  const handleDelete = async () => {
    try {
      await deleteAddress({ id: currentRowData.id });
      setModalType(null);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    }
  };

  const renderCell = (rows: any, columnKey: any) => {
    const cellValue = rows[columnKey];

    if (columnKey === "actions") {
      return (
        <div className="relative flex items-center gap-2">
          <Button
            color="primary"
            radius="none"
            size="sm"
            onPress={() => {
              setCurrentRowData(rows);
              setModalType("edit");
            }}
          >
            {t("edit")}
          </Button>
          <Button
            className="button-default"
            radius="none"
            size="sm"
            onPress={() => {
              setCurrentRowData(rows);
              setModalType("delete");
            }}
          >
            {t("delete")}
          </Button>
        </div>
      );
    }

    return cellValue;
  };

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <Button
        color="primary"
        radius="none"
        size="sm"
        onPress={() => {
          setModalType("add");
        }}
      >
        {t("add")}
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
        <TableBody emptyContent={t("tableEmpty")} items={data}>
          {(item: any) => (
            <TableRow key={item?.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddressModal
        defaultData={currentRowData}
        isOpen={modalType === "add" || modalType === "edit"}
        type={modalType === "add" ? "add" : "edit"}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />

      <ConfirmModal
        content={t("deleteConfirm")}
        isOpen={modalType === "delete"}
        onConfirm={async () => {
          await handleDelete();
        }}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />
    </>
  );
}
