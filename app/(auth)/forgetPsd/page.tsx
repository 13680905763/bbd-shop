"use client";
import { Button, Form, Input } from "@heroui/react";
import React from "react";
import NextLink from "next/link";

import { subtitle } from "@/components/primitives";

export default function ForgetPsdPage() {
  return (
    <>
      <div className={subtitle()}>
        <span className="text-3xl">账号安全</span>
      </div>
      <div className="mb-4">请输入与您的帐户关联的电子邮件</div>
      <Form
        className="w-full  flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          let data = Object.fromEntries(new FormData(e.currentTarget));
        }}
      >
        <Input
          isRequired
          errorMessage="Email"
          labelPlacement="outside"
          name="username"
          placeholder="Email"
          size="lg"
          type="text"
        />

        <Button
          className="block w-full bg-[#f0700c]"
          color="primary"
          size="lg"
          type="submit"
        >
          密码重置
        </Button>
      </Form>
      <div className="text-center mt-4">
        <span>已有账号？</span>
        <NextLink href="/login">
          <span className="text-[#f0700c]">登录</span>
        </NextLink>
      </div>
    </>
  );
}
