// /components/home/ImageLinks.tsx
"use client";

import React from "react";
import { Image } from "@heroui/react";

export default function HomeImageLinks() {
  const links = [
    {
      key: "link1",
      href: "https://discord.gg/tERd3KZRMh",
      src: "/images/page/tab1.png",
    },
    {
      key: "link2",
      href: "/dashboard",
      src: "/images/page/tab2.png",
    },
    {
      key: "link3",
      href: "/estimation",
      src: "/images/page/tab3.png",
    },
    {
      key: "link4",
      href: "/register",
      src: "/images/page/tab4.png",
    },
  ];

  return (
    <div className={"mt-[20px] flex justify-evenly"}>
      {links.map((link, index) => (
        <a key={index} href={link.href}>
          <Image
            alt={link.key ?? "HeroUI hero Image"}
            src={link.src}
            width={350}
          />
        </a>
      ))}
    </div>
  );
}
