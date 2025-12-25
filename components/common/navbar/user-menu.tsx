// /components/navbar/UserMenu.tsx
"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/store";
import { logoutCustomer } from "@/services";

export interface User {
  register: string;
  login: string;
  account: string;
  orders: string;
  logout: string;
}
interface UserMenuProps {
  texts: User;
}

export const UserMenu = ({ texts }: UserMenuProps) => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const logout = async () => {
    await logoutCustomer();
    [
      "user-storage",
      "wallet-storage",
      "services-storage",
      "billingAddress-storage",
    ].forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button
          className="bg-transparent"
          onPress={() => router.push("/register")}
        >
          {texts.register}
        </Button>
        <Button color="primary" onPress={() => router.push("/login")}>
          {texts.login}
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
          className="transition-transform"
          // description={user?.email}
          name={user?.nickName}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions">
        <DropdownItem key="1" onPress={() => router.push("/dashboard")}>
          {texts.account}
        </DropdownItem>
        <DropdownItem key="2" onPress={() => router.push("/dashboard/order")}>
          {texts.orders}
        </DropdownItem>
        <DropdownItem key="3">
          <button className="w-full text-left" onClick={logout}>
            {texts.logout}
          </button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
