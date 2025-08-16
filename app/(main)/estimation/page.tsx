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
  Select,
  SelectItem,
  Accordion,
  AccordionItem,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@heroui/react";

import { describeText, title } from "@/components/primitives";
import { gettWarehouseRoutesList } from "@/services";

const countrys = [
  { label: "Argentina", key: "Argentina", src: "https://flagcdn.com/ar.svg" },
  { label: "Venezuela", key: "Venezuela", src: "https://flagcdn.com/ve.svg" },
  { label: "Brazil", key: "Brazil", src: "https://flagcdn.com/br.svg" },
  {
    label: "Switzerland",
    key: "Switzerland",
    src: "https://flagcdn.com/ch.svg",
  },
];
const types = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "giraffe", label: "Giraffe" },
];

export default function EstimationPage() {
  const [submitted, setSubmitted] = useState<any>(null);
  const [routes, setRoutes] = useState<any[]>([]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    setSubmitted(data);

    // 假设接口支持按表单条件查
    gettWarehouseRoutesList().then((res) => {
      setRoutes(res?.data || []);
    });
  };

  useEffect(() => {
    // 初始化加载全部
    gettWarehouseRoutesList().then((res) => {
      console.log("res", res);

      setRoutes(res || []);
    });
  }, []);

  return (
    <div>
      <div className="bg-[url('https://hoobuy.com/_nuxt/estimation_bg.BPnQS2i-.webp')] bg-no-repeat bg-cover h-[180px]" />
      <div className=" bg-[#fff]">
        <div className="text-center container m-auto p-5">
          <h1 className={title({ size: "xs" })}>运费估算</h1>
          <Spacer y={8} />
          <Form className="w-full" onSubmit={onSubmit}>
            <div className="flex gap-8 w-full">
              <Autocomplete
                isRequired
                className="flex-1"
                defaultItems={countrys}
                label="仓库寄往"
                name="country"
              >
                {(country) => (
                  <AutocompleteItem
                    key={country.key}
                    startContent={
                      <Avatar
                        alt={country.label}
                        className="w-6 h-6"
                        src={country.src}
                      />
                    }
                  >
                    {country.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Input
                isRequired
                className="flex-1"
                label="重量（g）"
                name="weight"
                type="number"
              />
            </div>
            <Spacer y={2} />
            <div className="flex gap-8 w-full">
              <Select
                className="flex-1"
                items={types}
                label="商品类型"
                name="productType"
              >
                {(type) => <SelectItem key={type.key}>{type.label}</SelectItem>}
              </Select>
              <div className="flex-1 flex gap-8">
                <Input
                  className="flex-1"
                  label="长（cm）"
                  name="length"
                  type="text"
                />
                <Input
                  className="flex-1"
                  label="宽（cm）"
                  name="width"
                  type="text"
                />
                <Input
                  className="flex-1"
                  label="高（cm）"
                  name="height"
                  type="number"
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
                立即查询
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <div className="container m-auto p-5">
        <Accordion className="!border-1" variant="bordered">
          {routes.map((route, index) => (
            <AccordionItem
              key={index}
              title={
                <div className="flex gap-5 items-center">
                  <div className="flex flex-col justify-center items-center flex-1">
                    <Avatar className="w-20 h-20" src={route.logoUrl} />
                    <Spacer y={4} />
                    <p className="text-nowrap font-semibold">{route.name}</p>
                    <div className="flex gap-2">
                      {route.insurable && (
                        <Chip color="primary" size="sm">
                          可投保
                        </Chip>
                      )}
                      {route.taxFree && (
                        <Chip className="text-[#fff]" color="success" size="sm">
                          免税
                        </Chip>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className={describeText()}>价格</div>
                    <div className={describeText({ size: "xl", color: 333 })}>
                      $ {route.additionalWeightFee} {route.additionalVolumeFee}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center text-default-500">
                    <div className={describeText()}>时间</div>
                    <div className={describeText({ size: "xl", color: 333 })}>
                      {route.minDays}- {route.maxDays}
                    </div>
                  </div>
                  <div className="max-w-[60%]">
                    <span className={describeText({ weight: "normal" })}>
                      {route.description}
                    </span>
                  </div>
                </div>
              }
            >
              <Divider />
              <div className="flex gap-5 pb-8">
                <div className="flex-1 rounded-sm  p-4 ">
                  <p className="font-semibold mb-2">结算标准</p>
                  <Table aria-label="结算标准">
                    <TableHeader>
                      <TableColumn>首重运费</TableColumn>
                      <TableColumn>续重运费</TableColumn>
                      <TableColumn>报关费</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{route.firstWeightFee}</TableCell>
                        <TableCell>{route.additionalWeightFee}</TableCell>
                        <TableCell>{route.customsFee}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="flex-1 rounded-sm p-4">
                  <p className="font-semibold mb-2">邮寄限制</p>
                  <div className="rounded-xl bg-[#fff] p-6 ">{route.limit}</div>
                  <p className="font-semibold my-2">线路特点</p>
                  <div className="rounded-xl bg-[#fff] p-6 text-sm">
                    {route.description}
                  </div>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
