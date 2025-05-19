"use client";
import type { FieldConfig } from "@/components/dynamic-form-modal";

import React, { useState } from "react";
import {
  Avatar,
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
  Divider,
  Chip,
  AutocompleteItem,
  Autocomplete,
  DatePicker,
} from "@heroui/react";

import DynamicFormModal from "@/components/dynamic-form-modal";
import UserBalanceCard from "@/components/wallet-card";
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
const countrys = [
  {
    label: "Argentina",
    key: "Argentina",
    src: "https://flagcdn.com/ar.svg",
  },
  {
    label: "Venezuela",
    key: "Venezuela",
    src: "https://flagcdn.com/ve.svg",
  },
  {
    label: "Brazil",
    key: "Brazil",
    src: "https://flagcdn.com/ve.svg",
  },
  {
    label: "Switzerland",
    key: "Switzerland",
    src: "https://flagcdn.com/ch.svg",
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
const fieldsaddress: FieldConfig[] = [
  {
    type: "input",
    name: "name",
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
    type: "select",
    name: "country",
    label: "国家",
    placeholder: "选择国家",
    options: [
      {
        label: "Argentina",
        value: "Argentina",
        icon: "https://flagcdn.com/ar.svg",
      },
      {
        label: "Venezuela",
        value: "Venezuela",
        icon: "https://flagcdn.com/ve.svg",
      },
      {
        label: "Brazil",
        value: "Brazil",
        icon: "https://flagcdn.com/ve.svg",
      },
      {
        label: "Switzerland",
        value: "Switzerland",
        icon: "https://flagcdn.com/ch.svg",
      },
    ],
  },
  {
    type: "select",
    name: "country1",
    label: "省份/州",
    placeholder: "选择省份/州",
    options: [
      {
        label: "Argentina",
        value: "Argentina",
        icon: "https://flagcdn.com/ar.svg",
      },
      {
        label: "Venezuela",
        value: "Venezuela",
        icon: "https://flagcdn.com/ve.svg",
      },
      {
        label: "Brazil",
        value: "Brazil",
        icon: "https://flagcdn.com/ve.svg",
      },
      {
        label: "Switzerland",
        value: "Switzerland",
        icon: "https://flagcdn.com/ch.svg",
      },
    ],
  },
  {
    type: "input",
    name: "phone1",
    label: "详细地址",
    placeholder: "请输入您详细地址",
  },
  {
    type: "input",
    name: "phone2",
    label: "邮编",
    placeholder: "请输入邮编",
  },
  {
    type: "checkbox",
    name: "isDefault",
    label: "设为默认地址",
  },
];
const fieldspwd: FieldConfig[] = [
  {
    type: "input",
    name: "name123",
    label: "原密码",
    placeholder: "请输入原密码",
  },
  {
    type: "input",
    name: "phone123123",
    label: "新密码",
    placeholder: "请输入新密码",
  },
  {
    type: "input",
    name: "phone123",
    label: "确认新密码",
    placeholder: "请确认新密码",
  },
];

export default function DashBoard() {
  // const [action, setAction] = React.useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  // 表单数据状态
  const [formData, setFormData] = useState<Record<string, any>>({
    name: "",
    phone: "",
    country: "",
    province: "",
    address: "",
    zipCode: "",
    isDefault: false,
  });
  const [formDatapwd, setFormDatapwd] = useState<Record<string, any>>({
    name: "",
    phone: "",
    country: "",
    province: "",
    address: "",
    zipCode: "",
    isDefault: false,
  });

  // 保存时处理
  const handleSave = (data: Record<string, any>) => {
    console.log("表单数据:", data);
    // 你可以在这里做提交接口等操作
  };
  // 保存时处理
  const handleSave1 = (data: Record<string, any>) => {
    console.log("表单数据:", data);
    // 你可以在这里做提交接口等操作
  };
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const renderCell = React.useCallback((rows: any, columnKey: any) => {
    const cellValue = rows[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button color="primary" size="sm" onPress={() => setIsOpen(true)}>
              编辑
            </Button>
            <Button className="button-default" size="sm">
              删除
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className=" flex flex-col gap-6 bg-[#f8f8f8] -mx-5">
      <UserBalanceCard balanceCNY="52,999.68" balanceUSD="66.55">
        <Avatar
          className="w-20 h-20 text-large"
          src="https://ww2.sinaimg.cn/mw690/006faMndly1htwlunnhn5j30zj0zjjv8.jpg"
        />
        <div className="flex-1">
          <p className="text-title-2xl">Bryant</p>
          <p>ID:CNF3582377174494</p>
          <Chip color="primary" size="sm">
            VIP1
          </Chip>
        </div>
      </UserBalanceCard>
      <div className="bg-[#fff] rounded-lg flex-1">
        <div className="flex w-full flex-col px-5">
          <Tabs
            aria-label="Options"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0  ",
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
              <div className="font-bold mb-4">修改用户信息</div>

              <div className=" flex justify-center">
                <Form
                  className="w-full  flex flex-col gap-4"
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
                    name="username"
                    placeholder="Enter your username"
                    type="text"
                    value="Bryant"
                    variant="bordered"
                  />
                  <Input
                    classNames={{
                      inputWrapper: "data-[focus=true]:!border-[#f0700c]",
                    }}
                    label="电话"
                    name="email"
                    placeholder="Enter your phone"
                    type="number"
                    value="123456789"
                    variant="bordered"
                  />
                  <DatePicker
                    classNames={{
                      inputWrapper: "focus-within:!border-[#f0700c]",
                    }}
                    label="生日"
                    variant="bordered"
                  />
                  <Autocomplete
                    defaultItems={countrys}
                    label="国家"
                    name="country"
                    variant="bordered"
                  >
                    {(country) => (
                      <AutocompleteItem
                        key={country.key}
                        startContent={
                          <Avatar
                            alt="Argentina"
                            className="w-6 h-6"
                            src={country.src}
                          />
                        }
                      >
                        {country.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                  <div className="flex gap-2">
                    <Button className="flex-1" color="primary" type="submit">
                      保存
                    </Button>
                    <Button
                      className="flex-1 button-default"
                      type="reset"
                      variant="flat"
                    >
                      重置
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
              <Button color="primary" size="sm" onPress={() => setIsOpen(true)}>
                + 添加地址
              </Button>
              <Spacer y={2} />
              <Table
                removeWrapper
                aria-label="Example table with dynamic content"
                classNames={{
                  th: [
                    "bg-transparent",
                    "text-default-500",
                    "border-b",
                    "border-divider",
                  ],
                }}
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
              <DynamicFormModal
                fields={fieldsaddress}
                formData={formData}
                isOpen={isOpen}
                title="添加地址"
                onChange={setFormData}
                onOpenChange={setIsOpen}
                onSave={handleSave}
              />
            </Tab>
            <Tab
              key="videos"
              title={
                <div className="flex items-center space-x-2">
                  <span>账号安全</span>
                </div>
              }
            >
              <div className="flex justify-between  items-center">
                <div>
                  <p className="font-bold text-base">登录密码</p>
                  <p className="text-sm my-1">
                    安全性高的密码可以使账号更安全。建议您定期更换密码，且设置一个包含数字和字母，并长度超过6位以上的密码。
                  </p>
                </div>
                <div>
                  <Button color="primary" onPress={() => setIsOpen1(true)}>
                    修改密码
                  </Button>
                </div>
                <DynamicFormModal
                  fields={fieldspwd}
                  formData={formDatapwd}
                  isOpen={isOpen1}
                  title="修改密码"
                  onChange={setFormDatapwd}
                  onOpenChange={setIsOpen1}
                  onSave={handleSave1}
                />
              </div>
              <Divider className="my-4" />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
