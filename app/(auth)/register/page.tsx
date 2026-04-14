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

import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { useSignUpFlow } from "@/hook/business";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth.register");

  const {
    isEmailVerified,
    registeredEmail,
    setIsEmailVerified,
    signUp,
    isSigningUp,
    activateEmail,
    isActivating,
  } = useSignUpFlow();
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
      isDisabled:
        searchParams.get("inviteCode") || hasCachedCode ? true : false,
    },
    {
      type: "checkbox",
      name: "agreeToTerms",
      size: "sm",
      label: t("fields.isChecked.label"),
    },
  ];

  const handleInviteCode = (code: string) => {
    if (code.length === 6) {
      activateEmail({
        email: registeredEmail || formData.email,
        activationCode: code,
      });
    }
  };
  const handleSubmit = (formData: any) => {
    if (!formData.agreeToTerms) {
      addToast({
        title: t("agreementRequired"),
        color: "danger",
      });

      return;
    }
    const submitData: any = {
      email: formData.email,
      password: formData.password,
    };

    if (formData.inviteCode) {
      submitData.inviteCode = formData.inviteCode;
    }

    signUp(submitData);
  };


  // 验证码页部分
  if (isEmailVerified) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center mb-2 gap-2">
          <IoArrowBack
            className="cursor-pointer text-lg"
            onClick={() => setIsEmailVerified(false)}
          />
          <p className="text-title-xl m-0">{t("otpTitle")}</p>
        </div>
        <p className="text-sm mb-4">
          {t("otpDescription", { email: formData.email })}
        </p>
        <InputOtp
          className="m-auto mb-4"
          length={6}
          isDisabled={isActivating}
          size="lg"
          onValueChange={handleInviteCode}
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
        isLoading={isSigningUp}
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
