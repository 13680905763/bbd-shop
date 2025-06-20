"use client";
import { Button, Tab, Tabs, useDisclosure } from "@heroui/react";
import React from "react";

import OrderItem from "./order-item";

import CommonGoodsItem from "@/components/common-goods-item";
import Progress from "@/components/common/progress";
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

const a = [
  {
    cartList: [
      {
        createTime: "2025-06-04 18:39:55",
        customerId: "1",
        id: "48",
        picUrl:
          "https://img.alicdn.com/bao/uploaded/i3/2376087644/O1CN01PGccxl26L0XTI5AvF_!!2376087644.jpg",
        postFee: 0,
        price: 5000,
        productId: "9",
        productSkuId: "31",
        productTitle:
          "海外订单尾货~剪标撤回外贸潮流痞帅短袖T恤男女同款百搭宽松上衣",
        productUrl: "https://item.taobao.com/item.htm?id=855863456744",
        quantity: 1,
        remark: "demoData",
        shopId: "116636910",
        shopName: "VSFRR SKY IDCCO",
        sku: {
          propId_valueId: "1627207:380850593",
          propName_valueName: "颜色分类:白色XXL",
        },
        skuPicUrl:
          "https://img.alicdn.com/bao/uploaded/i2/2376087644/O1CN01vMge8x26L0XSEtPMe_!!2376087644.jpg",
        source: "TAOBAO",
        sourceMpId: "4096257174111208",
        sourceMpSkuId: "23990356503528",
        sourceProductId: "855863456744",
        sourceSkuId: "5828221219298",
        status: 1,
        totalPrice: 5000,
        updateTime: "2025-06-04 18:39:55",
      },
      {
        createTime: "2025-06-04 19:20:05",
        customerId: "1",
        id: "51",
        picUrl:
          "https://img.alicdn.com/bao/uploaded/i3/2376087644/O1CN01PGccxl26L0XTI5AvF_!!2376087644.jpg",
        postFee: 0,
        price: 5000,
        productId: "9",
        productSkuId: "34",
        productTitle:
          "海外订单尾货~剪标撤回外贸潮流痞帅短袖T恤男女同款百搭宽松上衣",
        productUrl: "https://item.taobao.com/item.htm?id=855863456744",
        quantity: 1,
        shopId: "116636910",
        shopName: "VSFRR SKY IDCCO",
        sku: {
          propId_valueId: "1627207:35962878",
          propName_valueName: "颜色分类:白色L",
        },
        skuPicUrl:
          "https://img.alicdn.com/bao/uploaded/i2/2376087644/O1CN01vMge8x26L0XSEtPMe_!!2376087644.jpg",
        source: "TAOBAO",
        sourceMpId: "4096257174111208",
        sourceMpSkuId: "23990356501480",
        sourceProductId: "855863456744",
        sourceSkuId: "5828221219296",
        status: 1,
        totalPrice: 5000,
        updateTime: "2025-06-04 19:20:05",
      },
    ],
    shopId: "116636910",
    shopName: "创建时间: 2025-04-26 03:21:07 订单号: CNF48892882637667",
  },
  {
    cartList: [
      {
        createTime: "2025-06-04 16:54:42",
        customerId: "1",
        id: "44",
        picUrl:
          "https://img.alicdn.com/bao/uploaded/i1/2215124709177/O1CN010ifo2p2Hf7jixNpYy_!!2215124709177.jpg",
        postFee: 0,
        price: 32800,
        productId: "8",
        productSkuId: "27",
        productTitle:
          "ElectronicNomad水洗大师美式可爱卡通Mega Man休闲210克短袖T恤",
        productUrl: "https://item.taobao.com/item.htm?id=753636500587",
        quantity: 8,
        remark: "啊啊√嗄高5 ",
        shopId: "422959361",
        shopName: "ElectronicNomad 水洗大师",
        sku: {
          propId_valueId: "1627207:28320;20509:28317",
          propName_valueName: "颜色:白色 210g;尺码:XL",
        },
        skuPicUrl:
          "https://img.alicdn.com/bao/uploaded/i1/2215124709177/O1CN010ifo2p2Hf7jixNpYy_!!2215124709177.jpg",
        source: "TAOBAO",
        sourceMpId: "2048292428750955",
        sourceMpSkuId: "6409896850539",
        sourceProductId: "753636500587",
        sourceSkuId: "5199275453160",
        status: 1,
        totalPrice: 262400,
        updateTime: "2025-06-04 18:01:30",
      },
    ],
    shopId: "422959361",
    shopName: "创建时间: 2025-04-26 03:21:07 订单号: CNF48892882637667",
  },
];

export default function OrderPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const renderCell = React.useCallback((rows: any, columnKey: any) => {
    const cellValue = rows[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button onPress={onOpen}>查看详情</Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="flex w-full flex-col">
      <div className="mt-5">
        <Progress
          currentStep={1}
          steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
        />
      </div>
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 ",
          cursor: "w-full bg-[#f0700c]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#f0700c]",
        }}
        color="primary"
        variant="underlined"
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <span>全部</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            {a.map((shop: any) => (
              <OrderItem key={shop.shopId} shop={shop} />
            ))}
            <CommonGoodsItem
              createdAt="2025-04-26 03:21:07"
              items={[
                {
                  imageUrl: "https://heroui.com/images/hero-card-complete.jpeg",
                  title:
                    "裤子男款夏季男裤灰色薄款直筒裤男士宽松休闲运动裤男生阔腿卫裤",
                  specs: "颜色: 黑色+白花灰; 尺码: L",
                  remark: "",
                  quantity: 123,
                  unitPrice: 266,
                  totalPrice: 266,
                  domesticShipping: 0,
                },
              ]}
              orderId="CNF48892882637667"
              status="未支付"
            />
          </div>
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>未支付</span>
            </div>
          }
        >
          312
        </Tab>
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <span>已支付</span>
            </div>
          }
        >
          31231
        </Tab>
      </Tabs>
    </div>
  );
}
