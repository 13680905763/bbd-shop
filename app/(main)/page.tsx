"use client";
import { Button, Input, Image, Form, addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { AiOutlineAlibaba } from "react-icons/ai";
import { FaCircle, FaRegImage } from "react-icons/fa";
import React from "react";
import { useTranslations } from "next-intl";
import { FiVolume2 } from "react-icons/fi";

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
      <section className="flex bg-cover bg-no-repeat h-[630px] bg-[url('/images/indexbg.webp')]">
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
          <div
            className="h-[116px] rounded-2xl p-4 flex items-center justify-around mb-4 w-[70%] 
        bg-white/5  "
          >
            {[
              { title: "下单", desc: "粘贴商品链接以提交订单" },
              { title: "质检&存储", desc: "提供3-5张QC图和90天免费存储" },
              { title: "提包", desc: "组合打包&检查包裹" },
              { title: "国际物流", desc: "超过150家便宜的物流线路" },
            ].map((step, index) => (
              <React.Fragment key={step.title}>
                <div className="flex flex-col items-center text-sm font-bold">
                  {/* 圆圈编号 */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center 
                        bg-[#f0700c]/70 text-white font-bold text-xl shadow-md"
                  >
                    {index + 1}
                  </div>

                  {/* 步骤标题 */}
                  <div className="mt-4 text-gray-800 font-semibold">
                    {step.title}
                  </div>

                  {/* 步骤描述 */}
                  <div className="mt-2 text-gray-600 font-medium text-center text-xs">
                    {step.desc}
                  </div>
                </div>

                {/* 中间虚线分隔 */}
                {index < 3 && (
                  <div className="flex-1 -mt-10 mx-4 border-t-2 border-dashed border-white/50" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
      <div className="bg-[#ffeee1] text-[#4a1f05]">
        <div className="container mx-auto flex items-center justify-between py-2 px-4">
          {/* 左侧公告 */}
          <div className="flex items-center space-x-3">
            {/* 喇叭图标 */}
            <FiVolume2 className="w-5 h-5 text-[#f0700c] animate-pulse" />

            {/* 公告文字 */}
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wide bg-[#f0700c]/10 text-[#f0700c] rounded-md">
              公告
            </span>

            <span className="font-medium text-sm md:text-base text-[#4a1f05]">
              🎉 全场{" "}
              <span className="font-extrabold underline text-[#d9480f]">
                88折
              </span>{" "}
              限时优惠！
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="mt-[20px] flex justify-evenly">
          <a href="https://discord.gg/yKNsV43Ddn">
            <Image
              alt="HeroUI hero Image"
              src="/images/page/tab1.png"
              width={350}
            />
          </a>
          <a href="/dashboard">
            <Image
              alt="HeroUI hero Image"
              src="/images/page/tab2.png"
              width={350}
            />
          </a>
          <a href="/estimation">
            <Image
              alt="HeroUI hero Image"
              src="/images/page/tab3.png"
              width={350}
            />
          </a>
          <a href="/register">
            <Image
              alt="HeroUI hero Image"
              src="/images/page/tab4.png"
              width={350}
            />
          </a>
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
