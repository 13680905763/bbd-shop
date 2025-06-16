"use client";

import { Button, Divider } from "@heroui/react";
import { useState } from "react";

import FormModal from "@/components/modal/form-modal";
import { FieldConfig } from "@/components/form/formItem-renderer";
const SecurityFields: FieldConfig[] = [
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

export function SecurityTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const handleSave = async () => {
    console.log("修改密码");
  };

  return (
    <>
      <div className="flex justify-between  items-center">
        <div>
          <p className="text-title">登录密码</p>
          <p className="text-sm my-1">
            安全性高的密码可以使账号更安全。建议您定期更换密码，且设置一个包含数字和字母，并长度超过6位以上的密码。
          </p>
        </div>
        <div>
          <Button color="primary" onPress={() => setIsOpen(true)}>
            修改密码
          </Button>
        </div>
      </div>
      <Divider className="my-4" />
      <FormModal
        fields={SecurityFields}
        formData={formData}
        isOpen={isOpen}
        title={"修改密码"}
        onChange={setFormData}
        onOpenChange={setIsOpen}
        onSave={handleSave}
      />
    </>
  );
}
