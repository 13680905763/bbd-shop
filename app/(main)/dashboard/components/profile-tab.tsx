"use client";

import { useState } from "react";

import { FieldConfig } from "@/components/form/formItem-renderer";
import CommonForm from "@/components/form/common-form";
const profileFields: FieldConfig[] = [
  {
    type: "input",
    name: "name",
    label: "用户名",
  },
  {
    type: "input",
    name: "mobile",
    label: "手机号码",
  },
  { type: "date", name: "birthday", label: "生日" },
  {
    type: "input",
    name: "email",
    label: "电子邮件",
  },
  // {
  //   type: "select",
  //   name: "country",
  //   label: "国家",
  //   placeholder: "选择国家",
  //   options: [
  //     {
  //       label: "Argentina",
  //       value: "Argentina",
  //       icon: "https://flagcdn.com/ar.svg",
  //     },
  //     {
  //       label: "Venezuela",
  //       value: "Venezuela",
  //       icon: "https://flagcdn.com/ve.svg",
  //     },
  //     {
  //       label: "Brazil",
  //       value: "Brazil",
  //       icon: "https://flagcdn.com/ve.svg",
  //     },
  //     {
  //       label: "Switzerland",
  //       value: "Switzerland",
  //       icon: "https://flagcdn.com/ch.svg",
  //     },
  //   ],
  // },
];

export default function ProfileTab({ defaultformData }: any) {
  const [formData, setFormData] = useState(defaultformData);

  return (
    <>
      <div className="text-xl font-semibold text-title mb-4">修改用户信息</div>
      <div className="flex justify-center">
        <CommonForm
          fields={profileFields}
          formData={formData}
          onChange={setFormData}
        />
      </div>
    </>
  );
}
