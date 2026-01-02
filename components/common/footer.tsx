import Link from "next/link";
import React from "react";
import { Divider, Image } from "@heroui/react";
import { useTranslations } from "next-intl";

import { Logo } from "../icons";

export default function Footer() {
  const t = useTranslations("components.footer");
  const footerItems = [
    {
      title: t("categories.daigouGuide.title"),
      itemLabel: [
        {
          label: t("categories.daigouGuide.beginnerGuide"),
          href: "/help?cat=daigou-guide&article=beginner-guide",
        },
        {
          label: t("categories.daigouGuide.serviceFee"),
          href: "/help?cat=daigou-guide&article=service-fee",
        },
        {
          label: t("categories.daigouGuide.returnRefund"),
          href: "/help?cat=daigou-guide&article=return-refund",
        },
      ],
    },
    {
      title: t("categories.payment.title"),
      itemLabel: [
        {
          label: t("categories.payment.topup"),
          href: "/help?cat=payment&article=topup",
        },
        {
          label: t("categories.payment.internationalCreditCard"),
          href: "/help?cat=payment&article=international-credit-card",
        },
        {
          label: t("categories.payment.wireTransfer"),
          href: "/help?cat=payment&article=wire-transfer",
        },
      ],
    },
    {
      title: t("categories.delivery.title"),
      itemLabel: [
        {
          label: t("categories.delivery.restrictions"),
          href: "/help?cat=delivery&article=restrictions",
        },
        {
          label: t("categories.delivery.customsTaxes"),
          href: "/help?cat=delivery&article=customs-taxes",
        },
      ],
    },
    {
      title: t("categories.afterSale.title"),
      itemLabel: [
        {
          label: t("categories.afterSale.storagePeriod"),
          href: "/help?cat=after-sale&article=storage-period",
        },
        {
          label: t("categories.afterSale.afterSalePolicy"),
          href: "/help?cat=after-sale&article=after-sale-policy",
        },
        {
          label: t("categories.afterSale.insuranceCompensation"),
          href: "/help?cat=after-sale&article=insurance-compensation",
        },
      ],
    },
    {
      title: t("categories.workingHours.title"),
      itemLabel: [
        { label: t("categories.workingHours.weekday") },
        { label: t("categories.workingHours.saturday") },
        { label: t("categories.workingHours.sunday") },
      ],
    },
  ];
  const footerOther = [
    { label: t("other.about"), href: "/help?cat=other&article=about" },
    { label: t("other.contact"), href: "/help?cat=other&article=contact" },
    { label: t("other.terms"), href: "/help?cat=other&article=terms" },
    { label: t("other.privacy"), href: "/help?cat=other&article=privacy" },
  ];

  return (
    <footer className="h-[400px] bg-[#f6f1ea]  w-full">
      <div className="container mx-auto">
        <div className="flex justify-between py-8">
          <div className="flex-1 flex justify-center">
            <div>
              <div className="mb-5">
                <Logo height={53} width={250} />
              </div>
              <div className="leading-[30px] text-base">{t("desc")}</div>
            </div>
          </div>
          <div className="flex-1" />

          {footerItems.map((item) => (
            <div key={item.title} className="flex-1 flex justify-center">
              <div className="text-center">
                {/* 一级标题 */}
                <p className="font-semibold text-lg text-gray-900 mb-4">
                  {item.title}
                </p>

                {/* 子项 */}
                {item.itemLabel.map((label) => (
                  <Link
                    key={label.label}
                    className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 my-2"
                    href={"href" in label ? label.href : "#"}
                  >
                    {label.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Divider className=" bg-[#69584a]" />
        <div className="border-t border-t-[hsla(0,0%,100%,0.1)] flex justify-between pt-8 text-[#7d8fb3]">
          <div>
            <p className="text-[16px] leading-[36px]">{t("copyright")}</p>
          </div>
          <div className="flex gap-1">
            <Image src="data:image/png;base64,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" />
            <Image src="data:image/png;base64,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" />
            <Image src="data:image/png;base64,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" />
            <Image src="data:image/png;base64,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" />
          </div>
          <div className="flex items-center gap-4">
            {footerOther.map((item) => (
              <Link
                key={item.label}
                className="text-gray-700 hover:text-black transition text-sm"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
