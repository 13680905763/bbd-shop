"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoCart } from "react-icons/io5";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";

import { SearchBar } from "./search-bar";
import LanguageCurrencySelector from "./language-currency-selector";
import { User, UserMenu } from "./user-menu";

import { Logo } from "@/components/icons";
import { getUserInfo } from "@/services";
interface NavLink {
  key: string;
  label: string;
  href: string;
}
export const Navbar = () => {
  const t = useTranslations("Components.Navbar");
  const pathname = usePathname(); // 获取当前路径
  const router = useRouter();

  const [currentNav, setCurrentNav] = useState(pathname);

  const links = t.raw("Links") as NavLink[];

  useEffect(() => {
    setCurrentNav(pathname);
  }, [pathname]);

  useEffect(() => {
    // 获取一次用户信息
    getUserInfo().catch(() => {
      router.refresh();
    });
  }, []);

  return (
    <HeroUINavbar isBordered maxWidth="full" position="sticky">
      <NavbarContent justify="start">
        <button className="cursor-pointer" onClick={() => router.push("/")}>
          <Logo width={170} />
        </button>
        <ul className="flex gap-6  ml-2">
          {links.map((item) => (
            <NavbarItem
              key={item.label}
              className={`text-lg cursor-pointer ${
                currentNav === item.href ? "text-[#f0700c]" : ""
              }`}
              onClick={() => router.push(item.href)}
            >
              {item.label}
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent justify="end">
        {currentNav !== "/" ? <SearchBar /> : null}
        <LanguageCurrencySelector />
        <Button
          isIconOnly
          className="bg-transparent px-0"
          size="sm"
          onPress={() => router.push("/dashboard/cart")}
        >
          <IoCart className="w-full h-full" />
        </Button>
        <UserMenu texts={t.raw("texts.User") as User} />
      </NavbarContent>
    </HeroUINavbar>
  );
};
