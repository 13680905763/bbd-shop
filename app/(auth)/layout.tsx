"use client";
import { Button, Divider } from "@heroui/react";
import { usePathname } from "next/navigation";
import { IoCaretBackCircleOutline } from "react-icons/io5";
import NextLink from "next/link";
import { useSession, signIn } from "next-auth/react";

import { Logo } from "@/components/icons";

// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  console.log("status", status);

  // console.log("pathname", pathname);
  // if (process.env.NODE_ENV === "development") {
  //   console.log("开发环境");
  // } else if (process.env.NODE_ENV === "production") {
  //   console.log("生产环境");
  // } else if (process.env.NODE_ENV === "test") {
  //   console.log("测试环境");
  // }

  return (
    <main className=" flex h-[100vh]">
      <div className="flex-1 bg-[url('/login.webp')] bg-center bg-no-repeat bg-cover ">
        <NextLink href="/">
          <IoCaretBackCircleOutline className="m-20 w-14 h-14 cursor-pointer" />
        </NextLink>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[400px]  ">
          <Logo width={170} />

          <div className="rounded-lg bg-[#ffeee1] p-2 my-4 ">
            <div>公告</div>
            <div>劳动节 ，不耽误 --- 助您活力满满</div>
          </div>

          {children}

          {pathname !== "/forgetPsd" && (
            <>
              <Divider className="my-8" />
              <Button
                className="block w-full button-default"
                color="primary"
                size="lg"
                type="submit"
                variant="bordered"
                onPress={() =>
                  signIn("google", {
                    authorization: {
                      params: { prompt: "select_account" },
                    },
                  })
                }
              >
                使用Google账号66688
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
