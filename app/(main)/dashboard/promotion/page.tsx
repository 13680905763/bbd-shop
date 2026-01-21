"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Divider,
  Image,
  Button,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { IoCopyOutline } from "react-icons/io5";

import { CopyText } from "@/components/ui";
import { describeText, price, subtitle } from "@/components/primitives";
import { getExperience } from "@/services";
import { useGlobalStore } from "@/store";
import { useBonusConfig, useUserInfo } from "@/hook/api";

export default function PromotionPage() {
  const t: any = useTranslations("dashboard.promotion.page");
  const { currency } = useGlobalStore();
  const { data: user, isLoading, error } = useUserInfo();
  const { data: bonusConfig, isLoading: isLoadingBonusConfig } = useBonusConfig();
  const [experience, setExperience] = useState<any>(null);


  const fetchExperience = async () => {
    try {
      const res = await getExperience();

      // setPromotionConfig(res1);
      setExperience(res || null);
    } catch {
    } finally {
    }
  };

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
          {t.raw("process").map((item: any, index: any) => {
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
        <div className="mt-10 w-full px-40 ">
          <CopyText
            className="w-full"
            text={`https://www.bbdbuy1.com/register?inviteCode=${user?.inviteCode || ""}`}
          >
            <div className="w-full py-2.5 px-4 bg-[#f4f4f5] rounded-xl text-[#11181C] flex items-center justify-between cursor-pointer hover:bg-[#e4e4e7] transition-colors">
              <span className="font-mono text-sm break-all">
                {`https://www.bbdbuy1.com/register?inviteCode=${user?.inviteCode || ""}`}
              </span>
              <IoCopyOutline size={18} />
            </div>
          </CopyText>

          <div className="my-2">
            <span className={describeText({ weight: "normal" })}>
              {t("invite.copyUrl")}
            </span>
          </div>
        </div>
      </div>

      <Divider className="my-4" />
      {/* 我的联盟 */}
      <div>
        <div className={subtitle()}>{t("myAlliance.title")}</div>
        <div className="flex justify-center items-center bg-[#ffeee1] rounded-lg p-5 gap-5">
          <div className="flex-1 flex justify-center flex-col items-center gap-2">
            <div className={price()}>{currency.symbol}0</div>
            <div className={describeText({ weight: "normal" })}>
              {t("myAlliance.totalReward")}
            </div>
            <div className="flex gap-10">
              <Button className="w-32 button-default" size="sm">
                {t("myAlliance.record")}
              </Button>
              <Button className="w-32" color="primary" size="sm">
                {t("myAlliance.withdraw")}
              </Button>
            </div>
          </div>
          <div className="flex-[2] flex bg-[#fff] p-4 rounded-lg">
            <div className="flex-1 flex flex-col items-center">
              <div>0</div>
              <div>{t("myAlliance.inviteUsers")}</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div>0</div>
              <div>{t("myAlliance.withdrawTimes")}</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div>0</div>
              <div>{t("myAlliance.earned")}</div>
            </div>
          </div>
        </div>
      </div>
      {/* 我的等级 */}
      <div>
        <div className={subtitle()}>
          {t("myLevel.title")}
          <span className="text-sm font-medium">
            ({t("myLevel.experience")} {experience?.experience})
          </span>
        </div>
        <div className="flex justify-center items-center bg-[#f7f8f9] rounded-lg">
          {bonusConfig?.map((item: any, index: any) => (
            <div
              key={item.id}
              className={`
                flex-1 flex justify-center items-center flex-col border border-[#eeeeee]
                ${index !== bonusConfig.length - 1 ? "border-r-0" : ""}
                ${index === 0 ? "bg-[#ffeee1]" : ""}
              `}
            >
              <div className="py-4 text-[#f0700c]">{item.rangeCode}</div>
              <div className="flex flex-col gap-1 p-5 w-full items-center bg-[#fff]">
                <div className={describeText()}>{t("myLevel.bonusRate")}</div>
                <div className={price()}>
                  {(Number(item.configValue) * 100).toFixed(2)}%
                </div>
                <div className={describeText()}>
                  {item.rangeMin} ~ {item.rangeMax}{" "}
                  {t("myLevel.experienceRange")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className={subtitle()}>{t("faq.title")}</div>
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
        </Accordion>
      </div>
    </div>
  );
}
