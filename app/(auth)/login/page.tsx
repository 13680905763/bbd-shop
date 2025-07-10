"use client";
import { addToast } from "@heroui/react";
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

  const [isLoading, setisLoading] = useState<any>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const redirect = searchParams.get("redirect") || "/"; // 默认为首页

  const handleSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginCustomer(data);

      await handleAuthSuccess(redirect, res, router);
    } catch (err) {
      // 错误处理可选在这里写
    }
  };
  const onSubmit = (e: any) => {
    setisLoading(true);
    e.preventDefault();
    let data: any = Object.fromEntries(new FormData(e.currentTarget));

    console.log("data", data);
    loginCustomer({ ...data })
      .then((e: any) => {
        if (e.success) {
          addToast({
            title: e.msg,
            timeout: 1000,
            color: "success",
          });
          router.push("/");
        } else {
          addToast({
            title: e.msg,
            timeout: 1000,
            color: "danger",
          });
        }
      })
      .finally(() => {
        setisLoading(false);
      });
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
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
      {/* <Form className="w-full  flex flex-col gap-4" onSubmit={onSubmit}>
        <Input
          isRequired
          errorMessage="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Email"
          size="lg"
          type="text"
        />

        <Input
          isRequired
          errorMessage="Password"
          labelPlacement="outside"
          name="password"
          placeholder="Password"
          size="lg"
        />
        <Button
          className=" w-full "
          color="primary"
          isLoading={isLoading}
          size="lg"
          type="submit"
        >
          登录
        </Button>
      </Form> */}
      <div className="flex justify-between my-2 text-[#f0700c]">
        <NextLink href="/forgetPsd">
          <div>忘记密码?</div>
        </NextLink>
        <button onClick={() => router.push("/register")}>注册</button>
      </div>
    </>
  );
}
