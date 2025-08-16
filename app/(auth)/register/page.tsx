"use client";
import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { addToast, InputOtp } from "@heroui/react";
import {
  IoPerson,
  IoLockClosed,
  IoPeopleSharp,
  IoArrowBack,
} from "react-icons/io5";

import { activateEmail, signUpCustomer } from "@/services";
import { handleAuthSuccess } from "@/lib/auth-handler";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
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
  {
    type: "input",
    name: "inviteCode",
    size: "lg",
    placeholder: "请输入邀请码，没有邀请码请留空",
    startContent: <IoPeopleSharp />,
  },
  {
    type: "checkbox",
    name: "isChecked",
    size: "sm",
    label: " I have read and agree to the website terms and conditions",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false); // 是否进入验证码页
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
    inviteCode: "",
    isChecked: false,
  });

  // 验证码回调
  const handleOtpChange = async (code: string) => {
    if (code.length === 6 && formData.email) {
      try {
        await activateEmail({
          email: formData.email,
          activationCode: code,
        });
        await handleAuthSuccess();
        router.push("/");
      } catch {}
    }
  };

  const handleBackToEmail = () => {
    setIsActive(false);
  };

  // 注册表单提交
  const handleSubmit = async (data: any) => {
    const { isChecked, ...signData } = data;

    if (!isChecked) {
      addToast({ title: "请勾选统一协议", color: "danger" });

      return;
    }
    setIsLoading(true);
    try {
      await signUpCustomer(signData);
      setFormData({ email: data.email });
      setIsActive(true); // 进入验证码页
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  // 验证码页部分
  if (isActive) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center mb-2 gap-2">
          <IoArrowBack
            className="cursor-pointer text-lg"
            onClick={handleBackToEmail}
          />
          <p className="text-title-xl m-0">验证你的电子邮箱</p>
        </div>
        <p className="text-sm mb-4">
          我们已发送验证码到 <span className="font-bold">{formData.email}</span>
          ， 请输入验证码完成验证。
        </p>
        <InputOtp
          className="m-auto mb-4"
          length={6}
          size="lg"
          onValueChange={handleOtpChange}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="text-3xl text-default-600 font-semibold mb-4">注册</div>
      <CommonForm
        confirmText="注册"
        fields={loginFormFields}
        formData={formData}
        isLoading={isLoading}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />

      <div className="text-center mt-4">
        已有账号？
        <NextLink href="/login">
          <span className="text-[#f0700c] cursor-pointer">登录</span>
        </NextLink>
      </div>
    </div>
  );
}
