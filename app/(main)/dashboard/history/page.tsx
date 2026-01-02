"use client";
import React from "react";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
export default function HistoryPage() {
  const list = [
    {
      title: "ElectronicNomad水洗大师美式可爱卡通Mega Man休闲210克短袖T恤",
      img: "https://img.alicdn.com/bao/uploaded/i1/2215124709177/O1CN010ifo2p2Hf7jixNpYy_!!2215124709177.jpg",
      price: "$ 19.89",
    },
  ];

  return (
    <div>
      <div className="my-5">
        <span className="font-bold mr-5">浏览历史</span> <span>管理</span>
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
