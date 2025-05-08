"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import NextLink from "next/link";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Form,
  User,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";

export const Navbar = () => {
  const pathname = usePathname(); // 获取当前路径
  const router = useRouter();

  const [currentNav, setCurrentNav] = useState(pathname);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    console.log(6666);
    router.push("/goods"); // 跳转到购物车页面

    // setIsLoading(true);

    // const data = Object.fromEntries(new FormData(e.currentTarget));
    // const result = await callServer(data);

    // setErrors(result.errors);
    // setIsLoading(false);
  };

  useEffect(() => {
    setCurrentNav(pathname);
  }, [pathname]);
  const searchInput = (
    <Form className="w-full max-w-xs" onSubmit={onSubmit}>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={<Button type="submit">123</Button>}
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
    </Form>
  );

  return (
    <HeroUINavbar isBordered maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo width={120} />
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem
              key={item.href}
              className="data-[active=true]:text-[#f0700c] "
              isActive={currentNav === item.href}
            >
              <NextLink
                // className={clsx(
                //   linkStyles({ color: "foreground" }),
                //   "data-[active=true]:text-[#f0700c] data-[active=true]:font-medium"
                // )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          {currentNav !== "/" ? searchInput : null}
        </NavbarItem>
        <Dropdown>
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: "https://ww2.sinaimg.cn/mw690/006faMndly1htwlunnhn5j30zj0zjjv8.jpg",
              }}
              className="transition-transform"
              description="1777487490@qq.com"
              name="Bryant"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">
              <NextLink href="/dashboard">个人中心</NextLink>
            </DropdownItem>
            <DropdownItem key="copy">
              <NextLink href="/login">退出账户</NextLink>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
