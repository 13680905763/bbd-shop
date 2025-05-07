"use client";
import React from "react";
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
const countrys = [
  {
    label: "Argentina",
    key: "Argentina",
    src: "https://flagcdn.com/ar.svg",
  },
  {
    label: "Venezuela",
    key: "Venezuela",
    src: "https://flagcdn.com/ve.svg",
  },
  {
    label: "Brazil",
    key: "Brazil",
    src: "https://flagcdn.com/ve.svg",
  },
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
  const [submitted, setSubmitted] = React.useState<any>(null);
  const onSubmit = (e: any) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    setSubmitted(data);
  };

  return (
    <div>
      <div className="bg-[url('https://hoobuy.com/_nuxt/estimation_bg.BPnQS2i-.webp')] bg-no-repeat bg-cover h-[180px]" />
      <div className="text-center  container m-auto p-6">
        <h1 className={title({ size: "xs" })}>运费估算</h1>
        <Spacer y={8} />
        <div>
          <Form className="w-full  " onSubmit={onSubmit}>
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
                        alt="Argentina"
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
                className="flex-1 "
                errorMessage="Please enter a valid email"
                label="重量（g）"
                name="number"
                type="number"
              />
            </div>
            <Spacer y={2} />
            <div className="flex gap-8 w-full">
              <Select className="flex-1" items={types} label="商品类型">
                {(type) => <SelectItem>{type.label}</SelectItem>}
              </Select>
              <div className="flex-1 flex gap-8">
                <Input
                  className="flex-1 "
                  errorMessage="Please enter a valid email"
                  label="长（cm）"
                  name="email3"
                  type="text"
                />
                <Input
                  className="flex-1 "
                  errorMessage="Please enter a valid email"
                  label="宽（cm）"
                  name="email1"
                  type="text"
                />
                <Input
                  className="flex-1 "
                  errorMessage="Please enter a valid email"
                  label="高（cm）"
                  name="email2"
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
            {submitted && (
              <div className="text-small text-default-500">
                You submitted: <code>{JSON.stringify(submitted)}</code>
              </div>
            )}
          </Form>
        </div>
      </div>
      <Divider className="my-1" />
      <div className="container m-auto  ">
        <Accordion>
          <AccordionItem
            key="1"
            title={
              <div className="flex gap-5 items-center">
                <div className="flex flex-col justify-center items-center flex-1">
                  <Avatar
                    className="w-20 h-20 text-large"
                    color="primary"
                    radius="sm"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  />
                  <Spacer y={4} />

                  <p className="text-nowrap font-semibold">EMS small package</p>
                  <div className="flex gap-2">
                    <Chip color="primary" size="sm">
                      可投保
                    </Chip>

                    <Chip className="text-[#fff]" color="success" size="sm">
                      免税
                    </Chip>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className={describeText()}>价格</div>
                  <div className={describeText({ size: "xl", color: 333 })}>
                    $ 123
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center text-default-500">
                  <div className={describeText()}>时间</div>
                  <div className={describeText({ size: "xl", color: 333 })}>
                    7-15 days
                  </div>
                </div>
                <div className="max-w-[60%]">
                  <span className={describeText({ weight: "normal" })}>
                    注意：本运输渠道为限时特惠专供，到期结束不再恢复。
                    1、尾程将由美国USPS派送，偏远地区需加收偏远附加费，具体费用以实际产生为准。
                    2、该运输线路为优惠线路，100g进位计算（不足100g按100g计费）。
                    3、USPS覆盖地区广，运输时效快、运力强大、运输安全可靠，通关能力强。
                    5、禁止寄送:
                    带电、液体、粉末、膏体等，及其他触及国家法律法规明确规定的商品。
                  </span>
                </div>
              </div>
            }
          >
            <div className="flex gap-5 pb-8">
              <div className="flex-1 rounded-sm bg-[#f5f5f5] p-6 ">
                <p className="font-semibold mb-2">结算标准</p>
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell>Tony Reichert</TableCell>
                      <TableCell>CEO</TableCell>
                      <TableCell>Active</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Spacer y={6} />
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell>Tony Reichert</TableCell>
                      <TableCell>CEO</TableCell>
                      <TableCell>Active</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex-1 rounded-sm bg-[#f5f5f5]">
                <div className="flex-1 rounded-sm bg-[#f5f5f5] p-6 ">
                  <p className="font-semibold mb-2">邮寄限制</p>
                  <div className="rounded-xl bg-[#fff] p-6 ">
                    重量限制:0g ~ 10000g
                  </div>
                  <p className="font-semibold my-2">线路特点</p>
                  <div className="rounded-xl bg-[#fff] p-6 text-sm">
                    <span className={describeText({ weight: "normal" })}>
                      注意：本运输渠道为限时特惠专供，到期结束不再恢复。
                      1、尾程将由美国USPS派送，偏远地区需加收偏远附加费，具体费用以实际产生为准。
                      2、该运输线路为优惠线路，100g进位计算（不足100g按100g计费）。
                      3、USPS覆盖地区广，运输时效快、运力强大、运输安全可靠，通关能力强。
                      5、禁止寄送:
                      带电、液体、粉末、膏体等，及其他触及国家法律法规明确规定的商品。
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title={
              <div className="flex gap-5 items-center">
                <div className="flex flex-col justify-center items-center flex-1">
                  <Avatar
                    className="w-20 h-20 text-large"
                    color="primary"
                    radius="sm"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  />
                  <Spacer y={4} />

                  <p className="text-nowrap font-semibold">EMS small package</p>
                  <div className="flex gap-2">
                    <Chip color="primary" size="sm">
                      可投保
                    </Chip>

                    <Chip className="text-[#fff]" color="success" size="sm">
                      免税
                    </Chip>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className={describeText()}>价格</div>
                  <div className={describeText({ size: "xl", color: 333 })}>
                    $ 123
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center text-default-500">
                  <div className={describeText()}>时间</div>
                  <div className={describeText({ size: "xl", color: 333 })}>
                    7-15 days
                  </div>
                </div>
                <div className="max-w-[60%]">
                  <span className={describeText({ weight: "normal" })}>
                    1. Dedicated channel, EMS customs clearance; 2. The route is
                    direct transportation, and the package is transported
                    directly to France; 3. The delivery provider in the
                    destination country is Lapost.
                  </span>
                </div>
              </div>
            }
          >
            <div className="flex gap-5 pb-8">
              <div className="flex-1 rounded-sm bg-[#f5f5f5] p-6 ">
                <p className="font-semibold mb-2">结算标准</p>
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell>Tony Reichert</TableCell>
                      <TableCell>CEO</TableCell>
                      <TableCell>Active</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Spacer y={6} />
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell>Tony Reichert</TableCell>
                      <TableCell>CEO</TableCell>
                      <TableCell>Active</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex-1 rounded-sm bg-[#f5f5f5]">
                <div className="flex-1 rounded-sm bg-[#f5f5f5] p-6 ">
                  <p className="font-semibold mb-2">邮寄限制</p>
                  <div className="rounded-xl bg-[#fff] p-6 ">
                    重量限制:0g ~ 10000g
                  </div>
                  <p className="font-semibold my-2">线路特点</p>
                  <div className="rounded-xl bg-[#fff] p-6 text-sm">
                    <span className={describeText({ weight: "normal" })}>
                      1. Dedicated channel, EMS customs clearance; 2. The route
                      is direct transportation, and the package is transported
                      directly to France; 3. The delivery provider in the
                      destination country is Lapost.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
