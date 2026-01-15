"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  User,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { logoutCustomer } from "@/services";
import { useUserInfo } from "@/hook";
import { queryClient } from "@/lib/react-query";


export const UserMenu = () => {
  const t = useTranslations("components.navbar.dropdown");
  const router = useRouter();

  const { data: user, isLoading } = useUserInfo();
  const logout = async () => {
    await logoutCustomer();
    queryClient.clear();
    router.replace("/");
  };
  if (isLoading) return <Skeleton className="flex rounded-full w-12 h-12" />;
  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="light" onPress={() => router.push("/register")}>
          {t("register")}
        </Button>
        <Button color="primary" onPress={() => router.push("/login")}>
          {t("login")}
        </Button>
      </div>
    );
  }
  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{ isBordered: true, src: user?.avatarUrl }}
          name={user?.nickName}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions">
        <DropdownItem key="account" onPress={() => router.push("/dashboard")}>
          {t("account")}
        </DropdownItem>
        <DropdownItem key="orders" onPress={() => router.push("/dashboard/order")}>
          {t("orders")}
        </DropdownItem>
        <DropdownItem key="logout" onPress={logout}>
          {t("logout")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
