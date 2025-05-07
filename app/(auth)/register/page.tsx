"use client";
import { Button, Checkbox, Form, Input } from "@heroui/react";
import React from "react";
import NextLink from "next/link";

import { subtitle } from "@/components/primitives";

export default function RegisterPage() {
  return (
    <>
      <div className={subtitle()}>
        <span className="text-3xl">注册</span>
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
          type="email"
        />
        <Input
          isRequired
          errorMessage="Password"
          labelPlacement="outside"
          name="email"
          placeholder="Password"
          size="lg"
          type="password"
        />
        <Input
          isRequired
          errorMessage="Password"
          labelPlacement="outside"
          name="email"
          placeholder="Enter Password"
          size="lg"
          type="password"
        />
        <Input
          isRequired
          errorMessage="Password"
          labelPlacement="outside"
          name="email"
          placeholder="输入邀请码（选填）"
          size="lg"
          type="text"
        />
        <Checkbox defaultSelected>
          <span className="text-sm">
            我已阅读和接受《BBDBuy用户注册协议》和《BBDBuy声明》
          </span>
        </Checkbox>

        <Button
          className="block w-full bg-[#f0700c]"
          color="primary"
          size="lg"
          type="submit"
        >
          注册
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
