"use client";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Form,
  Input,
  Snippet,
} from "@heroui/react";
import React from "react";
import { useTranslations } from "next-intl"; // 假设你用 next-intl

export default function ForwardingPage() {
  const t = useTranslations("ForwardingPage");

  return (
    <div>
      <div className="bg-[url('https://hoobuy.com/_nuxt/estimation_bg.BPnQS2i-.webp')] bg-no-repeat bg-cover h-[180px]" />

      <div className="container mx-auto flex justify-between gap-5 h-[100%] p-5 ">
        <div className="rounded-lg bg-[#fff] flex-[3] p-8">
          <p className="font-bold mb-5">{t("warehouseAddress")}</p>
          <Snippet className="w-full " symbol="">
            <span>Bryant-4-Bryant </span>
            <span>13602579223</span>
            <span>{t("warehouseFullAddress")}</span>
          </Snippet>
          <Divider className="my-4" />

          <p className="font-bold my-5">{t("forwardingPackage")}</p>
          <Form
            className="w-full  flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              let data = Object.fromEntries(new FormData(e.currentTarget));

              console.log("submit", data);
            }}
          >
            <Input
              isRequired
              errorMessage={t("errorTrackingNo")}
              label={t("trackingNo")}
              labelPlacement="outside"
              name="trackingNo"
              placeholder={t("trackingNoPlaceholder")}
              type="text"
            />

            <Input
              isRequired
              errorMessage={t("errorPackageName")}
              label={t("packageName")}
              labelPlacement="outside"
              name="packageName"
              placeholder={t("packageNamePlaceholder")}
              type="text"
            />
          </Form>
        </div>

        <div className="rounded-lg bg-[#fff] flex-1 p-8">
          <CheckboxGroup
            defaultValue={["buenos-aires", "london"]}
            label={<p className="font-bold mb-5">{t("extraServices")}</p>}
          >
            <Checkbox value="buenos-aires">{t("serviceInspection")}</Checkbox>
            <Checkbox value="sydney">{t("serviceConfirmation")}</Checkbox>
            <Checkbox value="san-francisco">
              {t("serviceRemoveInvoice")}
            </Checkbox>
            <Checkbox value="london">{t("serviceOriginalBox")}</Checkbox>
            <Button className="bg-[#f0700c] text-[#fff]">{t("submit")}</Button>
            <Checkbox value="tokyo">{t("acceptAgreement")}</Checkbox>
          </CheckboxGroup>
        </div>
      </div>
    </div>
  );
}
