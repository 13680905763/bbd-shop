"use client";
import { addToast, Button, Form, Input } from "@heroui/react";
import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { subtitle } from "@/components/primitives";
import { getlogin } from "@/services/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setisLoading] = useState<any>(false);

  const onSubmit = (e: any) => {
    setisLoading(true);
    e.preventDefault();
    let data: any = Object.fromEntries(new FormData(e.currentTarget));

    console.log("data", data);
    getlogin({ ...data })
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
      <div className={subtitle()}>
        <span className="text-3xl">欢迎回来</span>
      </div>
      <Form className="w-full  flex flex-col gap-4" onSubmit={onSubmit}>
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
      </Form>
      <div className="flex justify-between my-4 text-[#f0700c]">
        <NextLink href="/forgetPsd">
          <div>忘记密码?</div>
        </NextLink>
        <NextLink href="/register">
          <div>注册</div>
        </NextLink>
      </div>
    </>
  );
}
