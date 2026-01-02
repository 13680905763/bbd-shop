"use client";
import { Button, Divider } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { IoCaretBackCircleOutline } from "react-icons/io5";
import NextLink from "next/link";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslations } from "next-intl";

import { GoogleIcon, Logo } from "@/components/icons";
import { loginWithGoogleNew } from "@/services";
import { handleAuthSuccess } from "@/lib/auth-handler";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("auth");

  const pathname = usePathname();
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "email profile openid",
    onSuccess: async (codeResponse) => {
      try {
        await loginWithGoogleNew(codeResponse.code);

        await handleAuthSuccess();
        router.push("/");
      } catch {}
    },
  });

  return (
    <main className=" flex h-[100vh]">
      <div className="flex-1 bg-[url('/images/authbg.webp')] bg-center bg-no-repeat bg-cover ">
        <NextLink href="/">
          <IoCaretBackCircleOutline className="m-20 w-14 h-14 cursor-pointer" />
        </NextLink>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[400px]  ">
          <Logo width={170} />

          <div className="rounded-lg bg-[#ffeee1] p-2 my-4 ">
            <div className="font-bold text-[#f0700c]">
              {t("oneStopService")}
            </div>
            <div className="">{t("slogan")}</div>
          </div>

          {children}

          {pathname !== "/forgetPsd" && (
            <>
              <Divider className="my-4" />

              <Button
                className="w-full bg-white border-1 border-default-200"
                startContent={<GoogleIcon />}
                variant="flat"
                onPress={() => handleGoogleLogin()}
              >
                Google
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
