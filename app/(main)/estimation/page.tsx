"use client";
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Form,
  Button,
  Input,
  Spacer,
  Accordion,
  AccordionItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  addToast,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import { describeText, title } from "@/components/primitives";
import { searchWarehouseRoutesList } from "@/services";
import { useCountries } from "@/hook";
import { useGlobalStore } from "@/store";

export default function EstimationPage() {
  const t = useTranslations("EstimationPage");
  const { currency } = useGlobalStore();
  const { data: countries = [] } = useCountries();

  console.log("currency", currency);

  const [routes, setRoutes] = useState<any[]>([]);

  // ✅ 受控表单数据
  const [formData, setFormData] = useState({
    countryId: 0, // 改成 number 类型
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const handleChange = (key: string, value: any) => {
    console.log("key", key, value);

    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { weight, length, width, height } = formData;

    // 校验逻辑
    const isWeightFilled = weight && Number(weight) > 0;
    const isSizeFilled =
      length &&
      Number(length) > 0 &&
      width &&
      Number(width) > 0 &&
      height &&
      Number(height) > 0;

    if (!isWeightFilled && !isSizeFilled) {
      addToast({
        title: t("fillWeightOrSize"),
        timeout: 1000,
        color: "danger",
      });

      return;
    }

    console.log("formData", formData);

    try {
      const res = await searchWarehouseRoutesList(formData);

      setRoutes(res || []);
      console.log("666");
    } catch (err) {
      setRoutes([]);
      // console.error(err);
    }
  };

  useEffect(() => {
    // 初始化加载全部
    // getWarehouseRoutesList().then((res) => {
    //   setRoutes(res || []);
    // });
  }, []);

  return (
    <div>
      <div className="bg-[url('https://hoobuy.com/_nuxt/estimation_bg.BPnQS2i-.webp')] bg-no-repeat bg-cover h-[180px]" />
      <div className=" bg-[#fff]">
        <div className="text-center container m-auto p-5">
          <h1 className={title({ size: "xs" })}>{t("title")}</h1>
          <Spacer y={8} />
          <Form className="w-full" onSubmit={onSubmit}>
            <div className="flex gap-8 w-full">
              <Autocomplete
                isRequired
                className="flex-1"
                defaultItems={countries}
                label={t("warehouse")}
                name="countryId"
                selectedKey={String(formData.countryId)}
                onSelectionChange={(key) =>
                  handleChange("countryId", Number(key))
                }
              >
                {(country: any) => (
                  <AutocompleteItem
                    key={country.id}
                    startContent={
                      <Avatar
                        alt={country.name}
                        className="w-6 h-6"
                        src={country.nationalFlag}
                      />
                    }
                  >
                    {country.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>

              <Input
                isRequired
                className="flex-1"
                label={t("weight")}
                name="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
              />
            </div>

            <Spacer y={2} />
            <div className="flex gap-8 w-full">
              <div className="flex-1 flex gap-8">
                <Input
                  className="flex-1"
                  label={t("length")}
                  name="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => handleChange("length", e.target.value)}
                />
                <Input
                  className="flex-1"
                  label={t("width")}
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={(e) => handleChange("width", e.target.value)}
                />
                <Input
                  className="flex-1"
                  label={t("height")}
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                />
              </div>
            </div>

            <Spacer y={2} />
            <div className="flex justify-center w-full">
              <Button
                className="min-w-48"
                size="lg"
                type="submit"
                variant="bordered"
              >
                {t("search")}
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {routes.length > 0 && (
        <div className="container m-auto p-5">
          <Accordion className="!border-1" variant="bordered">
            {routes.map((route, index) => (
              <AccordionItem
                key={index}
                title={
                  <div className="flex gap-5 items-start">
                    <div className="flex flex-col justify-center items-center w-[240px]">
                      <Avatar
                        className="w-20 h-20"
                        radius="sm"
                        src={route.logoUrl}
                      />
                      <p className="mt-1 text-sm font-semibold text-center">
                        {route.templateName}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-[220px]">
                      <div className="text-gray-500 text-sm">{t("price")}</div>
                      <div className="text-lg font-bold">
                        {/* {currency?.symbol} */}
                        {currency.symbol}&nbsp;
                        {route.shippingFee}
                        {/* {route.additionalWeightFee} -{" "}
                        {route.additionalVolumeFee} */}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-[220px]">
                      <div className="text-gray-500 text-sm">{t("time")}</div>
                      <div className="text-lg font-bold">
                        {route.shippingLine.minDays}-
                        {route.shippingLine.maxDays} days
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className={describeText({ weight: "normal" })}>
                        {route.shippingLine.description}
                      </span>
                    </div>
                  </div>
                }
              >
                <Divider />
                <div className="flex gap-5 pb-8">
                  <div className="flex-1 rounded-sm p-4 ">
                    <p className="font-semibold mb-2">{t("pricingStandard")}</p>
                    <Table aria-label={t("pricingStandard")}>
                      <TableHeader>
                        <TableColumn>{t("firstWeightFee")}</TableColumn>
                        <TableColumn>{t("additionalWeightFee")}</TableColumn>
                        {/* <TableColumn>{t("customsFee")}</TableColumn> */}
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{route.firstWeightFee}</TableCell>
                          <TableCell>{route.additionalWeightFee}</TableCell>
                          {/* <TableCell>{route.customsFee}</TableCell> */}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex-1 rounded-sm p-4">
                    <p className="font-semibold mb-2">{t("shippingLimit")}</p>
                    <div className="rounded-xl bg-white px-5 py-4 shadow-sm border border-gray-100">
                      <span className="text-lg font-semibold text-gray-800">
                        {route?.shippingLine?.minWeight} -{" "}
                        {route?.shippingLine?.maxWeight}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">g</span>
                    </div>
                    <p className="font-semibold my-2">{t("routeFeature")}</p>
                    <div className="rounded-xl bg-[#fff] p-6 text-sm">
                      {route.shippingLine.description}
                    </div>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
