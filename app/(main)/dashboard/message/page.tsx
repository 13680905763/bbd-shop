"use client";
import {
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";

import PaginationBar from "@/components/common/pagination-bar";
import { useMessageList, useMessageMutations } from "@/hook";
import { useSelection } from "@/hook/common";
import { useConfirm } from "@/components/common/modal/confirm-provider";
import { BlockSpinner, EmptyState, FullscreenLoader } from "@/components/ui";

type TabKey = "all" | "read" | "unread";

export default function MessagePage() {
  const t = useTranslations("dashboard.message");
  const { confirm } = useConfirm();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const statusCode =
    activeTab === "read" ? 1 : activeTab === "unread" ? 0 : undefined;

  const { data, isLoading, isFetching } = useMessageList({
    page,
    pageSize,
    statusCode,
  });
  const { readMutation, deleteMutation } = useMessageMutations();
  const records = Array.isArray(data?.records) ? data.records : [];
  const total = data?.total || 0;

  const {
    selectedIds,
    onSelect,
    onSelectAll,
    onClearAll,
    isAllSelected,
    hasSelected,
    onToggleSelectAll,
    setSelection,
  } = useSelection(records, {
    idKey: "id",
  });

  useEffect(() => {
    onClearAll();
  }, [page, activeTab, onClearAll]);

  const columns = [
    { key: "title", label: t("title") },
    { key: "createTime", label: t("time") },
    { key: "statusCode", label: t("status") },
    { key: "actions", label: t("actions") },
  ];

  const handleViewDetail = async (item: any) => {
    await confirm({
      title: t("modalTitle"),
      content: item.content,
      onConfirm: async () => {
        await readMutation.mutateAsync(item.id);
      },
    });
  };
  const handleDelete = async () => {
    await confirm({
      title: t("delete"),
      content: t("confirmDeleteContent"),
      onConfirm: async () => {
        await deleteMutation.mutateAsync(Array.from(selectedIds) as number[]);
      },
    });
  };
  const renderCell = useCallback(
    (item: any, columnKey: string) => {
      switch (columnKey) {
        case "statusCode":
          return item.statusCode === 0 ? (
            <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
          ) : (
            <span className="text-green-500 font-bold">✔</span>
          );
        case "actions":
          return (
            <Button
              color="primary"
              size="sm"
              onPress={() => handleViewDetail(item)}
            >
              {t("viewDetail")}
            </Button>
          );
        case "title":
          return (
            <span className="font-semibold text-gray-800">
              {item.title || t("noTitle")}
            </span>
          );
        case "createTime":
          return (
            <span className="text-gray-500 text-sm">
              {item.createTime || t("noTime")}
            </span>
          );
        default:
          return item[columnKey];
      }
    },
    [t, handleViewDetail],
  );

  if (isLoading) return <FullscreenLoader />;

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0",
          cursor: "w-full bg-[#f0700c]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#f0700c]",
        }}
        color="primary"
        selectedKey={activeTab}
        variant="underlined"
        onSelectionChange={(key: any) => {
          setActiveTab(key);
          setPage(1);
        }}
      >
        <Tab key="all" title={<span>{t("allMessages")}</span>} value="all" />
        <Tab key="read" title={<span>{t("readMessages")}</span>} value="read" />
        <Tab
          key="unread"
          title={<span>{t("unreadMessages")}</span>}
          value="unread"
        />
      </Tabs>

      <div className="flex-1 mt-4">
        {/* {isFetching ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Spinner color="primary" size="lg" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            {t("noMessages")}
          </div>
        ) : ( */}
        <Table
          className="relative"
          // classNames={{
          //   table: "min-h-[60vh]",
          // }}

          aria-label="Message table"
          bottomContent={
            <div className="flex items-center justify-between">
              <div className="">
                {/* <Checkbox
                    isIndeterminate={hasSelected && !isAllSelected}
                    isSelected={isAllSelected}
                    onValueChange={onToggleSelectAll}
                  >
                    {t("selectAll")}
                  </Checkbox> */}
                <Button
                  className="text-[#f0700c]"
                  isDisabled={!hasSelected}
                  variant="light"
                  size="sm"
                  onPress={handleDelete}
                >
                  {t("delete")}
                </Button>
              </div>
              <div className="flex-1">
                <PaginationBar
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            </div>
          }
          selectedKeys={new Set(selectedIds)}
          selectionMode="multiple"
          onSelectionChange={(keys) => {
            if (keys === "all") {
              onSelectAll();
            } else {
              // keys 是 Set<Key>
              setSelection(Array.from(keys));
            }
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={<EmptyState className="!h-auto" />}
            isLoading={isFetching}
            items={records}
            loadingContent={<BlockSpinner />}
          >
            {(item: any) => (
              <TableRow key={item.id}>
                {(columnKey: any) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* )} */}
      </div>
    </div>
  );
}
