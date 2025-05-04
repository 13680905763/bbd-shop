"use client";
import React from "react";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Accordion, AccordionItem, Divider, Snippet } from "@heroui/react";

import { describeText, subtitle } from "@/components/primitives";
const processItems = [
  {
    title: "1",
    describe: "分享您的联盟代码",
  },
  {
    title: "2",
    describe: "您邀请的朋友确认收到您的联盟代码",
  },
  {
    title: "3",
    describe: "收到您的联盟佣金",
  },
];
const defaultContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export default function Promotionpage() {
  return (
    <div>
      <Image
        alt="HeroUI hero Image"
        className=" object-cover h-[160px]"
        radius="md"
        src="/promotion.png"
        width={"100%"}
      />
      <div className="container mx-auto ">
        <div className=" mt-5 w-full px-40 flex items-center">
          {processItems.map((item, index) => {
            return (
              <>
                <div
                  key={item.title}
                  className="w-5 h-5 rounded-full bg-[#fcf4f2] text-[#f0700c] text-xs flex items-center justify-center relative"
                >
                  {item.title}
                  <div className="w-max absolute top-[20px] text-[#acacac]">
                    {item.describe}
                  </div>
                </div>
                {index < 2 ? (
                  <div className="w-1/2 border border-dashed border-[#f0700c]" />
                ) : null}
              </>
            );
          })}
        </div>
        <div className="mt-10 w-full px-40 ">
          <Snippet className="w-full " symbol="">
            <span>https://bbdbuy.com/register?ref=3582377</span>
          </Snippet>

          <div className="my-2">
            <span className={describeText({ weight: "normal" })}>
              复制此 URL 并使用它将用户重定向到您的联盟 lD 的主页
            </span>
          </div>
        </div>
      </div>

      <Divider className="my-4" />
      <div>
        <div className={subtitle()}>我的联盟</div>
        <div className="flex justify-center items-center bg-[#f5f5f5] rounded-lg p-5 gap-5">
          <div className="flex-1 flex justify-center flex-col items-center gap-2">
            <div className={describeText({ size: "xl", color: 333 })}>$0</div>
            <div className={describeText({ weight: "normal" })}>总奖励</div>
            <div className="flex gap-10">
              <Button className="w-32" size="sm">
                记录
              </Button>
              <Button className="w-32" color="primary" size="sm">
                领取
              </Button>
            </div>
          </div>
          <div className="flex-[2] flex bg-[#fff] p-4 rounded-lg">
            <div className="flex-1 flex flex-col items-center">
              <div>0</div>
              <div>邀请用户 &gt;</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div>0</div>
              <div>取款</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div>0</div>
              <div>赚取 &gt;</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={subtitle()}>我的权益</div>
        <div className="flex justify-center items-center bg-[#f5f5f5] rounded-lg ">
          <div className="flex-1 flex justify-center items-center flex-col border border-[#eeeeee] border-r-0 bg-[#fcf4f2]">
            <div className="py-4 text-[#c92910]"> Bronze Affiliate </div>
            <div className="flex flex-col gap-1 p-5 w-full  items-center ">
              <div className={describeText()}>奖金比例</div>
              <div className={describeText({ size: "xl", color: 333 })}>
                3.00%
              </div>
              <div className={describeText()}>0~500积分</div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center flex-col border border-[#eeeeee] border-r-0">
            <div className="py-4 border-b border-[#eeeeee]">
              {" "}
              Bronze Affiliate{" "}
            </div>
            <div className="flex flex-col gap-1 p-5 w-full bg-[#fff] items-center ">
              <div className={describeText()}>奖金比例</div>
              <div className={describeText({ size: "xl", color: 333 })}>
                3.00%
              </div>
              <div className={describeText()}>0~500积分</div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center flex-col border border-[#eeeeee] border-r-0">
            <div className="py-4 border-b border-[#eeeeee]">
              {" "}
              Bronze Affiliate{" "}
            </div>
            <div className="flex flex-col gap-1 p-5 w-full bg-[#fff] items-center ">
              <div className={describeText()}>奖金比例</div>
              <div className={describeText({ size: "xl", color: 333 })}>
                3.00%
              </div>
              <div className={describeText()}>0~500积分</div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center flex-col border border-[#eeeeee] border-r-0">
            <div className="py-4 border-b border-[#eeeeee]">
              {" "}
              Bronze Affiliate{" "}
            </div>
            <div className="flex flex-col gap-1 p-5 w-full bg-[#fff] items-center ">
              <div className={describeText()}>奖金比例</div>
              <div className={describeText({ size: "xl", color: 333 })}>
                3.00%
              </div>
              <div className={describeText()}>0~500积分</div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center flex-col border border-[#eeeeee] ">
            <div className="py-4 border-b border-[#eeeeee]">
              {" "}
              Bronze Affiliate{" "}
            </div>
            <div className="flex flex-col gap-1 p-5 w-full bg-[#fff] items-center ">
              <div className={describeText()}>奖金比例</div>
              <div className={describeText({ size: "xl", color: 333 })}>
                3.00%
              </div>
              <div className={describeText()}>0~500积分</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={subtitle()}>权益FAQ</div>
        <Accordion variant="bordered">
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title="什么是联盟会员计划？"
          >
            {defaultContent}
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title="我的奖金是如何计算的？"
          >
            {defaultContent}
          </AccordionItem>
          <AccordionItem
            key="3"
            aria-label="Accordion 3"
            title="如何免费推广？"
          >
            {defaultContent}
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
