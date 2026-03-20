"use client";
import { Button, Form, Input, addToast } from "@heroui/react";
import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { subtitle } from "@/components/primitives";
import { sendVerificationCode, resetPassword } from "@/services/user";

export default function ForgetPsdPage() {
  const t = useTranslations("auth.forgetPassword");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    if (!email) {
      addToast({ title: t("emailError"), color: "danger" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast({ title: t("emailInvalid"), color: "danger" });
      return;
    }

    setIsSending(true);
    try {
      await sendVerificationCode(email);
      setCountdown(60);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !code) {
      addToast({ title: t("fillAll"), color: "danger" });
      return;
    }



    setIsLoading(true);
    try {
      await resetPassword({
        email,
        verificationCode: code,
      });
      router.push("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className={subtitle()}>
        <span className="text-3xl">{t("title")}</span>
      </div>
      <div className="mb-4">{t("desc")}</div>
      <Form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          isRequired
          errorMessage="Email"
          labelPlacement="outside"
          name="email"
          placeholder={t("emailPlaceholder")}
          type="email"
          value={email}
          onValueChange={setEmail}
        />

        <div className="flex gap-2 w-full">
          <Input
            isRequired
            labelPlacement="outside"
            name="code"
            placeholder={t("codePlaceholder")}
            type="text"
            value={code}
            onValueChange={setCode}
            className="flex-1"
          />
          <Button
            color={countdown > 0 || !email || isSending ? "default" : "primary"}
            isDisabled={countdown > 0 || !email || isSending}
            onPress={handleSendCode}
            className="w-32"
          >
            {countdown > 0 ? `${countdown}s` : t("sendCode")}
          </Button>
        </div>
        <Button
          className=" w-full "
          color="primary"
          type="submit"
          isLoading={isLoading}
        >
          {t("submit")}
        </Button>
      </Form>
      <div className="text-center mt-4">
        <span>{t("hasAccount")}</span>
        <NextLink href="/login">
          <span className="text-[#f0700c] ml-1">{t("login")}</span>
        </NextLink>
      </div>
    </>
  );
}
