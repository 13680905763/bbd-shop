"use client";
import { Button, Input, Image, Form } from "@heroui/react";
import { useRouter } from "next/navigation";
import { AiOutlineAlibaba } from "react-icons/ai";
import { FaCircle, FaRegImage } from "react-icons/fa";
import React from "react";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
// import { Link } from "@heroui/link";
// import { Snippet } from "@heroui/snippet";
// import { Code } from "@heroui/code";
// import { button as buttonStyles } from "@heroui/theme";

// import { siteConfig } from "@/config/site";
// import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";

export default function Home() {
  const router = useRouter();

  /**
   * 从 1688 商品链接中提取 offerId
   * @param url 商品详情页链接
   * @returns 提取到的 offerId 或 null
   */
  function extractOfferId(parsedUrl: any): string | null {
    try {
      const pathname = parsedUrl.pathname;

      // 匹配 /offer/865930740519.html 中的 ID
      const match = pathname.match(/\/offer\/(\d+)\.html/);

      return match ? match[1] : null;
    } catch (err) {
      console.error("无效的 URL:", err);

      return null;
    }
  }
  const Search = (e: any) => {
    console.log(666);

    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    const url = new URL(data.url);

    console.log(data, url);
    const source =
      data.url.includes("item.taobao.com") ||
      data.url.includes("detail.tmall.com")
        ? "TAOBAO"
        : data.url.includes("detail.1688.com/")
          ? "1688"
          : "weidian";
    const sourceproductId = url.searchParams.get("id") || extractOfferId(url);

    console.log(source, sourceproductId);
    //  source: "TAOBAO",
    //     sourceproductId: "788110260427",
    router.push(
      `/goods/${source}/${sourceproductId}`, // 目标路由
    );
  };

  return (
    <div className="pb-12">
      <section className="flex bg-cover bg-no-repeat h-[630px] bg-[url('https://bbdbuy.oss-cn-hongkong.aliyuncs.com/uploads/20250220/c4917de822e9f85cec22162733faad64.jpg')]">
        <div className="container mx-auto flex-col flex justify-end  gap-16">
          <div className="max-w-3xl">
            <div className="text-7xl tracking-tighter font-bold text-white flex flex-col  mb-10">
              <p>Simplify Your </p>
              <p>Shopping With BBD</p>
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
                        "bg-[#ffffff4d] text-white font-bold opacity-90",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className={clsx("mt-4", "text-white")}>
                      {step.title}
                    </div>
                    <div className={clsx("mt-2", "text-white", "font-medium")}>
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
            src="	https://bbdbuy.com/uploads/20241029/61049479ab798a2c55ec58757d45f56c.png"
            width={350}
          />
          <Image
            alt="HeroUI hero Image"
            src="https://bbdbuy.com/uploads/20241029/baa067483290d2ca1f91c845d4e255f6.png"
            width={350}
          />
          <Image
            alt="HeroUI hero Image"
            src="https://bbdbuy.com/uploads/20241029/baa067483290d2ca1f91c845d4e255f6.png"
            width={350}
          />
          <Image
            alt="HeroUI hero Image"
            src="	https://bbdbuy.com/uploads/20241029/4e05c63f6f2a87850e803ea0c907c705.png"
            width={350}
          />
        </div>
        <h2 className="text-4xl  font-bold text-center my-14">
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
