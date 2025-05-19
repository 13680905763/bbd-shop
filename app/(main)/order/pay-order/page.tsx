"use client";
import React from "react";
import { Button, cn, Divider, Radio, RadioGroup, User } from "@heroui/react";

import { price, subtitle } from "@/components/primitives";
import Progress from "@/components/progress";

export default function SubmitOrder() {
  return (
    <div className="container mx-auto bg-[#fff]  p-4 ">
      <div className={subtitle()}>结算</div>
      <div className="mt-5">
        <Progress
          currentStep={1}
          steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
        />
      </div>
      <div>
        <div className="flex flex-col gap-1 w-full">
          <RadioGroup
            classNames={{
              base: "w-full",
            }}
            defaultValue={"123"}
          >
            <Radio
              classNames={{
                base: cn(
                  "inline-flex min-w-[100%] w-full bg-content1 m-0",
                  "hover:bg-content2 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary",
                ),
                labelWrapper: "w-full",
                label: "w-full ",
              }}
              value={"123"}
            >
              <div>
                <div className="flex justify-between text-sm py-2 px-1">
                  <div className="flex items-center gap-4">
                    <div>余额</div>
                    <div className={price({ size: "xl2" })}>$ 999</div>
                  </div>
                  <Button color="primary">充值</Button>
                </div>
              </div>
            </Radio>
            <Radio
              aria-label={"onlypay"}
              classNames={{
                base: cn(
                  "inline-flex min-w-[100%] w-full bg-content1 m-0",
                  "hover:bg-content2 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary",
                ),
                labelWrapper: "w-full",
                label: "w-full ",
              }}
              value={"onlypay"}
            >
              <div className="w-full flex justify-between gap-2 ">
                <User
                  avatarProps={{
                    size: "md",
                    src: "https://amoe-oss.oss-cn-hangzhou.aliyuncs.com/images/logo/payu.png",
                  }}
                  name={"onlypay"}
                />
              </div>
            </Radio>
            <Radio
              aria-label={"paypel"}
              classNames={{
                base: cn(
                  "inline-flex min-w-[100%] w-full bg-content1 m-0",
                  "hover:bg-content2 items-center justify-start",
                  "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary",
                ),
                labelWrapper: "w-full",
                label: "w-full ",
              }}
              value={"paypel"}
            >
              <div className="w-full flex justify-between gap-2 ">
                <User
                  avatarProps={{
                    size: "md",
                    src: "https://amoe-oss.oss-cn-hangzhou.aliyuncs.com/images/logo/image.png",
                  }}
                  name={"paypel"}
                />
              </div>
            </Radio>
          </RadioGroup>
        </div>
        <Divider className="my-4" />
        <div className="flex justify-end items-center gap-4">
          <div>应付金额: USD $5.83</div>
          <Button className=" " color="primary">
            下单结算
          </Button>
        </div>
      </div>
    </div>
  );
}
