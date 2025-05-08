"use client";
import { Card, CardBody, Tab, Tabs, Image, CardFooter } from "@heroui/react";
import React from "react";

import { priceFont } from "@/components/primitives";

export default function SearchPage() {
  const list = [
    {
      title: "ElectronicNomad水洗大师美式可爱卡通Mega Man休闲210克短袖T恤",
      img: "https://img.alicdn.com/bao/uploaded/i1/2215124709177/O1CN010ifo2p2Hf7jixNpYy_!!2215124709177.jpg",
      price: "$ 19.89",
    },
    {
      title:
        "加大款日本硬币夹收纳盒日币零钱包日式日圆神器整理零钱收纳盒日币零钱包日式日圆神器整必旅游备",
      img: "https://img.alicdn.com/bao/uploaded/i4/2605889239/O1CN01B7ANiO2I7WHGwZmGS_!!2605889239.jpg",
      price: "$ 1.65",
    },

    {
      title: "拖鞋男款夏季外穿2024新款潮流一字拖户外运动耐磨室沙滩防滑凉拖",
      img: "https://img.alicdn.com/bao/uploaded/i4/1806717375/O1CN01q5SQNb24LnorJBLM7_!!0-item_pic.jpg",
      price: "$7.50",
    },
    {
      title: "优衣库C系列合作款男女装宽松连帽卫衣长袖运动T恤475379 479945",
      img: "https://img.alicdn.com/bao/uploaded/i1/196993935/O1CN0110cx9T1ewHZNR6TmO_!!196993935.jpg",
      price: "$10.00",
    },
    {
      title: "优衣库男女装华夫格亨利领套头衫长袖T恤纯色休闲475353 469924",
      img: "https://img.alicdn.com/bao/uploaded/i3/196993935/O1CN01WzOj2u1ewHZEPOLsu_!!196993935.jpg",
      price: "$12.20",
    },
  ];

  return (
    <div className="container mx-auto my-10">
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#f0700c]",
            tab: "max-w-fit px-0 h-12 text-2xl",
            tabContent: "group-data-[selected=true]:text-[#f0700c]",
          }}
          color="primary"
          variant="underlined"
        >
          <Tab
            key="photos"
            title={
              <div className="flex items-center space-x-2">
                <span>taobao</span>
              </div>
            }
          >
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
                      className="w-full object-cover h-[300px]"
                      radius="lg"
                      shadow="sm"
                      src={item.img}
                      width="100%"
                    />
                  </CardBody>
                  <CardFooter className="text-small ">
                    <div className="text-left">
                      <b className=" line-clamp-2 ">{item.title}</b>
                      <p className={priceFont()}>{item.price}</p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Tab>
          <Tab
            key="music"
            title={
              <div className="flex items-center space-x-2">
                <span>1688 </span>
              </div>
            }
          >
            312
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
