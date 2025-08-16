"use client";
import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoLockClosed, IoPerson } from "react-icons/io5";

import { loginCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { LoginFormData } from "@/types";
import { handleAuthSuccess } from "@/lib/auth-handler";
const loginFormFields: FieldConfig[] = [
  {
    type: "input",
    name: "email",
    size: "lg",
    placeholder: "Enter your email",
    startContent: <IoPerson />,
  },
  {
    type: "input",
    name: "password",
    size: "lg",

    placeholder: "password",
    startContent: <IoLockClosed />,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await loginCustomer(data);
      await handleAuthSuccess();
      router.push("/");
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-3xl text-default-600 font-semibold mb-4">
        欢迎回来
      </div>
      <CommonForm
        confirmText="登录"
        fields={loginFormFields}
        formData={formData}
        isLoading={isLoading}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
      <div className="flex justify-between my-2 text-[#f0700c]">
        <NextLink href="/forgetPsd">
          <div>忘记密码?</div>
        </NextLink>
        <button onClick={() => router.push("/register")}>注册</button>
      </div>
    </>
  );
}
