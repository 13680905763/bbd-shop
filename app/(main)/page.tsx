"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

import HomeSearchForm from "./components/home-search-form";
import HomeAnnouncementBar from "./components/home-announcement-bar";
import HomeImageLinks, { LinkItem } from "./components/home-image-links";
import HomeServiceCards, { ServiceItem } from "./components/home-service-cards";
import HomeStepFlow, { Step } from "./components/home-step-flow";

import FullscreenLoader from "@/components/common/fullscreen-loader";
import ChatBox from "@/components/common/chatbox";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false); // 🔹 loading 状态
  const t = useTranslations("Home"); // 用于文本
  const steps = t.raw("Steps") as Step[];
  const links = t.raw("Links") as LinkItem[];
  const services = t.raw("Services") as ServiceItem[];

  console.log(t.raw("texts"));

  return (
    <div className="pb-12">
      {isLoading && <FullscreenLoader />}
      <section className="flex bg-cover bg-no-repeat h-[630px] bg-[url('/images/indexbg.webp')]">
        <div className="container mx-auto flex-col flex justify-end  gap-16">
          <div className="max-w-3xl">
            <div className="text-7xl tracking-tighter font-bold text-white flex flex-col  mb-10">
              <p>{t("texts.Slogan.line1")}</p>
              <p>{t("texts.Slogan.line2")}</p>
            </div>

            <HomeSearchForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>
          <HomeStepFlow steps={steps} />
        </div>
      </section>
      {/* 公告条 */}
      <HomeAnnouncementBar
        texts={{
          label: t("texts.Announcement.label"),
          message: t("texts.Announcement.message"),
        }}
      />
      <div className="container mx-auto">
        <HomeImageLinks links={links} />
        <h2 className="text-4xl  font-bold text-center my-10">
          {t("texts.ServiceTitle")}
        </h2>
        <HomeServiceCards services={services} />
        <ChatBox />
      </div>
    </div>
  );
}
