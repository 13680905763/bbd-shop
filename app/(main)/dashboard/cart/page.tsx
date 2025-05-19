"use client";
import React from "react";
import { Button, Checkbox } from "@heroui/react";
import useSWR from "swr";
import NextLink from "next/link";

import Progress from "@/components/progress";
import CartItem from "@/components/cart-item";
// 定义一个 fetcher 函数
const postFetcher = (url: string, body: any) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customerId: 1 }),
  }).then((res) => res.json());

export default function CartPage() {
  const { data, isLoading, error } = useSWR(
    "/api/proxy/customer/cart/list/shop/group",
    postFetcher,
  );

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;
  console.log(data.data[0].cartList);

  return (
    <div className="flex flex-col h-[100%]">
      <div className="mt-5">
        <Progress
          currentStep={0}
          steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
        />
      </div>
      <div className="  rounded-2xl  flex  flex-col  w-full justify-between max-h-[800px]">
        <div className="felx-1 mb-4">全部商品 | 管理</div>

        <div className="overflow-y-auto flex flex-col gap-4">
          {data?.data?.map((item: any) => (
            <CartItem
              key={item.shopId}
              items={item.cartList}
              shopName={item.shopName}
            />
          ))}
          {/* <CartItem
            items={[
              {
                imageUrl: "https://heroui.com/images/hero-card-complete.jpeg",
                title:
                  "裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生阔腿卫裤裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生",
                specs: "颜色:【春秋款两件】黑色+白花灰;尺码:L",
                totalPrice: 266,
                unitPrice: 26,
                domesticShipping: 0,
                quantity: 123,
              },
              {
                imageUrl: "https://heroui.com/images/hero-card-complete.jpeg",
                title:
                  "裤子男款夏季男裤灰色薄款直筒21裤男士宽松休闲运动裤男生阔腿卫裤裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生",
                specs: "颜色:【春秋款两件】黑色+白花灰;尺码:L",
                totalPrice: 266,
                unitPrice: 26,
                domesticShipping: 0,
                quantity: 123,
              },
            ]}
            shopName="店名"
          /> */}

          {/* <CartItem
            items={[
              {
                imageUrl: "https://heroui.com/images/hero-card-complete.jpeg",
                title:
                  "裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生阔腿卫裤裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生",
                specs: "颜色:【春秋款两件】黑色+白花灰;尺码:L",
                totalPrice: 266,
                unitPrice: 26,
                domesticShipping: 0,
                quantity: 123,
              },
            ]}
            shopName="店名"
          /> */}
        </div>

        <div className="felx-1 rounded-lg bg-white pt-4  flex justify-between items-center ">
          <div>
            <Checkbox>全选</Checkbox>
          </div>
          <div className="flex gap-2 items-center">
            <div>总计</div>
            <NextLink href="/order/submit-order">
              <Button className="min-w-[120px]" color="primary" size="lg">
                提交订单
              </Button>
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
