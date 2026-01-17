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
import { UserMenu } from "./user-menu";

import { Logo } from "@/components/icons";

export const Navbar = () => {
  const t = useTranslations("components.navbar");
  const pathname = usePathname(); // 获取当前路径
  const router = useRouter();

  const [currentNav, setCurrentNav] = useState(pathname);

  const links = [
    {
      label: t("links.home.label"),
      href: "/",
    },
    {
      label: t("links.forwarding.label"),
      href: "/forwarding",
    },
    {
      label: t("links.estimation.label"),
      href: "/estimation",
    },
    {
      label: t("links.help.label"),
      href: "/help",
    },
    {
      label: t("links.promotion.label"),
      href: "/dashboard/promotion",
    },
  ];

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCurrentNav(pathname);
  }, [pathname]);

  const isHome = pathname === "/";
  const navBgClass = isHome
    ? isScrolled
      ? "bg-white shadow-sm"
      : "bg-transparent"
    : "bg-white shadow-sm";

  return (
    <HeroUINavbar
      className={`${navBgClass} transition-all duration-300`}
      isBlurred={false}
      maxWidth="full"
      position="sticky"
    >
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
        <UserMenu />
      </NavbarContent>
    </HeroUINavbar>
  );
};
