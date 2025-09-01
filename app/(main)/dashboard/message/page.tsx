"use client";
import {
  Button,
  Checkbox,
  Spinner,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import React, { useEffect, useState } from "react";

import CommonModal from "@/components/modal/common-modal";
import PaginationBar from "@/components/common/pagination-bar";
import { getMessageList } from "@/services";

const columns = [
  { key: "title", label: "标题" },
  { key: "createTime", label: "时间" },
  { key: "actions", label: "操作" },
];

export default function MessagePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentContent, setCurrentContent] = useState(""); // 当前 Modal 内容

  const renderCell = React.useCallback(
    (item: any, columnKey: any) => {
      switch (columnKey) {
        case "actions":
          return (
            <Button
              color="primary"
              size="sm"
              onPress={() => {
                setCurrentContent(item.content);
                onOpen();
              }}
            >
              查看详情
            </Button>
          );
        default:
          return item[columnKey];
      }
    },
    [onOpen],
  );

  const allSelected = rows.length > 0 && selectedKeys.length === rows.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(rows.map((row) => row.key));
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await getMessageList();

        if (Array.isArray(res.records)) {
          setRows(
            res.records.map((message: any) => ({
              key: message.id,
              title: message.title,
              createTime: message.createTime,
              content: message.content,
            })),
          );
        } else {
          setRows([]);
        }
      } catch (error) {
        console.error("加载消息失败:", error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [page]);

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
        variant="underlined"
      >
        <Tab key="photos" title={<span>全部消息</span>}>
          <div>
            {loading ? (
              <div className="flex justify-center items-center h-[50vh]">
                <Spinner color="primary" size="lg" />
              </div>
            ) : rows.length === 0 ? (
              <div className="text-center text-gray-500 py-10">暂无消息</div>
            ) : (
              <Table
                hideHeader
                aria-label="消息表格"
                bottomContent={
                  <div className="flex items-center justify-between w-full">
                    <div className="p-3 flex items-center gap-3">
                      <Checkbox
                        className="flex-1"
                        isIndeterminate={
                          selectedKeys.length > 0 &&
                          selectedKeys.length < rows.length
                        }
                        isSelected={allSelected}
                        onChange={toggleAll}
                      >
                        全选
                      </Checkbox>
                      <Button
                        className="bg-transparent text-[#f0700c]"
                        onPress={() => {
                          const remaining = rows.filter(
                            (row) => !selectedKeys.includes(row.key),
                          );

                          setRows(remaining);
                          setSelectedKeys([]);
                        }}
                      >
                        删除
                      </Button>
                    </div>
                    <div className="flex-1">
                      <PaginationBar
                        page={page}
                        pageSize={20}
                        total={rows.length} // 根据实际接口 total 调整
                        onPageChange={setPage}
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
                      {(columnKey) => (
                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            <CommonModal
              isOpen={isOpen}
              title="查看详情"
              onOpenChange={onOpenChange}
            >
              <div className="max-h-[60vh] overflow-auto px-4 py-2 scrollbar-hide">
                <p>{currentContent}</p>
              </div>
            </CommonModal>
          </div>
        </Tab>

        <Tab key="music" title={<span>已读</span>}>
          {/* 这里可以放已读消息列表 */}
          暂无数据
        </Tab>

        <Tab key="videos" title={<span>未读</span>}>
          {/* 这里可以放未读消息列表 */}
          暂无数据
        </Tab>
      </Tabs>
    </div>
  );
}
