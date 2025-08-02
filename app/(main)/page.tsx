"use client";
import { Button, Input, Image, Form, addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { AiOutlineAlibaba } from "react-icons/ai";
import { FaCircle, FaRegImage } from "react-icons/fa";
import React from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { getGoodsId } from "@/services";

// import { siteConfig } from "@/config/site";

export default function Home() {
  const router = useRouter();
  const t = useTranslations("Home");

  console.log("tttt", t("slogan.line1"));

  const Search = async (e: any) => {
    console.log(666);

    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    let url: URL;

    try {
      url = new URL(data.url);
    } catch (err) {
      // 可选：展示错误提示
      addToast({
        title: "请输入有效的 URL",
        timeout: 1000,
        color: "danger",
      });

      return; // 终止后续逻辑
    }
    const res: any = await getGoodsId({ url });

    router.push(
      `/goods/${res.source}/${res.sourceProductId}`, // 目标路由
    );
  };

  return (
    <div className="pb-12">
      <section className="flex bg-cover bg-no-repeat h-[630px] bg-[url('https://bbdbuy.oss-cn-hongkong.aliyuncs.com/uploads/20250220/c4917de822e9f85cec22162733faad64.jpg')]">
        <div className="container mx-auto flex-col flex justify-end  gap-16">
          <div className="max-w-3xl">
            <div className="text-7xl tracking-tighter font-bold text-white flex flex-col  mb-10">
              <p>{t("slogan.line1")}</p>
              <p>{t("slogan.line2")}</p>
            </div>
            <Form className="w-full " onSubmit={Search}>
              <Input
                endContent={
                  <div className="flex gap-4 items-center">
                    <FaRegImage className="w-[30px] h-[30px] text-gray-400" />
                    <Button className="bg-[#f0700c] text-[#fff] " type="submit">
                      Search
                    </Button>
                  </div>
                }
                label={
                  <div className="flex gap-2">
                    Enter product name / link
                    <div className="relative w-[30px] h-[30px]">
                      <FaCircle className="text-gray-400 w-full h-full" />
                      <span className="text-white absolute inset-0 flex items-center justify-center  font-bold ">
                        淘
                      </span>
                    </div>
                    <AiOutlineAlibaba className=" w-[30px] h-[30px] rounded-full bg-gray-400 text-white" />
                    <div className="relative w-[30px] h-[30px]">
                      <FaCircle className="text-gray-400 w-full h-full" />
                      <span className="text-white absolute inset-0 flex items-center justify-center  font-bold ">
                        店
                      </span>
                    </div>
                  </div>
                }
                name="url"
                radius={"full"}
                size={"lg"}
              />
            </Form>
          </div>
          <div className=" h-[116px] rounded-2xl p-4 flex items-center justify-around mb-4 w-[70%]">
            {[
              { title: "下单", desc: "粘贴商品链接以提交订单" },
              { title: "质检&存储", desc: "提供3-5张QC图和90天免费存储" },
              { title: "提包", desc: "组合打包&检查包裹" },
              { title: "国际物流", desc: "超过150家便宜的物流线路" },
            ].map((step, index) => {
              return (
                <React.Fragment key={step.title}>
                  <div className="flex flex-col items-center text-sm font-bold">
                    <div
                      className={clsx(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        "bg-[#9ca3af8a] text-white font-bold opacity-90 text-xl",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className={clsx("mt-4", "text-[#000000d5]")}>
                      {step.title}
                    </div>
                    <div
                      className={clsx(
                        "mt-2",
                        "text-[#000000c0]",
                        "font-medium",
                      )}
                    >
                      {step.desc}
                    </div>
                  </div>

                  {index < 4 - 1 && (
                    <div className="flex-1 -mt-10 mx-4 border-t-2 border-dashed border-white" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto">
        <div className="mt-[20px] flex justify-evenly">
          <Image
            alt="HeroUI hero Image"
            src="/images/page/tab1.png"
            width={350}
          />
          <Image
            alt="HeroUI hero Image"
            src="/images/page/tab2.png"
            width={350}
          />
          <Image
            alt="HeroUI hero Image"
            src="/images/page/tab3.png"
            width={350}
          />
          <Image
            alt="HeroUI hero Image"
            src="/images/page/tab4.png"
            width={350}
          />
        </div>
        <h2 className="text-4xl  font-bold text-center my-10">
          One-Stop Shopping Service
        </h2>
        <div className="flex justify-evenly">
          {siteConfig.describeItems.map((item) => {
            return (
              <div
                key={item.title}
                className="w-[22%]  p-8 bg-[#fff] rounded-lg"
              >
                <Image height={120} src={item.src} width={170} />
                <h6 className="text-[18px] leading-[60px] font-bold">
                  {item.title}
                </h6>
                <div className="text-[14px] leading-[24px] text-[#7d8fb3]">
                  {item.describe}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
