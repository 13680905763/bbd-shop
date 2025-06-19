"use client";
import { addToast, Divider } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { IoCaretBackCircleOutline } from "react-icons/io5";
import NextLink from "next/link";
import { GoogleLogin } from "@react-oauth/google";

import { Logo } from "@/components/icons";
import { loginWithGoogle } from "@/services";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // console.log("status", status);
  // useEffect(() => {
  //   if ((session as any)?.accessToken) {

  //   }
  // }, [session]);

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

              <GoogleLogin
                onError={() => {
                  console.error("Google 登录失败");
                }}
                onSuccess={(credentialResponse) => {
                  const credential = credentialResponse.credential;

                  loginWithGoogle(credential as string).then((e: any) => {
                    console.log("谷歌登录成功", e);
                    if (e.success) {
                      addToast({
                        title: e.msg,
                        timeout: 1000,
                        color: "success",
                      });
                      router.push("/");
                    } else {
                      addToast({
                        title: e.msg,
                        timeout: 1000,
                        color: "danger",
                      });
                    }
                  });
                  // const payload: any = jwtDecode(credential!);

                  console.log("Google 用户信息:", credential);

                  // 👇 可以发送给后端登录/注册
                  // fetch('/api/auth/google', { method: 'POST', body: JSON.stringify(payload) })
                }}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
