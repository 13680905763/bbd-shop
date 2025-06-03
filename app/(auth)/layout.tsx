"use client";
import { Button, Divider } from "@heroui/react";
import { usePathname } from "next/navigation";
import { IoCaretBackCircleOutline } from "react-icons/io5";
import NextLink from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

import { Logo } from "@/components/icons";
import { getgoogle } from "@/services/api/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  console.log("status", status);
  useEffect(() => {
    console.log("session", session);
    getgoogle({ ...session });
  }, [session]);

  return (
    <main className=" flex h-[100vh]">
      <div className="flex-1 bg-[url('/images/authbg.png')] bg-center bg-no-repeat bg-cover ">
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
                onPress={() => signIn("google")}
              >
                使用Google账号
              </Button>
              {/* <Button
                className="block w-full button-default"
                color="primary"
                size="lg"
                type="submit"
                variant="bordered"
                onPress={() => signIn("github")}
              >
                使用GitHub账号
              </Button> */}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
