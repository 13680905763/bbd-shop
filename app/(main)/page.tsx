"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

import {
  HomeAnnouncementBar,
  HomeImageLinks,
  HomeSearchForm,
  HomeServiceCards,
  HomeStepFlow,
} from "./components";

import { FullscreenLoader } from "@/components/ui";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
const hotProduct = [
    {
        "source": "1688",
        "sourceProductId": "571759123924",
        "title": "*Thickened 34 * 74 adult jacquard large grid cotton towel gift for family daily use",
        "imageUrl": "https://cbu01.alicdn.com/img/ibank/O1CN017tEB1S1ljddxNR9H7_!!3375644855-0-cib.jpg",
        "price": "1.88"
    },
    {
        "source": "TAOBAO",
        "sourceProductId": "895734825394",
        "title": "2025 New Foreign Trade Original Order Tail Goods Outdoor Hiking Shoes Mountaineering Shoes Anti slip Off road Shoes Men's and Women's Casual Sports Shoes",
        "imageUrl": "https://img.alicdn.com/bao/uploaded/i2/271697359/O1CN015FuYNd24ETjXPaSYU_!!271697359.jpg",
        "price": "14.03"
    },
    {
        "source": "1688",
        "sourceProductId": "904389571229",
        "title": "White cuffs T-shirt for men's summer fitness sports, shoulder length short sleeved, heavy American style, small neckline, bottom layer shirt",
        "imageUrl": "https://cbu01.alicdn.com/img/ibank/O1CN01np9U2h1edVKCljQe2_!!2215622483894-0-cib.jpg",
        "price": "3.14"
    },
    {
        "source": "1688",
        "sourceProductId": "920244180499",
        "title": "Garbage bin, household large capacity, living room, toilet, bedroom, kitchen, office, with pressure ring, desktop, paper basket",
        "imageUrl": "https://cbu01.alicdn.com/img/ibank/O1CN01ficEnN2AxiW0DTIp7_!!2219494688270-0-cib.jpg",
        "price": "6.29"
    },
    {
        "source": "TAOBAO",
        "sourceProductId": "702311370838",
        "title": "Widesea camping stove accessories, circular all inclusive outdoor wind deflector, one-piece portable aluminum wind deflector",
        "imageUrl": "https://img.alicdn.com/bao/uploaded/img/ibank/O1CN0134mkgV1HazcwgIgNA_!!2210399280775-0-cib.jpg",
        "price": "8.67"
    },
    {
        "source": "TAOBAO",
        "sourceProductId": "684169687089",
        "title": "Indoor fitness shoes, women's yoga shoes, silent soft soled gym treadmill shoes, men's special shoes, five finger sports shoes",
        "imageUrl": "https://img.alicdn.com/bao/uploaded/i2/4244344516/O1CN01Lw6kcq1jENPWcFhPp_!!4244344516.jpg",
        "price": "8.04"
    },
    {
        "source": "1688",
        "sourceProductId": "907847648961",
        "title": "Real time shooting of the popular heavyweight shoulder American short sleeved retro small collar threaded splicing T-shirt for men H1078 special 520",
        "imageUrl": "https://cbu01.alicdn.com/img/ibank/O1CN01cuotpA1zY6aY2pjkv_!!2201227326725-0-cib.jpg",
        "price": "4.72"
    },
    {
        "source": "TAOBAO",
        "sourceProductId": "675553695681",
        "title": "Export Mini Fascia Gun Muscle Massage Grab Electric Relaxation Professional Muscle Mask Mini Neck Mask Gun",
        "imageUrl": "https://img.alicdn.com/bao/uploaded/i3/37440008/O1CN01uNJNzg1BvhvPfJtgY_!!37440008.jpg",
        "price": "20.51"
    }
]
export default function Home() {
  const [isLoading, setIsLoading] = useState(false); // 🔹 loading 状态
  const t = useTranslations("home");
  const router = useRouter();
  return (
    <div className="pb-12">
      {isLoading && <FullscreenLoader />}
      <section className="flex bg-cover bg-no-repeat bg-[url('/images/page/home.jpg')]  -mt-[64px] w-full
    h-[730px]
    bg-[url('/images/page/home.jpg')]
    bg-cover
    bg-center
    bg-no-repeat">
        <div className="container mx-auto ">
          <div className="max-w-3xl mt-[200px] mb-10">
            <div className="text-7xl text-black tracking-tighter font-bold text-white flex flex-col  mb-20">
              <p className="text-black">{t("line1")}</p>
              <p className="text-black">{t("line2")}</p>
            </div>

            <HomeSearchForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>
          <HomeStepFlow />
        </div>
      </section>
      {/* 公告条 */}
      <HomeAnnouncementBar />
      <div className="container mx-auto">
        <HomeImageLinks />
        <h2 className="text-4xl  font-bold text-center my-10">
          {t("serviceTitle")}
        </h2>
        <HomeServiceCards />
        <h2 className="text-4xl  font-bold text-center my-10">
          Hot Products
        </h2>
        <div className=" container mx-auto">
          <div className="flex justify-evenly flex-wrap ">
            {hotProduct.map((item: any, index: number) => (
              <Card
              className="w-[22%] rounded-lg mt-4"
                key={index}
                isPressable
                radius="none"
                onPress={() =>
                  router.push(
                    `/goods/${item.source}/${item.sourceProductId}`,
                  )
                }
              >
                <CardBody className="overflow-visible p-0">
                  <Image
                    alt={item.sourceProductId}
                    className="w-full object-fill h-[300px]"
                    radius="none"
                    referrerPolicy="no-referrer"
                    src={item.imageUrl}
                    width="100%"

                  />

                </CardBody>
                <CardFooter className="text-small">
                  <div className="text-left">
                    <b className="line-clamp-2">{item.title}</b>
                    <p className="text-money-lg">${item.price}</p>
                  </div>

                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
