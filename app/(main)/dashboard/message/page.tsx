"use client";
import {
  Button,
  Checkbox,
  Spinner,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";
import PaginationBar from "@/components/common/pagination-bar";
import { getMessageList, readMessage, delMessage } from "@/services";

type TabKey = "all" | "read" | "unread";

export default function MessagePage() {
  const t = useTranslations("Dashboard.MessagePage");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [rows, setRows] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<any>>(new Set());
  const [loading, setLoading] = useState(false);
  const [currentContent, setCurrentContent] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const columns = [
    { key: "title", label: t("title") },
    { key: "createTime", label: t("time") },
    { key: "statusCode", label: "" },
    { key: "actions", label: t("actions") },
  ];

  // 获取消息列表
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params: any = { deleteFlag: 1 }; // 默认只查正常的消息

      if (activeTab === "read") params.statusCode = 1;
      if (activeTab === "unread") params.statusCode = 0;

      const query = new URLSearchParams(params).toString();
      const res = await getMessageList(
        `?${query}&current=${page}&size=${pageSize}`,
      );

      if (Array.isArray(res.records)) {
        setRows(res.records.map((msg: any) => ({ ...msg })));
      } else {
        setRows([]);
      }
      setSelectedKeys(new Set()); // Tab 切换清空选中
    } catch (err) {
      console.error("Failed to load messages:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, activeTab]);
  useEffect(() => {
    fetchMessages();
  }, [page, pageSize]);

  // 渲染表格单元格
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
              onPress={async () => {
                setCurrentContent(item.content);
                onOpen();

                if (item.statusCode === 0) {
                  try {
                    await readMessage(item.id);
                    fetchMessages();
                  } catch (err) {
                    console.error("Failed to mark message as read:", err);
                  }
                }
              }}
            >
              {t("viewDetail")}
            </Button>
          );

        default:
          return item[columnKey];
      }
    },
    [onOpen, t],
  );

  const allSelected = rows.length > 0 && selectedKeys.size === rows.length;

  // 切换全选/取消全选
  const toggleAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(rows.map((row) => row.key)));
    }
  };

  // 批量删除
  const handleDelete = async () => {
    if (selectedKeys.size === 0) return;
    try {
      await delMessage(Array.from(selectedKeys));
      fetchMessages();
    } catch (err) {
      console.error("Failed to delete messages:", err);
    }
  };

  return (
    <div className="flex w-full flex-col">
      {/* Tab 标签 */}
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
          setPage(1); // ✅ 切换 Tab 时重置分页
          console.log("切换");

          fetchMessages();
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

      {/* Tab 内容 */}
      <div className="flex-1 mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Spinner color="primary" size="lg" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            {t("noMessages")}
          </div>
        ) : (
          <Table
            hideHeader
            aria-label="Message table"
            bottomContent={
              <div className="flex items-center justify-between">
                <div className="p-3 flex items-center gap-3">
                  <Checkbox
                    className="flex-1"
                    isIndeterminate={
                      selectedKeys.size > 0 && selectedKeys.size < rows.length
                    }
                    isSelected={allSelected}
                    onChange={toggleAll}
                  >
                    {t("selectAll")}
                  </Checkbox>
                  <Button
                    className="bg-transparent text-[#f0700c]"
                    onPress={handleDelete}
                  >
                    {t("delete")}
                  </Button>
                </div>
                <div className="flex-1">
                  <PaginationBar
                    page={page}
                    pageSize={pageSize}
                    total={rows.length}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                  />
                </div>
              </div>
            }
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            onSelectionChange={(keys: any) => setSelectedKeys(keys)}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey: any) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <CommonModal
          isOpen={isOpen}
          title={t("modalTitle")}
          onOpenChange={onOpenChange}
        >
          <div className="max-h-[60vh] overflow-auto px-4 py-2 scrollbar-hide">
            <p>{currentContent}</p>
          </div>
        </CommonModal>
      </div>
    </div>
  );
}
