"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Divider,
  Snippet,
  Image,
  Button,
  Tab,
  Tabs,
} from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

import { describeText, price, subtitle } from "@/components/primitives";
import {
  getExperience,
  getExperienceList,
  getPromotionConfig,
  getPromotionList,
} from "@/services";
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

export default function PromotionPage() {
  const [experience, setExperience] = useState(null);
  const [experienceList, setExperienceList] = useState(null);
  const [promotionConfig, setPromotionConfig] = useState([]);
  const [promotionList, setPromotionList] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = searchParams.get("tab") || "balance";

  const changeTab = useCallback(
    (key: React.Key) => {
      router.push(`/dashboard/promotion?tab=${key}`);
    },
    [router],
  );
  const fetchExperience = async () => {
    try {
      const res = await getExperience();
      const res1 = await getPromotionConfig();
      const res2 = await getExperienceList();
      const res3 = await getPromotionList();

      console.log("res2", res2);
      console.log("res3", res3);

      setPromotionConfig(res1);
      setPromotionList(res3);
      setExperience(res || null);
      setExperienceList(res2 || null);
    } catch (err) {
      console.error("获取经验失败:", err);
    } finally {
    }
  };

  // 动态生成 Tabs 配置
  const tabLabels = [
    {
      key: "经验明细",
      label: "经验明细",
    },
    {
      label: "奖金明细",
      key: "奖金明细",
    },
    {
      label: "邀请明细",
      key: "邀请明细",
    },
  ];
  const tabsConfig = [
    {
      key: "经验明细",
    },
    {
      key: "邀请明细",
    },
    {
      key: "奖金明细",
    },
  ].map((tab) => {
    let component: React.ReactNode = null;

    switch (tab.key) {
      case "经验明细":
        component = <div>score</div>;

        break;
      case "邀请明细":
        component = <div>score</div>;
        break;
      case "奖金明细":
        // component = <CouponTab />;
        component = <div>coupon</div>;
        break;
    }

    return { key: tab.key, component };
  });

  useEffect(() => {
    fetchExperience();
  }, []);

  return (
    <div className="pt-5">
      <Image
        alt="HeroUI hero Image"
        className=" object-cover h-[160px]"
        radius="md"
        src="/images/promotion.png"
        width={"100%"}
      />
      <div className="container mx-auto ">
        <div className=" mt-5 w-full px-40 flex items-center">
          {processItems.map((item, index) => {
            return (
              <React.Fragment key={item.title}>
                <div className="w-5 h-5 rounded-full bg-[#fcf4f2] text-[#f0700c] text-xs flex items-center justify-center relative">
                  {item.title}
                  <div className="w-max absolute top-[20px] text-[#acacac]">
                    {item.describe}
                  </div>
                </div>
                {index < 2 ? (
                  <div className="w-1/2 border border-dashed border-[#f0700c]" />
                ) : null}
              </React.Fragment>
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
        <div className="flex justify-center items-center bg-[#ffeee1] rounded-lg p-5 gap-5">
          <div className="flex-1 flex justify-center flex-col items-center gap-2">
            <div className={price()}>$0</div>
            <div className={describeText({ weight: "normal" })}>总奖励</div>
            <div className="flex gap-10">
              <Button className="w-32 button-default" size="sm">
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
        <div className={subtitle()}>
          我的等级
          {/* <span className="text-sm">经验：{experience?.experience}</span> */}
        </div>
        <div className="flex justify-center items-center bg-[#f7f8f9] rounded-lg">
          {promotionConfig.map((item: any, index) => (
            <div
              key={item.id}
              className={`
        flex-1 flex justify-center items-center flex-col border border-[#eeeeee]
        ${index !== promotionConfig.length - 1 ? "border-r-0" : ""}
        ${index === 0 ? "bg-[#ffeee1]" : ""}
      `}
            >
              <div className="py-4 text-[#f0700c]">{item.rangeCode}</div>
              <div className="flex flex-col gap-1 p-5 w-full items-center bg-[#fff]">
                <div className={describeText()}>奖金比例</div>
                <div className={price()}>
                  {(Number(item.configValue) * 100).toFixed(2)}%
                </div>
                <div className={describeText()}>
                  {item.rangeMin} ~ {item.rangeMax} 经验
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className={subtitle()}>权益FAQ</div>
        <Accordion className="!border-1" variant="bordered">
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

      <Tabs
        aria-label="Wallet Tabs"
        classNames={{
          base: "mt-2 w-full bg-white p-2",
          tabList: "gap-6 w-full relative rounded-none p-0",
          cursor: "w-full bg-[#f0700c]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#f0700c]",
        }}
        color="primary"
        selectedKey={currentTab}
        variant="underlined"
        onSelectionChange={changeTab}
      >
        {tabLabels.map((tab) => (
          <Tab
            key={tab.key}
            title={
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
              </div>
            }
          >
            {tabsConfig.find((c) => c.key === tab.key)?.component}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
