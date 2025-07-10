"use client";
import React, { useMemo, useState } from "react";
import { Button, Checkbox, Divider } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

import OrderCard from "./order-card";

import Progress from "@/components/common/progress";
import { createOrderByCart, createOrderByProduct } from "@/services";
import { useOrderPreview } from "@/hook";
import {
  createOrderPreviewKeyByCartParams,
  createOrderPreviewKeyByProductParams,
} from "@/types";
export type Product = {
  id: string;
  productTitle: string;
  sku: {
    propName_valueName: string;
  };
  skuPicUrl: string;
  remark?: string;
  totalPrice: number;
  price: number;
  postFee: number;
  quantity: number;
  source: string;
  sourceProductId: string;
};

export type Shop = {
  shopId: string;
  shopName: string;
  cartList: Product[];
};

export default function SubmitOrder() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const type = searchParam.get("type") as "cart" | "product";
  const key = searchParam.get("key") as string;
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { data, isLoading, isError } = useOrderPreview(type, key);

  console.log("data", data, isLoading);

  const handleCartSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (type === "cart") {
      const bizCode = await createOrderByCart(
        data?.param as createOrderPreviewKeyByCartParams,
      );

      router.push("/order/pay-order/" + bizCode);
    } else if (type === "product") {
      const bizCode = await createOrderByProduct(
        data?.param as createOrderPreviewKeyByProductParams,
      );

      router.push("/order/pay-order/" + bizCode);
    }
    setSubmitting(false);
  };
  const togglePrice = useMemo(() => {
    return data?.orderList
      ?.flatMap((order: any) => order.products) // 拍平所有商品
      ?.reduce((sum: any, item: any) => sum + item?.price * item.quantity, 0); // 累加价格
  }, [data]);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>出错了</div>;

  return (
    <div className="container mx-auto bg-[#fff]  p-4 py-6">
      <div className="">
        <Progress
          currentStep={0}
          steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
        />
      </div>
      <div className="text-title">确认产品信息</div>
      <div>
        <div className="flex flex-col gap-4">
          {data?.orderList?.map((order: any) => (
            <OrderCard key={order?.shopName} order={order} />
          ))}
        </div>

        <div className="text-right mt-5 p-4">
          <p className="text-sm text-[#fbbd8a] ">
            <span className="hover:text-[#f0700c] cursor-pointer">
              《禁运物品声明》
            </span>
            <span className="hover:text-[#f0700c] cursor-pointer">
              《服务条款和用户管理》
            </span>
            <span className="hover:text-[#f0700c] cursor-pointer">
              《退换货服务》
            </span>
            <span className="hover:text-[#f0700c] cursor-pointer">
              《免责声明》
            </span>
          </p>
          <Checkbox color="primary" size="sm">
            <span className="text-[#676969]">
              我已阅读并同意BBDbuy的免责声明
            </span>
          </Checkbox>
          <div className="card-tip text-left !mb-0">
            注意：付款完成后，您需要在包裹到达并存放在仓库后提交包裹进行国际递送。
          </div>
        </div>
        <Divider className="mb-4" />
        <div className="flex justify-end items-center gap-4 mb-2">
          <div className="text-[#3d3d3d] text-sm flex items-center gap-1">
            应付金额:
          </div>
          <p className="text-price-xl"> {togglePrice}</p>
          <Button
            className="w-[300px]"
            color="primary"
            size="lg"
            onPress={handleCartSubmit}
          >
            提交
          </Button>
        </div>
      </div>
    </div>
  );
}
