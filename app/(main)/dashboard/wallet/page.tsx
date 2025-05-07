"use client";
import {
  Avatar,
  Button,
  getKeyValue,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@heroui/react";
import React from "react";

import { price } from "@/components/primitives";
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

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "role",
    label: "ROLE",
  },
  {
    key: "status",
    label: "STATUS",
  },
];

export default function WalletPage() {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
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
              <span>余额</span>
            </div>
          }
        >
          <div className="w-full p-5 rounded-lg bg-[#f0700c] flex justify-between items-center">
            <div>
              <div>余额</div>
              <div className={price({ color: "white", size: "xl2" })}>
                $ 999
              </div>
            </div>
            <div className="flex gap-2">
              <Button color="primary">提现</Button>
              <Button color="primary">充值</Button>
            </div>
          </div>
          <Tabs
            aria-label="Options"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 ",
              cursor: "w-full bg-transparent",
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
                  <span>余额流水</span>
                </div>
              }
            >
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
            </Tab>
            <Tab
              key="music"
              title={
                <div className="flex items-center space-x-2">
                  <span>充值流水</span>
                </div>
              }
            >
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
            </Tab>
          </Tabs>
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>积分</span>
            </div>
          }
        >
          <div className="w-full p-5 rounded-lg bg-[#f0700c] ">
            <div>
              <div>积分</div>
              <div className={price({ color: "white", size: "xl2" })}>
                $ 999
              </div>
            </div>
          </div>

          <Tabs
            aria-label="Options"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 ",
              cursor: "w-full bg-transparent",
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
                  <span>积分流水</span>
                </div>
              }
            >
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
            </Tab>
            <Tab
              key="music"
              title={
                <div className="flex items-center space-x-2">
                  <span>积分兑换</span>
                </div>
              }
            >
              <div className="w-full p-5 rounded-lg bg-[#f5f5f5] flex justify-between items-center mb-4">
                <div className="flex gap-6">
                  <div>
                    <Avatar
                      className="w-20 h-20 text-large"
                      src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
                    />
                  </div>
                  <div>
                    <div className={price({ size: "xl2" })}>CAD 999</div>
                    <div>所需积分</div>
                    <div>需要会员等级</div>
                  </div>
                </div>
                <div>
                  <Button color="primary">兑换</Button>
                </div>
              </div>
              <div className="w-full p-5 rounded-lg bg-[#f5f5f5] flex justify-between items-center">
                <div className="flex gap-6">
                  <div>
                    <Avatar
                      className="w-20 h-20 text-large"
                      src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
                    />
                  </div>
                  <div>
                    <div className={price({ size: "xl2" })}>CAD 889</div>
                    <div>所需积分</div>
                    <div>需要会员等级</div>
                  </div>
                </div>
                <div>
                  <Button color="primary">兑换</Button>
                </div>
              </div>
            </Tab>
          </Tabs>
        </Tab>
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <span>优惠券</span>
            </div>
          }
        >
          <Tabs
            aria-label="Options"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 ",
              cursor: "w-full bg-transparent",
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
                  <span>可用优惠券</span>
                </div>
              }
            >
              <div className="w-full p-5 rounded-lg bg-[#f5f5f5] flex justify-between items-center">
                <div className="flex gap-6">
                  <div>
                    <Avatar
                      className="w-20 h-20 text-large"
                      src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
                    />
                  </div>
                  <div>
                    <div className={price({ size: "xl2" })}>CAD 88449</div>
                    <div>所需积分</div>
                    <div>需要会员等级</div>
                  </div>
                </div>
                <div>未使用</div>
              </div>
            </Tab>
            <Tab
              key="music"
              title={
                <div className="flex items-center space-x-2">
                  <span>已使用优惠券</span>
                </div>
              }
            >
              <div className="w-full p-5 rounded-lg bg-[#f5f5f5] flex justify-between items-center">
                <div className="flex gap-6">
                  <div>
                    <Avatar
                      className="w-20 h-20 text-large"
                      src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
                    />
                  </div>
                  <div>
                    <div className={price({ size: "xl2" })}>CAD 889</div>
                    <div>所需积分</div>
                    <div>需要会员等级</div>
                  </div>
                </div>
                <div>已使用</div>
              </div>
            </Tab>
            <Tab
              key="music1"
              title={
                <div className="flex items-center space-x-2">
                  <span>已过期优惠券</span>
                </div>
              }
            >
              <div className="w-full p-5 rounded-lg bg-[#f5f5f5] flex justify-between items-center">
                <div className="flex gap-6">
                  <div>
                    <Avatar
                      className="w-20 h-20 text-large"
                      src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
                    />
                  </div>
                  <div>
                    <div className={price({ size: "xl2" })}>CAD 4449</div>
                    <div>所需积分</div>
                    <div>需要会员等级</div>
                  </div>
                </div>
                <div>已过期</div>
              </div>
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>
    </div>
  );
}
