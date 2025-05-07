"use client";
import { Checkbox, Divider, Image, NumberInput } from "@heroui/react";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
export default function CartPage() {
  return (
    <div className="flex flex-col h-[100%]">
      <div className="bg-[#f5f5f5] h-[116px] rounded-2xl p-4 flex items-center justify-around mb-4 w-full">
        <div className="flex flex-col items-center text-sm font-bold">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-dashed border-gray-300 bg-gray-50">
            1
          </div>
          <div className="mt-4">选择产品</div>
        </div>

        <div className="flex-1 -mt-10 mx-4 border-t-2 border-dashed border-gray-300" />
        <div className="flex flex-col items-center text-sm font-bold">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-dashed border-gray-300 bg-gray-50">
            1
          </div>
          <div className="mt-4">订单付款</div>
        </div>

        <div className="flex-1 -mt-10 mx-4 border-t-2 border-dashed border-gray-300" />
        <div className="flex flex-col items-center text-sm font-bold">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-dashed border-gray-300 bg-gray-50">
            1
          </div>
          <div className="mt-4">质检&仓库</div>
        </div>

        <div className="flex-1 -mt-10 mx-4 border-t-2 border-dashed border-gray-300" />
        <div className="flex flex-col items-center text-sm font-bold">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-dashed border-gray-300 bg-gray-50">
            1
          </div>
          <div className="mt-4">打包</div>
        </div>

        <div className="flex-1 -mt-10 mx-4 border-t-2 border-dashed border-gray-300" />
        <div className="flex flex-col items-center text-sm font-bold">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-dashed border-gray-300 bg-gray-50">
            1
          </div>
          <div className="mt-4">签收包裹</div>
        </div>
      </div>
      <div className="bg-[#f5f5f5]  rounded-2xl p-4 flex  flex-col  mb-4 w-full">
        <div>全部商品 | 管理</div>

        <div className="bg-[#fff]  rounded-md p-4   my-4 w-full ">
          <div>
            <Checkbox />
            店名
          </div>
          <Divider className="my-4" />
          <div>
            <div className="flex justify-between items-center">
              <Checkbox />
              <Image
                alt="HeroUI hero Image"
                className="h-[100px]"
                src="https://heroui.com/images/hero-card-complete.jpeg"
                width={100}
              />
              <div className="w-3/12">
                <div>
                  裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生阔腿卫裤
                </div>
                <div>颜色:【春秋款两件】黑色+白花灰;尺码:L</div>
                <div>备注</div>
              </div>
              <div>
                <div>总计 266</div>
                <div>单价 266</div>
                <div>国内运费 0.00</div>
              </div>
              <div>
                <NumberInput placeholder="Number" size="sm" />
              </div>
              <RiDeleteBin6Line />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
