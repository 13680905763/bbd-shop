"use client";
import React from "react";
import { Image, useDisclosure } from "@heroui/react";
import { useTranslations } from "next-intl";
import { IoCopyOutline, IoHelpCircleOutline } from "react-icons/io5";
import clsx from "clsx";
import { useRouter } from "next/navigation";

import ActiveUserBonusModal from "./active-user-bonus-modal";

import { CopyText } from "@/components/ui";
import { describeText, price } from "@/components/primitives";
import { useGlobalStore } from "@/store";
import { useBonusConfig, useUserExperience, useUserInfo } from "@/hook/api";

export default function PromotionPage() {
  const t: any = useTranslations("dashboard.promotion.page");
  const router = useRouter();
  const { currency } = useGlobalStore();
  const { data: user, isLoading, error } = useUserInfo();
  const { data: experience, isLoading: isLoadingExperience } =
    useUserExperience();
  const { data: bonusConfig, isLoading: isLoadingBonusConfig } =
    useBonusConfig();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const process = [t("process1"), t("process2"), t("process3")];

  return (
    <div className="space-y-2">
      <Image
        alt="HeroUI hero Image"
        className="object-cover h-[160px] my-4"
        radius="md"
        src="/images/promotion.png"
        width={"100%"}
      />
      <div className="container mx-auto space-y-10 px-40">
        <div className="flex items-center">
          {process.map((item: any, index: any) => {
            return (
              <React.Fragment key={item}>
                <div className="w-5 h-5 rounded-full bg-[#fcf4f2] text-[#f0700c] text-xs flex items-center justify-center relative">
                  {index + 1}
                  <div className="w-max absolute top-[20px] text-[#acacac]">
                    {item}
                  </div>
                </div>
                {index < 2 ? (
                  <div className="w-1/2 border border-dashed border-[#f0700c]" />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        <div>
          <CopyText
            className="w-full"
            text={`${origin}/register?inviteCode=${user?.inviteCode || ""}`}
          >
            <div className="w-full py-2.5 px-4 bg-[#f4f4f5] rounded-xl text-[#11181C] flex items-center justify-between cursor-pointer hover:bg-[#e4e4e7] transition-colors">
              <span className="font-mono text-sm break-all">
                {`${origin}/register?inviteCode=${user?.inviteCode || ""}`}
              </span>
              <IoCopyOutline size={18} />
            </div>
          </CopyText>
          <span className="text-[#acacac] text-xs">{t("processTip")}</span>
        </div>
      </div>

      <div className="subtitle">{t("title1")}</div>
      <div className="grid grid-cols-3 bg-[#ffeee1] rounded-lg p-5">
        <div className="col-span-1 text-center flex flex-col items-center justify-center">
          <div className="font-bold text-3xl text-[#f0700c]">
            {currency.symbol}
            {user?.myBonus}
          </div>
          <div>{t("totalReward")}</div>
        </div>
        <div className="col-span-2 grid grid-cols-3 bg-[#fff] p-4 rounded-lg">
          <div className="text-center">
            <div>{user?.inviteCount}</div>
            <button
              className="hover:text-[#f0700c]"
              onClick={() => router.push("/dashboard/promotion/invitedUser")}
            >
              {t("inviteUsers")}
            </button>
          </div>
          <div className="text-center">
            <div>{user?.activeUsersCount || 0}</div>
            <button
              className="hover:text-[#f0700c] flex items-center gap-1 justify-center w-full"
              onClick={onOpen}
            >
              {t("activeUsers")}
              <IoHelpCircleOutline className="text-gray-400 hover:text-[#f0700c] text-lg" />
            </button>
          </div>
          <div className="text-center">
            <div>{experience?.experience || 0}</div>
            <button
              className="hover:text-[#f0700c]"
              onClick={() => router.push("/dashboard/promotion/experience")}
            >
              {t("experience")}
            </button>
          </div>
        </div>
      </div>
      <div className="subtitle">{t("title2")}</div>
      <div className="grid grid-cols-3 bg-[#f7f8f9] rounded-lg">
        {bonusConfig?.map((item: any, index: any) => (
          <div
            key={item.id}
            className={clsx(
              "col-span-1 text-center border border-[#eeeeee] ",
              index !== bonusConfig.length - 1 && "border-r-0",
              index == bonusConfig.length - 1 && "rounded-r-lg rounded-br-lg",
              index == 0 && "rounded-l-lg   bg-[#ffeee1]",
            )}
          >
            <div className="py-4 text-[#f0700c]">{item.rangeCode}</div>
            <div className="flex flex-col gap-1 p-5 w-full items-center bg-[#fff] rounded-b-lg">
              <div className={describeText()}>{t("bonusRate")}</div>
              <div className={price()}>
                {(Number(item.configValue) * 100).toFixed(2)}%
              </div>
              <div className={describeText()}>
                {item.rangeMin} ~ {item.rangeMax} {t("experienceRange")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className='subtitle'>{t("faq.title")}</div>
      <Accordion className="!border-1" variant="bordered">
        {t.raw("faq.questions").map((q: string, i: number) => (
          <AccordionItem
            key={i + 1}
            aria-label={`Accordion ${i + 1}`}
            title={q}
          >
            {t("faq.defaultContent")}
          </AccordionItem>
        ))}
      </Accordion> */}
      <ActiveUserBonusModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
