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
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Form,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
  Image,
  Spinner,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoCart } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";
import {
  getGoodsId,
  getGoodsImageId,
  getUserInfo,
  logoutCustomer,
} from "@/services";
import { useUserStore } from "@/store";

export const Navbar = () => {
  const user = useUserStore((state) => state.user);

  const [inputValue, setInputValue] = useState("");
  const pathname = usePathname(); // 获取当前路径
  const prevPathRef = useRef(pathname);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false); // 是否正在上传
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // 上传成功的图片 URL 或 base64

  const [currentNav, setCurrentNav] = useState(pathname);
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    try {
      const res: any = await getGoodsImageId(file);

      if (res && res.length > 0) {
        const taobaoImageId = res.find(
          (item: any) => item.source === "TAOBAO",
        )?.imageId;
        const alibabaImageId = res.find(
          (item: any) => item.source === "1688",
        )?.imageId;

        if (taobaoImageId && alibabaImageId) {
          router.push(`/search?TAOBAO=${taobaoImageId}&1688=${alibabaImageId}`);
        }

        // 生成本地缩略图显示
        const reader = new FileReader();

        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("上传图片失败", error);
      addToast({ title: "上传失败，请重试", timeout: 1000, color: "danger" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const Search = async (e: any) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    let url: URL;

    try {
      url = new URL(data.url);
    } catch (err) {
      // 可选：展示错误提示
      addToast({
        title: "请输入有效的 URL",
        timeout: 1000,
        color: "danger",
      });

      return; // 终止后续逻辑
    }
    const res: any = await getGoodsId({ url });

    router.push(
      `/goods/${res.source}/${res.sourceProductId}`, // 目标路由
    );
    router.refresh();
    setInputValue("");
  };
  const logout = async () => {
    try {
      await logoutCustomer(); // 调用后端接口，带上 cookie
      localStorage.removeItem("user-storage");
      localStorage.removeItem("wallet-storage");
      localStorage.removeItem("services-storage");
      localStorage.removeItem("billingAddress-storage");
      window.location.reload();
    } catch (error) {}
  };
  const triggerUpload = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  useEffect(() => {
    setCurrentNav(pathname);
  }, [pathname]);

  useEffect(() => {
    // 获取一次用户信息
    getUserInfo().catch(() => {
      router.refresh();
    });
  }, []);
  useEffect(() => {
    const prevPath = prevPathRef.current;

    // 如果之前在 /search，且现在不是 /search，则重置上传状态
    if (prevPath.startsWith("/search") && !pathname.startsWith("/search")) {
      setUploadedImage(null);
      setUploading(false);
    }

    prevPathRef.current = pathname;
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
          <div className="flex  items-center">
            {uploading ? (
              <Spinner color="primary" size="sm" />
            ) : uploadedImage ? (
              <Image
                alt="Uploaded"
                className="w-[30px] h-[30px] cursor-pointer min-w-[30px]"
                radius="none"
                src={uploadedImage}
                onClick={triggerUpload}
              />
            ) : (
              <FaRegImage
                className="w-[30px] h-[30px] text-gray-400 cursor-pointer"
                onClick={triggerUpload}
              />
            )}
            {/* <Button
              isIconOnly
              color="primary"
              size="sm"
              type="submit"
              variant="light"
            >
              搜索
            </Button> */}
          </div>
        }
        labelPlacement="outside"
        name="url"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {/* 隐藏的上传输入框 */}
      <input
        ref={fileInputRef}
        hidden
        accept="image/*"
        type="file"
        onChange={handleImageUpload}
      />
    </Form>
  );

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
        className="hidden sm:flex basis-1/4 sm:basis-full"
        justify="end"
      >
        {/* <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem> */}
        <NavbarItem className="hidden lg:flex">
          {currentNav !== "/" ? searchInput : null}
        </NavbarItem>

        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <Button className="bg-transparent " size="lg">
              中文简体/CNY
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-2">
              <div className="my-4 mt-2">
                <p>语言</p>
                <div className="grid grid-cols-2 gap-5 my-4">
                  <Button className="button-default" radius="sm">
                    English
                  </Button>
                  <Button className="button-white" radius="sm">
                    Español
                  </Button>
                  <Button className="button-white" radius="sm">
                    Polski
                  </Button>
                  <Button className="button-white" radius="sm">
                    中文(简体)
                  </Button>
                </div>
              </div>
              <div className="my-4">
                <p>货币</p>
                <div className="grid grid-cols-2 gap-4 my-4">
                  <Button className="button-white" radius="sm">
                    USD
                  </Button>
                  <Button className="button-white" radius="sm">
                    EUR
                  </Button>
                  <Button className="button-white" radius="sm">
                    PLN
                  </Button>
                  <Button className="button-default" radius="sm">
                    CNY
                  </Button>
                </div>
              </div>
              <Button className="w-full" color="primary" radius="sm">
                提交
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {user ? (
          <>
            <Button
              isIconOnly
              className="bg-transparent px-0"
              size="sm"
              onPress={() => router.push("/dashboard/cart")}
            >
              <IoCart className="w-full  h-full" />
            </Button>
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
                <DropdownItem
                  key="new"
                  onPress={() => {
                    router.push("/dashboard");
                  }}
                >
                  我的账户
                </DropdownItem>
                <DropdownItem
                  key="new1"
                  onPress={() => {
                    router.push("/dashboard/order");
                  }}
                >
                  我的订单
                </DropdownItem>

                <DropdownItem key="copy">
                  <button className="w-full text-left" onClick={logout}>
                    退出账户
                  </button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <div className="flex gap-2">
            <Button
              className="bg-transparent"
              onPress={() => router.push("/register")}
            >
              注册
            </Button>
            <Button
              color="primary"
              radius="lg"
              onPress={() => router.push("/login")}
            >
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
