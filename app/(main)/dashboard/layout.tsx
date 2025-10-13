"use client";

import React, { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { IoChevronDown } from "react-icons/io5";

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
  const [open, setOpen] = useState(true);

  const menuItems = t.raw("LayoutMenu") as MenuItem[];

  useServices();

  const currentItem = useMemo(() => {
    const pathParts = pathname.split("/").filter(Boolean);

    // console.log("pathParts", pathParts);
    if (pathParts[2]) return pathParts[2];

    return pathParts[0] === "dashboard" ? (pathParts[1] ?? "") : "";
  }, [pathname]);

  // console.log("currentItem", currentItem);

  // if (!t) return <FullscreenLoader />;

  return (
    <div className="bg-[#f8f8f8]">
      <section className="container mx-auto max-w-[1440px] py-6 flex">
        <div>
          <ul className="p-5 min-w-60 rounded-lg bg-[#fff] sticky top-20">
            {menuItems.map((item: any) => {
              if (item.type === "divider") {
                return <li key={item.key} className="my-4 border-t" />;
              }

              if (item.type === "accordion") {
                return (
                  <li key={item.key} className="my-2">
                    <div
                      className="h-10 flex items-center px-2 rounded-lg cursor-pointer hover:bg-[#f5f5f5]"
                      role="button"
                      onClick={() => setOpen(!open)} // 控制展开
                    >
                      <span className="flex-1">{item.label}</span>
                      <IoChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                          open === item.key ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {open && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {item.children?.map((child: any) => (
                          <li
                            key={child.key}
                            className={`h-10 flex items-center px-2 rounded  ${
                              currentItem === child.key
                                ? "bg-[#f0700c] text-white"
                                : "hover:bg-[#f5f5f5]"
                            }`}
                          >
                            <NextLink
                              className="w-full h-full flex items-center p-2"
                              href={child.href}
                            >
                              {child.label}
                            </NextLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
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
              );
            })}
          </ul>
        </div>

        <div className="mx-5 flex-1 rounded-lg bg-[#fff] p-5 pt-0">
          {children}
        </div>
      </section>
    </div>
  );
}
