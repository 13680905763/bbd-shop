"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Divider } from "@heroui/react";

import { siteConfig } from "@/config/site";
export default function DashBoardlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentItem, setCurrentItem] = useState("");
  const pathname = usePathname(); // 获取当前路径

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);

    if (pathParts[0] === "dashboard" && pathParts[1]) {
      setCurrentItem(pathParts[1]);
    } else {
      setCurrentItem("");
    }
  }, [pathname]);

  return (
    <div className="bg-[#f8f8f8]">
      <section className="container mx-auto max-w-[1440px] py-6 flex ">
        <ul className="p-5  min-w-60 rounded-lg bg-[#fff]">
          {siteConfig.menuItem.map((item, index) => {
            if (item.type) {
              return <Divider key={index} className="my-4" />;
            }

            return (
              <NextLink
                key={item.title}
                className={`${currentItem == item.key ? " !text-[#fff]" : ""} `}
                href={`/dashboard/${item.key}`}
              >
                <li
                  key={item.title}
                  className={`h-10 cursor-pointer  flex  items-center p-2 my-2 ${currentItem == item.key ? "bg-[#f0700c] rounded-lg" : "hover:bg-[#f5f5f5]"}`}
                  title={item.title}
                >
                  {item.title}
                </li>
              </NextLink>
            );
          })}
        </ul>
        <div className="mx-5 flex-1 rounded-lg bg-[#fff] p-5">{children}</div>
      </section>
    </div>
  );
}
