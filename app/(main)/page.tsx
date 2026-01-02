"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

import {
  HomeAnnouncementBar,
  HomeImageLinks,
  HomeSearchForm,
  HomeServiceCards,
  HomeStepFlow,
} from "./components";

import FullscreenLoader from "@/components/common/fullscreen-loader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false); // 🔹 loading 状态
  const t = useTranslations("home");

  return (
    <div className="pb-12">
      {isLoading && <FullscreenLoader />}
      <section className="flex bg-cover bg-no-repeat h-[630px] bg-[url('/images/indexbg.webp')]">
        <div className="container mx-auto flex-col flex justify-end  gap-16">
          <div className="max-w-3xl">
            <div className="text-7xl tracking-tighter font-bold text-white flex flex-col  mb-10">
              <p>{t("line1")}</p>
              <p>{t("line2")}</p>
            </div>

            <HomeSearchForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>
          <HomeStepFlow />
        </div>
      </section>
      {/* 公告条 */}
      <HomeAnnouncementBar />
      <div className="container mx-auto">
        <HomeImageLinks />
        <h2 className="text-4xl  font-bold text-center my-10">
          {t("serviceTitle")}
        </h2>
        <HomeServiceCards />
      </div>
    </div>
  );
}
