"use client";
import {
  addToast,
  Button,
  Checkbox,
  Form,
  Input,
  InputOtp,
} from "@heroui/react";
import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { IoPerson, IoLockClosed, IoPeopleSharp } from "react-icons/io5";

import { subtitle } from "@/components/primitives";
import { getcallback, getsignUp } from "@/services/api/auth";

export default function RegisterPage() {
  const [isActive, setIsActive] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [fomeData, setFomeData] = useState<any>();
  const router = useRouter();
  const callback = (e: any) => {
    // console.log(e.length);
    if (e.length === 6) {
      // 激活
      getcallback({ ...fomeData, activationCode: e }).then((e: any) => {
        if (e.success) {
          console.log("注册成功");
          router.push("/dashboard");
        } else {
          addToast({
            title: e.msg,
          });
        }
      });
    }
  };
  const signUp = (e: any) => {
    e.preventDefault();
    if (isCheck) {
      let data: any = Object.fromEntries(new FormData(e.currentTarget));

      console.log(666);

      setFomeData(data);
      console.log("data", data);
      getsignUp({ ...data }).then((e: any) => {
        if (e.success) {
          setIsActive(true);
        } else {
          addToast({
            title: e.msg,
            timeout: 1000,
          });
        }
      });
    } else {
      addToast({
        title: "请勾选统一协议",
      });
    }
  };

  return (
    <>
      {!isActive ? (
        <>
          <div className={subtitle()}>
            <span className="text-3xl">注册</span>
          </div>
          <Form className="w-full " onSubmit={signUp}>
            <Input
              isRequired
              errorMessage="Please enter a valid email"
              name="email"
              placeholder="Enter your email"
              size="lg"
              startContent={<IoPerson />}
              type="email"
            />
            <Input
              name="password"
              placeholder="Password"
              size="lg"
              startContent={<IoLockClosed />}
            />
            <Input
              name="yaoqing"
              placeholder="请输入邀请码，没有邀请码请留空"
              size="lg"
              startContent={<IoPeopleSharp />}
            />

            <Checkbox
              checked={isCheck}
              className="my-1 w-full"
              size="sm"
              onChange={() => setIsCheck(!isCheck)}
            >
              I have read and agree to the website terms and conditions
            </Checkbox>
            <Button className="w-full" color="primary" type="submit">
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
      ) : (
        <div>
          <p className="text-title-xl ">验证你的电子邮箱</p>
          <div className="text-sm my-4">
            <span>我们已经发送验证码到</span>
            <span className="font-bold">{fomeData.email}</span>
            <span>。请在下面输入验证码进行验证</span>
          </div>
          <InputOtp
            className="m-auto"
            length={6}
            size="lg"
            onValueChange={callback}
          />
        </div>
      )}
    </>
  );
}
