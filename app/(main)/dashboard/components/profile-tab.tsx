"use client";

import { useState } from "react";

import { FieldConfig } from "@/components/form/formItem-renderer";
import CommonForm from "@/components/form/common-form";
import { getUserInfo, updateUserInfo } from "@/services";
import { useUserStore } from "@/store";
const profileFields: FieldConfig[] = [
  {
    type: "input",
    name: "name",
    label: "用户名",
  },
  {
    type: "input",
    name: "familyName",
    label: "姓",
  },
  {
    type: "input",
    name: "givenName",
    label: "名",
  },

  {
    type: "input",
    name: "mobile",
    label: "手机号码",
  },
  // { type: "date", name: "birthday", label: "生日" },
  // {
  //   type: "input",
  //   name: "email",
  //   label: "电子邮件",
  // },
];

export default function ProfileTab({ defaultformData }: any) {
  console.log("defaultformData", defaultformData);

  const [formData, setFormData] = useState({
    id: defaultformData.id,
    name: defaultformData.name || "",
    familyName: defaultformData.familyName || "",
    givenName: defaultformData.givenName || "",
    mobile: defaultformData.mobile || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await updateUserInfo(data);
    } catch {
    } finally {
      setIsLoading(false);
      const user = await getUserInfo();

      useUserStore.getState().setUser(user);
    }
  };

  return (
    <>
      <div className="text-xl font-semibold text-title mb-4">修改用户信息</div>
      <div className="flex justify-center">
        <CommonForm
          fields={profileFields}
          formData={formData}
          isLoading={isLoading}
          onChange={setFormData}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
