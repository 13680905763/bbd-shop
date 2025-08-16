"use client";
import { Divider } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoCaretBackCircleOutline } from "react-icons/io5";
import NextLink from "next/link";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { Logo } from "@/components/icons";
import { loginWithGoogle } from "@/services";
import { handleAuthSuccess } from "@/lib/auth-handler";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoginWithGoogle = async (
    credentialResponse: CredentialResponse,
  ) => {
    const credential = credentialResponse.credential;

    try {
      await loginWithGoogle(credential as string);

      await handleAuthSuccess();
      router.push("/");
    } catch {}
  };

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
            <div>公告</div>
            <div>劳动节 ，不耽误 --- 助您活力满满</div>
          </div>

          {children}

          {pathname !== "/forgetPsd" && (
            <>
              <Divider className="my-4" />

              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
