// /components/home/ImageLinks.tsx
"use client";

import React from "react";
import { Image } from "@heroui/react";

export interface LinkItem {
  href: string;
  src: string;
  alt?: string;
  width?: number;
}

interface ImageLinksProps {
  links: LinkItem[];
  className?: string;
}

export default function HomeImageLinks({ links, className }: ImageLinksProps) {
  return (
    <div className={`mt-[20px] flex justify-evenly ${className ?? ""}`}>
      {links.map((link, index) => (
        <a key={index} href={link.href}>
          <Image
            alt={link.alt ?? "HeroUI hero Image"}
            src={link.src}
            width={link.width ?? 350}
          />
        </a>
      ))}
    </div>
  );
}
