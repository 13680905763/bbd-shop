"use client";
import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import { useTranslations } from "next-intl";

import { loginCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { LoginFormData } from "@/types";
import { handleAuthSuccess } from "@/lib/auth-handler";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("LoginPage");

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const loginFormFields: FieldConfig[] = [
    {
      key: "email",
      type: "input",
      name: "email",
      size: "lg",
      placeholder: t("fields.email.placeholder"),
      startContent: <IoPerson />,
    },
    {
      key: "password",
      type: "input",
      name: "password",
      size: "lg",
      placeholder: t("fields.password.placeholder"),
      startContent: <IoLockClosed />,
    },
  ];

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await loginCustomer(data);
      await handleAuthSuccess();
      router.push("/");
    } catch {
      // 可以加 toast 提示
    } finally {
      setIsLoading(false);
    }
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
        isLoading={isLoading}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
      <div className="flex justify-between my-2 text-[#f0700c]">
        <NextLink href="/forgetPsd">
          <div>{t("links.forgetPassword")}</div>
        </NextLink>
        <button onClick={() => router.push("/register")}>
          {t("links.register")}
        </button>
      </div>
    </>
  );
}
