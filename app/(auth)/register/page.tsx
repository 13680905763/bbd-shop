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
import { useTranslations } from "next-intl";

import { activateEmail, signUpCustomer } from "@/services";
import { handleAuthSuccess } from "@/lib/auth-handler";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("RegisterPage");

  const [isActive, setIsActive] = useState(false); // 是否进入验证码页
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
    inviteCode: "",
    isChecked: false,
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
    {
      key: "inviteCode",
      type: "input",
      name: "inviteCode",
      size: "lg",
      placeholder: t("fields.inviteCode.placeholder"),
      startContent: <IoPeopleSharp />,
    },
    {
      key: "isChecked",
      type: "checkbox",
      name: "isChecked",
      size: "sm",
      label: t("fields.isChecked.label"),
    },
  ];

  // 验证码回调
  const handleOtpChange = async (code: string) => {
    if (code.length === 6 && formData.email) {
      try {
        await activateEmail({
          email: formData.email,
          activationCode: code,
        });
        await handleAuthSuccess();
        router.push("/dashboard");
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
      addToast({ title: t("errors.agreementRequired"), color: "danger" });

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
          <p className="text-title-xl m-0">{t("otp.title")}</p>
        </div>
        <p className="text-sm mb-4">
          {t("otp.description", { email: formData.email })}
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
      <div className="text-center mt-4">
        {t("links.alreadyHaveAccount")}{" "}
        <NextLink href="/login">
          <span className="text-[#f0700c] cursor-pointer">
            {t("links.login")}
          </span>
        </NextLink>
      </div>
    </div>
  );
}
