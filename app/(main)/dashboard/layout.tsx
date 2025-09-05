"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { useTranslations } from "next-intl";

import { useServices } from "@/hook";

type MenuItem =
  | { type: "divider"; key: string }
  | { key: string; label: string; href: string; type?: undefined };

interface DashBoardLayoutProps {
  children: React.ReactNode;
}

export default function DashBoardlayout({ children }: DashBoardLayoutProps) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  const menuItems = t.raw("LayoutMenu") as MenuItem[];

  useServices();

  const currentItem = useMemo(() => {
    const pathParts = pathname.split("/").filter(Boolean);

    return pathParts[0] === "dashboard" ? (pathParts[1] ?? "") : "";
  }, [pathname]);

  return (
    <div className="bg-[#f8f8f8]">
      <section className="container mx-auto max-w-[1440px] py-6 flex">
        <div>
          <ul className="p-5 min-w-60 rounded-lg bg-[#fff] sticky top-20">
            {menuItems.map((item) =>
              item.type === "divider" ? (
                <li key={`divider-${item.key}`} className="my-4 border-t" />
              ) : (
                <li
                  key={item.key}
                  className={`h-10 flex items-center my-2 rounded-lg cursor-pointer ${
                    currentItem === item.key
                      ? "bg-[#f0700c] text-white"
                      : "hover:bg-[#f5f5f5]"
                  }`}
                  title={item.label}
                >
                  <NextLink
                    className="w-full h-full flex items-center p-2"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="mx-5 flex-1 rounded-lg bg-[#fff] p-5 pt-0">
          {children}
        </div>
      </section>
    </div>
  );
}
