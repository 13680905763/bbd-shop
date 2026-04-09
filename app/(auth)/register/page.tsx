"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast, InputOtp } from "@heroui/react";
import {
  IoPerson,
  IoLockClosed,
  IoPeopleSharp,
  IoArrowBack,
} from "react-icons/io5";
import { useTranslations } from "next-intl";

import { activateEmail, signUpCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { queryClient } from "@/lib/react-query";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth.register");

  const [isActive, setIsActive] = useState(false); // 是否进入验证码页
  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
    inviteCode: searchParams.get("inviteCode") || "",
    isChecked: false,
  });
  const [hasCachedCode, setHasCachedCode] = useState(false);

  React.useEffect(() => {
    if (!searchParams.get("inviteCode") && typeof window !== "undefined") {
      const code = localStorage.getItem("inviteCode");
      if (code) {
        setHasCachedCode(true);
        setFormData((prev: any) => ({ ...prev, inviteCode: code }));
      }
    }
  }, [searchParams]);
  const registerFormFields: FieldConfig[] = [
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
      size: "lg",
      required: true,
      errorMessage: t("fields.password.errorMessage"),
      placeholder: t("fields.password.placeholder"),
      startContent: <IoLockClosed />,
    },
    {
      type: "input",
      name: "inviteCode",
      size: "lg",
      placeholder: t("fields.inviteCode.placeholder"),
      startContent: <IoPeopleSharp />,
      isDisabled: searchParams.get("inviteCode") || hasCachedCode ? true : false,
    },
    {
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
        queryClient.invalidateQueries({ queryKey: ["userInfo"] }); // 刷新
        router.push("/dashboard");
      } catch { }
    }
  };

  // 注册表单提交
  const handleSubmit = async (data: any) => {
    const { isChecked, ...signData } = data;

    if (!isChecked) {
      addToast({ title: t("agreementRequired"), color: "danger" });

      return;
    }
    try {
      await signUpCustomer(signData);
      setFormData({ email: data.email });
      setIsActive(true); // 进入验证码页
    } catch { }
  };

  // 验证码页部分
  if (isActive) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center mb-2 gap-2">
          <IoArrowBack
            className="cursor-pointer text-lg"
            onClick={() => setIsActive(false)}
          />
          <p className="text-title-xl m-0">{t("otpTitle")}</p>
        </div>
        <p className="text-sm mb-4">
          {t("otpDescription", { email: formData.email })}
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
        fields={registerFormFields}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
      <div className="text-center mt-4">
        {t("alreadyHaveAccount")}
        <button
          className="text-[#f0700c]"
          onClick={() => router.push("/login")}
        >
          {t("login")}
        </button>
      </div>
    </div>
  );
}
