"use client";
import { Button, Divider } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoCaretBackCircleOutline } from "react-icons/io5";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslations } from "next-intl";

import { GoogleIcon, Logo } from "@/components/icons";
import { useGoogleLoginFlow } from "@/hook/business";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { login: googleLogin, isLoggingIn } = useGoogleLoginFlow();
  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "email profile openid",
    ux_mode: "popup",
    onSuccess: async (codeResponse) => {
      await googleLogin({
        authorizationCode: codeResponse.code,
        inviteCode: searchParams.get("inviteCode") || "",
      });
    },
  });

  return (
    <main className="flex h-[100vh]">
      <div className="flex-1 bg-[url('/images/authbg.webp')] bg-center bg-no-repeat bg-cover ">
        <button onClick={() => router.push("/")}>
          <IoCaretBackCircleOutline className="m-20 w-14 h-14 cursor-pointer" />
        </button>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[400px]">
          <Logo width={170} />
          <div className="rounded-lg bg-[#ffeee1] p-2 my-4 ">
            <div className="font-bold text-[#f0700c]">
              {t("oneStopService")}
            </div>
            <div>{t("slogan")}</div>
          </div>

          {children}
          {pathname !== "/forgetPsd" && (
            <>
              <Divider className="my-4" />
              <Button
                className="w-full bg-white border-1 border-default-200"
                isLoading={isLoggingIn}
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
