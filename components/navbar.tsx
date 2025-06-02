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
import { getlogout } from "@/services/api/auth";
import { useUser } from "@/services/hooks/useUser";

export const Navbar = () => {
  const { user, isLoading, isError } = useUser();

  const pathname = usePathname(); // 获取当前路径
  const router = useRouter();

  const [currentNav, setCurrentNav] = useState(pathname);

  /**
   * 从 1688 商品链接中提取 offerId
   * @param url 商品详情页链接
   * @returns 提取到的 offerId 或 null
   */
  function extractOfferId(parsedUrl: any): string | null {
    try {
      const pathname = parsedUrl.pathname;

      // 匹配 /offer/865930740519.html 中的 ID
      const match = pathname.match(/\/offer\/(\d+)\.html/);

      return match ? match[1] : null;
    } catch (err) {
      console.error("无效的 URL:", err);

      return null;
    }
  }
  const Search = (e: any) => {
    console.log(666);

    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    const url = new URL(data.url);

    console.log(data, url);
    const source =
      data.url.includes("item.taobao.com") ||
      data.url.includes("detail.tmall.com")
        ? "TAOBAO"
        : data.url.includes("detail.1688.com/")
          ? "1688"
          : "weidian";
    const sourceproductId = url.searchParams.get("id") || extractOfferId(url);

    console.log(source, sourceproductId);
    //  source: "TAOBAO",
    //     sourceproductId: "788110260427",
    router.push(
      `/goods/${source}/${sourceproductId}`, // 目标路由
    );
  };
  const logout = async () => {
    try {
      const res: any = await getlogout(); // 调用后端接口，带上 cookie

      res.success && router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCurrentNav(pathname);
  }, [pathname]);
  const searchInput = (
    <Form className="w-full max-w-xs" onSubmit={Search}>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={
          <Button
            isIconOnly
            color="primary"
            size="sm"
            type="submit"
            variant="light"
          >
            搜索
          </Button>
        }
        labelPlacement="outside"
        name="url"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
    </Form>
  );

  console.log(user);

  return (
    <HeroUINavbar isBordered maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo width={170} />
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-6 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem
              key={item.href}
              className="data-[active=true]:text-[#f0700c] text-lg"
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
        {/* <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem> */}
        <NavbarItem className="hidden lg:flex">
          {currentNav !== "/" ? searchInput : null}
        </NavbarItem>
        {user ? (
          <Dropdown>
            <DropdownTrigger>
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  src: user?.avatarUrl,
                }}
                className="transition-transform"
                description={user?.email}
                name={user?.name}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="new">
                <NextLink href="/dashboard">我的账户</NextLink>
              </DropdownItem>
              <DropdownItem key="new1">
                <NextLink href="/dashboard/order">我的订单</NextLink>
              </DropdownItem>

              <DropdownItem key="copy">
                <button className="w-full text-left" onClick={logout}>
                  退出账户
                </button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex gap-2">
            <Button
              className="button-default"
              onPress={() => router.push("/register")}
            >
              注册
            </Button>
            <Button color="primary" onPress={() => router.push("/login")}>
              登录
            </Button>
          </div>
        )}
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
