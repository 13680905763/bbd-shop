"use client";
import React from "react";
import { Button, Checkbox, Divider, Image } from "@heroui/react";
import NextLink from "next/link";

import { lightFont, priceFont, subtitle } from "@/components/primitives";
import Progress from "@/components/progress";

export default function SubmitOrder() {
  const items = [
    {
      id: "1",
      skuPicUrl: "https://heroui.com/images/hero-card-complete.jpeg",
      productTitle:
        "裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生阔腿卫裤裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生",
      pavList: "颜色:【春秋款两件】黑色+白花灰;尺码:L",
      price: 123,
      postFee: 123,
      totalPrice: 266,
      unitPrice: 26,
      domesticShipping: 0,
      quantity: 123,
    },
    {
      id: "2",
      skuPicUrl: "https://heroui.com/images/hero-card-complete.jpeg",
      productTitle:
        "裤子男款夏季男裤灰色薄款直筒21裤男士宽松休闲运动裤男生阔腿卫裤裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生",
      pavList: "颜色:【春秋款两件】黑色+白花灰;尺码:L",
      totalPrice: 266,
      price: 123,
      postFee: 123,
      unitPrice: 26,
      domesticShipping: 0,
      quantity: 123,
    },
  ];

  return (
    <div className="container mx-auto bg-[#fff]  p-4 ">
      <div className={subtitle()}>确认产品信息</div>
      <div className="mt-5">
        <Progress
          currentStep={1}
          steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
        />
      </div>
      <div>
        <div className="bg-[#fff] rounded-md my-4 w-full border border-[#ccc]">
          <div className="p-4">店名</div>

          <Divider />
          <div className="p-4">
            {items?.map((item) => (
              <div
                key={item?.id}
                className="flex justify-between items-center gap-8 mb-4"
              >
                <div className=" flex ">
                  <Image
                    alt="Product"
                    className="h-[100px]"
                    height={100}
                    src={item?.skuPicUrl}
                    width={100}
                  />
                </div>
                <div className="flex-[2]">
                  <div className="line-clamp-2 text-base font-bold">
                    {item.productTitle}
                  </div>
                  <div className="text-[#acacac] text-sm line-clamp-1">
                    {item?.pavList}
                  </div>
                  {/* <div>{item?.remark}</div>
            <div>备注</div> */}
                </div>
                <div className=" flex-1">x 1</div>

                <div className="flex-[1]">
                  <div className={priceFont()}>总计: ${item.totalPrice}</div>
                  <div
                    className={priceFont({
                      color: "black",
                      size: "sm",
                      weight: "normal",
                    })}
                  >
                    单价: ${item.price}
                  </div>
                  <div className={lightFont({ size: "sm" })}>
                    国内运费 {item.postFee}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div>
            <p>
              《禁运物品声明》 《 服务条款和用户管理》 《退换货服务》
              《免责声明》
            </p>
            <Checkbox className="mt-2 " color="primary">
              <span className="text-[#676969]">
                我已阅读并同意Hoobuy的免责声明
              </span>
            </Checkbox>
          </div>
        </div>
        <Divider className="my-4" />
        <div className="flex justify-end items-center gap-4">
          <div>应付金额: USD $5.83</div>
          <NextLink href="/order/pay-order">
            <Button color="primary">提交订单</Button>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
