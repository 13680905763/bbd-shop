"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import { useTranslations } from "next-intl";

import { loginCustomer } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { LoginFormData } from "@/types";
import { queryClient } from "@/lib/react-query";
import { useGlobalStore } from "@/store";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const { language } = useGlobalStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const submitDataRef = useRef<LoginFormData | null>(null);
  const captchaInstanceRef = useRef<any>(null);

  const loginFormFields: FieldConfig[] = [
    {
      type: "input",
      name: "email",
      size: "lg",
      required: true,
      errorMessage: t("fields.email.errorMessage"),
      placeholder: t("fields.email.placeholder"),
      startContent: <IoPerson />,
    },
    {
      type: "password",
      name: "password",
      required: true,
      size: "lg",
      errorMessage: t("fields.password.errorMessage"),
      placeholder: t("fields.password.placeholder"),
      startContent: <IoLockClosed />,
    },
  ];

  const handleSubmit = async (data: LoginFormData) => {
    submitDataRef.current = data;

    // 只有指定的域名（或者你本地 localhost 测试时）才弹验证码
    // 其他域名（比如你说的另外两个域名）不需要验证码时，直接调用成功逻辑发起登录！
    const host = window.location.hostname;
    if (host !== "www.bbdbuyeu.com" && host !== "localhost" && host !== "127.0.0.1") {
      handleCaptchaSuccess("");
      return;
    }

    const btn = document.getElementById("captcha-trigger-btn");
    if (btn) btn.click();
  };

  React.useEffect(() => {
    // 设置验证码配置
    (window as any).AliyunCaptchaConfig = { region: "cn", prefix: "esa-ky973v1gyr" };

    if (!document.getElementById("aliyun-captcha-script")) {
      const script = document.createElement("script");
      script.id = "aliyun-captcha-script";
      script.src = "https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).initAliyunCaptcha) {
          (window as any).initAliyunCaptcha({
            SceneId: "1066dnhp",
            mode: "popup",
            element: "#captcha-element",
            button: "#captcha-trigger-btn",
            language: language === "zh" ? "cn" : language,
            success: function (captchaVerifyParam: string) {
              handleCaptchaSuccess(captchaVerifyParam);
            },
            fail: function (result: any) {
              console.error("Captcha fail", result);
            },
            getInstance: function (instance: any) {
              captchaInstanceRef.current = instance;
            },
            server: ['captcha-esa-open.aliyuncs.com', 'captcha-esa-open-b.aliyuncs.com'],
            slideStyle: { width: 360, height: 40 },
          });
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleCaptchaSuccess = async (captchaVerifyParam: string) => {
    if (!submitDataRef.current) return;
    try {
      // 临时将 captchaVerifyParam 合并入提交字段发送，您之后可以根据接口情况修改
      const payload: any = {
        ...submitDataRef.current,
        // captchaVerifyParam,
      };

      await loginCustomer(payload);
      queryClient.invalidateQueries({ queryKey: ["userInfo"] }); // 刷新用户信息
      router.push("/");
    } catch (e) {
      console.error("Login failed:", e);
      // 失败后刷新验证码实例
      if (captchaInstanceRef.current) {
        captchaInstanceRef.current.refresh();
      }
    }
  };

  return (
    <>
      <div className="text-3xl text-default-600 font-semibold mb-4">
        {t("title")}
      </div>
      <CommonForm
        confirmText={t("confirmText")}
        fields={loginFormFields}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />

      <div className="flex justify-between my-2 text-[#f0700c]">
        <button onClick={() => router.push("/forgetPsd")}>
          <div>{t("forgetPassword")}</div>
        </button>
        <div />
        <button onClick={() => router.push("/register")}>
          {t("register")}
        </button>
      </div>

      {/* 阿里云盾必需的挂载节点及触发按钮 */}
      <div id="captcha-element"></div>
      <button id="captcha-trigger-btn" type="button" className="hidden">
        Trigger Captcha
      </button>
    </>
  );
}
