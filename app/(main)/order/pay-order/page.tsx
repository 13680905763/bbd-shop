"use client";
import React from "react";
import { Button, cn, Radio, RadioGroup, Image, Tooltip } from "@heroui/react";
import { HiQuestionMarkCircle } from "react-icons/hi";

import { price } from "@/components/primitives";
import Progress from "@/components/common/progress";
import { usePayMethod } from "@/hook/wallet/usePayMethod";
export default function SubmitOrder() {
  const { data, isLoading, isError } = usePayMethod();

  console.log("data", data);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>加载失败</div>;

  return (
    <div className="container mx-auto bg-[#fff]  p-4 ">
      <div className="mt-5">
        <Progress
          currentStep={1}
          steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
        />
      </div>
      <div>
        <div className="flex flex-col gap-1 w-full">
          <RadioGroup
            classNames={{
              base: "w-full",
            }}
            defaultValue={"1"}
          >
            {data.map((item: any) => (
              <div key={item.methodName}>
                <p className="text-title">{item.methodName}</p>
                {item.paymentList.map((payment: any) => {
                  if (payment.id == 1)
                    return (
                      <Radio
                        key={payment.id}
                        classNames={{
                          base: cn(
                            "inline-flex min-w-[100%] w-full bg-content1 m-0",
                            "hover:bg-content2 items-center justify-start",
                            "cursor-pointer rounded-lg gap-2 p-3 border-1",
                            "data-[selected=true]:border-primary",
                          ),
                          labelWrapper: "w-full",
                          label: "w-full ",
                        }}
                        value={payment.id}
                      >
                        <div>
                          <div className="flex justify-between text-sm py-2 px-1">
                            <div className="flex items-center gap-4">
                              <div>余额</div>
                              <div className={price({ size: "xl2" })}>
                                $ 999
                              </div>
                            </div>
                            <Button color="primary">充值</Button>
                          </div>
                        </div>
                      </Radio>
                    );

                  return (
                    <Radio
                      key={payment.id}
                      classNames={{
                        base: cn(
                          "inline-flex min-w-[100%] w-full bg-content1 m-0  mb-2 ",
                          "hover:bg-content2 items-center justify-start",
                          "cursor-pointer rounded-lg gap-2 p-3 border-1",
                          "data-[selected=true]:border-primary",
                        ),
                        labelWrapper: "w-full",
                        label: "w-full ",
                      }}
                      value={payment.id}
                    >
                      <div className="w-full flex items-center gap-3 ">
                        <Image
                          className="object-contain"
                          height={60}
                          src={payment.logoUrl}
                          width={60}
                        />
                        <span className="text-sm font-semibold">
                          {payment.payName}
                        </span>
                      </div>
                    </Radio>
                  );
                })}
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-end items-center p-4 gap-4 sticky bottom-0 border-t-[1px] bg-white z-10">
          <div className="text-[#3d3d3d] text-sm flex items-center gap-1">
            应付金额
            <Tooltip
              className="bg-[#262626] text-white p-2 max-w-screen-sm"
              content="由于币种汇率间转换计算，可能会产生约0.01或0.02的差额"
            >
              <HiQuestionMarkCircle />
            </Tooltip>
            ：PLN 685.03 手续费：PLN 29.81
          </div>
          <p className="text-price-xl">PLN 714.84</p>
          <Button className="w-[300px]" color="primary" size="lg">
            下单结算
          </Button>
        </div>
      </div>
    </div>
  );
}
