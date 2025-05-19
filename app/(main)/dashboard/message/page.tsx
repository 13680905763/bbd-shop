"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
import React from "react";

const rows = [
  {
    key: "1",
    name: "Your Product Coupon is About to Expire – Use It Now!",
    role: "2025-05-03 00:00:02",
  },
  {
    key: "2",
    name: "Your Shipping Coupon is About to Expire",
    role: "2025-05-03 00:00:02",
  },
  {
    key: "3",
    name: "Your Shipping Coupon is About to Expire",
    role: "2025-05-03 00:00:02",
  },
];
const columns = [
  {
    key: "name",
    label: "收货人",
  },
  {
    key: "role",
    label: "电话",
  },

  {
    key: "actions",
    label: "操作",
  },
];

export default function MessagePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const renderCell = React.useCallback((rows: any, columnKey: any) => {
    const cellValue = rows[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button className="button-default" size="sm" onPress={onOpen}>
              查看详情
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 ",
          cursor: "w-full bg-[#f0700c]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#f0700c]",
        }}
        color="primary"
        variant="underlined"
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <span>全部消息</span>
            </div>
          }
        >
          <div>
            <Table
              hideHeader
              isStriped
              removeWrapper
              aria-label="Example table with dynamic content"
              classNames={{
                tr: "border-b border-[#ccc] ",
              }}
              // selectionMode="multiple"
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
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      留言信息
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam pulvinar risus non risus hendrerit venenatis.
                        Pellentesque sit amet hendrerit risus, sed porttitor
                        quam.
                      </p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam pulvinar risus non risus hendrerit venenatis.
                        Pellentesque sit amet hendrerit risus, sed porttitor
                        quam.
                      </p>
                      <p>
                        Magna exercitation reprehenderit magna aute tempor
                        cupidatat consequat elit dolor adipisicing. Mollit dolor
                        eiusmod sunt ex incididunt cillum quis. Velit duis sit
                        officia eiusmod Lorem aliqua enim laboris do dolor
                        eiusmod. Et mollit incididunt nisi consectetur esse
                        laborum eiusmod pariatur proident Lorem eiusmod et.
                        Culpa deserunt nostrud ad veniam.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="button-default"
                        size="sm"
                        variant="light"
                        onPress={onClose}
                      >
                        Close
                      </Button>
                      <Button color="primary" size="sm" onPress={onClose}>
                        Action
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>已读</span>
            </div>
          }
        >
          312
        </Tab>
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <span>未读</span>
            </div>
          }
        >
          31231
        </Tab>
      </Tabs>
    </div>
  );
}
