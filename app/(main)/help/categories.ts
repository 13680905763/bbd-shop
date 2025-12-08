import { useTranslations } from "next-intl";

import {
  StoragePeriod,
  AfterSalePolicy,
  InsuranceCompensation,
  ShippingRestrictions,
  CustomsAndTaxes,
  Recharge,
  InternationalCreditCard,
  WireTransfer,
  BeginnerGuide,
  ServiceFee,
  ReturnRefund,
  AboutBBDBuy,
  ContactUs,
  Terms,
  PrivacyPolicy,
} from "./content";

export const useFaqCategories = () => {
  const t = useTranslations("faq");

  return [
    {
      id: "daigou-guide",
      title: t("daigouGuide"),
      articles: [
        {
          id: "beginner-guide",
          label: t("beginnerGuide"),
          component: BeginnerGuide,
        },
        {
          id: "service-fee",
          label: t("serviceFee"),
          component: ServiceFee,
        },
        {
          id: "return-refund",
          label: t("returnRefund"),
          component: ReturnRefund,
        },
      ],
    },
    {
      id: "payment",
      title: t("payment"),
      articles: [
        {
          id: "recharge",
          label: t("recharge"),
          component: Recharge,
        },
        {
          id: "international-credit-card",
          label: t("internationalCreditCard"),
          component: InternationalCreditCard,
        },
        {
          id: "wire-transfer",
          label: t("wireTransfer"),
          component: WireTransfer,
        },
      ],
    },
    {
      id: "delivery",
      title: t("delivery"),
      articles: [
        {
          id: "shipping-restrictions",
          label: t("shippingRestrictions"),
          component: ShippingRestrictions,
        },
        {
          id: "customs-taxes",
          label: t("customsTaxes"),
          component: CustomsAndTaxes,
        },
      ],
    },
    {
      id: "after-sale",
      title: t("afterSale"),
      articles: [
        {
          id: "storage-period",
          label: t("storagePeriod"),
          component: StoragePeriod,
        },
        {
          id: "after-sale-policy",
          label: t("afterSalePolicy"),
          component: AfterSalePolicy,
        },
        {
          id: "insurance-compensation",
          label: t("insuranceCompensation"),
          component: InsuranceCompensation,
        },
      ],
    },
    {
      id: "other",
      title: t("other"),
      articles: [
        { id: "about", label: t("about"), component: AboutBBDBuy },
        { id: "contact", label: t("contact"), component: ContactUs },
        { id: "terms", label: t("terms"), component: Terms },
        { id: "privacy", label: t("privacy"), component: PrivacyPolicy },
      ],
    },
  ];
};
