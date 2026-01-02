"use client";

import React from "react";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";

export default function FavoritesPage() {
  const list = [
    {
      title: "加大款日本硬币夹收纳盒日币零钱包日式日圆神器整理零钱必旅游备",
      img: "https://img.alicdn.com/bao/uploaded/i4/2605889239/O1CN01B7ANiO2I7WHGwZmGS_!!2605889239.jpg",
      price: "$ 1.65",
    },
  ];

  return (
    <div>
      <div className="my-5">
        <span className="font-bold mr-5">全部商品</span> <span>管理</span>
      </div>
      <div className="gap-5 grid grid-cols-2 sm:grid-cols-5">
        {list.map((item, index) => (
          <Card
            key={index}
            isPressable
            shadow="sm"
            //   onPress={() => console.log('item pressed')}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                alt={item.title}
                className="w-full object-fill h-[200px]"
                radius="lg"
                shadow="sm"
                src={item.img}
                width="100%"
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <div className="text-left">
                <b className="line-clamp-2">{item.title}</b>
                <p className="text-money-lg">{item.price}</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
