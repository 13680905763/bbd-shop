"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import { useTranslations } from "next-intl";

import { loginCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { LoginFormData } from "@/types";
import { queryClient } from "@/lib/react-query";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth.login");

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const loginFormFields: FieldConfig[] = [
    {
      type: "input",
      name: "email",
      size: "lg",
      required: true,
      errorMessage: t("fields.email.errorMessage"),
      placeholder: t("fields.email.placeholder"),
      startContent: <IoPerson />,
    },
    {
      type: "password",
      name: "password",
      required: true,
      size: "lg",
      errorMessage: t("fields.password.errorMessage"),
      placeholder: t("fields.password.placeholder"),
      startContent: <IoLockClosed />,
    },
  ];

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await loginCustomer(data);
      queryClient.invalidateQueries({ queryKey: ["userInfo"] }); // 刷新
      router.push("/");
    } catch { }
  };

  return (
    <>
      <div className="text-3xl text-default-600 font-semibold mb-4">
        {t("title")}
      </div>
      <CommonForm
        confirmText={t("confirmText")}
        fields={loginFormFields}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
      <div className="flex justify-between my-2 text-[#f0700c]">
        <button onClick={() => router.push("/forgetPsd")}>
          <div>{t("forgetPassword")}</div>
        </button>
        <div />
        <button onClick={() => router.push("/register")}>
          {t("register")}
        </button>
      </div>
    </>
  );
}
