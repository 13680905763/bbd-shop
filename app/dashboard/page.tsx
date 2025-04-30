"use client";
import React from "react";
import { Avatar } from "@heroui/avatar";
import {
  Tabs,
  Tab,
  Form,
  Input,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spacer,
  Tooltip,
  Divider,
} from "@heroui/react";

import { EditIcon, DeleteIcon } from "@/components/icons";

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
    label: "收货人",
  },
  {
    key: "role",
    label: "电话",
  },
  {
    key: "status",
    label: "详情地址",
  },
  {
    key: "actions",
    label: "操作",
  },
];

export default function DashBoard() {
  // const [action, setAction] = React.useState(null);

  const renderCell = React.useCallback((rows: any, columnKey: any) => {
    const cellValue = rows[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="h-[100%] flex flex-col gap-6 bg-[#f5f5f5] -m-5">
      <div className="flex gap-6">
        <div className="flex-1 px-14 py-5 flex  items-center bg-[#fff] rounded-lg gap-6">
          <div>
            <Avatar
              className="w-20 h-20 text-large"
              src="https://ww2.sinaimg.cn/mw690/006faMndly1htwlunnhn5j30zj0zjjv8.jpg"
            />
          </div>
          <div className="flex-1 text-[12px] text-[#555353]">
            <p className="text-[16px] text-[#000]">Bryant</p>
            <p>177748749@qq.com</p>
            <p>ID:CNF3582377174494</p>
          </div>
        </div>
        <div className="flex-1 px-14 py-5 flex flex-col  bg-[#fff] rounded-lg gap-6">
          <div className="flex-1 flex justify-between gap-10 items-center">
            <div>余额</div>
            <div> ￥999</div>
            {/* <div className="flex-1 gap-2 flex">
              <Button className="bg-[#f0700c] text-[#fff] flex-1" radius="lg">
                充值
              </Button>
              <Button className="flex-1" radius="lg">
                提现
              </Button>
            </div> */}
          </div>
          <div className="flex-1 flex gap-10">
            <div>积分</div>
            <div>88</div>
          </div>
        </div>
      </div>
      <div className="bg-[#fff] rounded-lg flex-1">
        <div className="flex w-full flex-col px-5">
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
                  <span>个人信息</span>
                </div>
              }
            >
              <p className="font-bold text-sm">修改用户信息</p>

              <div className="p-5 pt-0  flex justify-center">
                <Form
                  className="w-full max-w-[800px] flex flex-col gap-4"
                  // onReset={() => setAction("reset")}
                  onSubmit={(e) => {
                    e.preventDefault();
                    let data = Object.fromEntries(
                      new FormData(e.currentTarget),
                    );

                    console.log(data);
                  }}
                >
                  <Input
                    isRequired
                    errorMessage="Please enter a valid username"
                    label="用户名"
                    labelPlacement="outside"
                    name="username"
                    placeholder="Enter your username"
                    type="text"
                  />

                  <Input
                    isRequired
                    errorMessage="Please enter a valid email"
                    label="电话"
                    labelPlacement="outside"
                    name="email"
                    placeholder="Enter your email"
                    type="text"
                  />
                  <Input
                    isRequired
                    errorMessage="Please enter a valid email"
                    label="生日"
                    labelPlacement="outside"
                    name="email"
                    placeholder="Enter your email"
                    type="text"
                  />
                  <Input
                    isRequired
                    errorMessage="Please enter a valid email"
                    label="国家"
                    labelPlacement="outside"
                    name="email"
                    placeholder="Enter your email"
                    type="text"
                  />
                  <div className="flex gap-2">
                    <Button className="flex-1" color="primary" type="submit">
                      Submit
                    </Button>
                    <Button className="flex-1" type="reset" variant="flat">
                      Reset
                    </Button>
                  </div>
                </Form>
              </div>
            </Tab>
            <Tab
              key="music"
              title={
                <div className="flex items-center space-x-2">
                  <span>收货地址</span>
                </div>
              }
            >
              <Button
                className="bg-[#f0700c] text-[#fff] "
                endContent={"icon"}
                size="sm"
              >
                添加地址
              </Button>
              <Spacer y={4} />
              <Table
                removeWrapper
                aria-label="Example table with dynamic content"
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
            </Tab>
            <Tab
              key="videos"
              title={
                <div className="flex items-center space-x-2">
                  <span>账号安全</span>
                </div>
              }
            >
              <div className="flex justify-between p-2 items-center">
                <div>
                  <p className="font-bold text-base">登录密码</p>
                  <p className="text-sm my-2">
                    安全性高的密码可以使账号更安全。建议您定期更换密码，且设置一个包含数字和字母，并长度超过6位以上的密码。
                  </p>
                </div>
                <div>
                  <Button>修改密码</Button>
                </div>
              </div>
              <Divider className="my-4" />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
