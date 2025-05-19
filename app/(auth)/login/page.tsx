"use client";
import { Button, Form, Input } from "@heroui/react";
import React from "react";
import NextLink from "next/link";

import { subtitle } from "@/components/primitives";

export default function LoginPage() {
  return (
    <>
      <div className={subtitle()}>
        <span className="text-3xl">欢迎回来</span>
      </div>
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

        <Input
          isRequired
          errorMessage="Password"
          labelPlacement="outside"
          name="email"
          placeholder="Password"
          size="lg"
          type="email"
        />
        <Button className=" w-full " color="primary" size="lg" type="submit">
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
