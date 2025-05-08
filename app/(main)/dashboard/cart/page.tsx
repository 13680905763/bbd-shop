"use client";
import React from "react";
import { Button, Checkbox } from "@heroui/react";

import CartItem from "@/components/cart-item";
import Progress from "@/components/progress";
export default function CartPage() {
  return (
    <div className="flex flex-col h-[100%]">
      <Progress
        currentStep={0}
        steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
      />
      <div className="bg-[#f5f5f5]  rounded-2xl p-4 flex  flex-col  mb-4 w-full justify-between max-h-[800px]">
        <div className="felx-1">全部商品 | 管理</div>

        <div className="overflow-y-auto">
          <CartItem
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
          />

          <CartItem
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
          />
        </div>

        <div className="felx-1 rounded-lg bg-white p-4 flex justify-between items-center">
          <div>
            <Checkbox>全选</Checkbox>
          </div>
          <div className="flex gap-2 items-center">
            <div>总计</div>
            <Button>提交订单</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
