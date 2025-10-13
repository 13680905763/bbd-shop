"use client";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Form,
  Input,
  Snippet,
} from "@heroui/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { useServicesStore } from "@/store";
import { createCustomizeOrder } from "@/services";

export default function ForwardingPage() {
  const t = useTranslations("ForwardingPage");
  const services = useServicesStore((state) => state.services);
  const router = useRouter();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [loading, setLoading] = useState(false); // 🔥 loading 状态

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const payload = {
      logisticsCode: data.logisticsCode,
      packageItemName: data.packageItemName,
      serviceIds: selectedServices,
      receiver: "Bryant-4-Bryant",
      receivePhone: "13602579223",
      receiveAddress: "中国广东省惠州市水口街道荔城工业园胜豪科技大厦8A-801",
    };

    console.log("提交的数据:", payload);

    try {
      setLoading(true); // 开始 loading
      const bizCode = await createCustomizeOrder(payload);

      console.log("创建成功:", bizCode);

      if (bizCode) {
        router.push("/order/pay-order/" + bizCode);
      } else {
        router.push("/dashboard/order");
      }
    } catch (err) {
      console.error("创建失败:", err);
      // 你也可以加一个 toast 提示
    } finally {
      setLoading(false); // 结束 loading
    }
  };

  return (
    <div>
      {/* 顶部 Banner */}
      <div className="bg-[url('https://hoobuy.com/_nuxt/estimation_bg.BPnQS2i-.webp')] bg-no-repeat bg-cover h-[180px]" />

      {/* 一个大 Form，包裹左右两边 */}
      <Form
        className="container mx-auto flex justify-between gap-5 p-5 flex-row"
        onSubmit={handleSubmit}
      >
        {/* 左侧：地址 + 包裹信息 */}
        <div className="rounded-lg bg-[#fff] flex-[3] p-8">
          <p className="font-bold mb-5">{t("warehouseAddress")}</p>
          <Snippet className="w-full" symbol="">
            <span>Bryant-4-Bryant </span>
            <span>13602579223</span>
            <span>中国广东省惠州市水口街道荔城工业园胜豪科技大厦8A-801</span>
          </Snippet>
          <Divider className="my-4" />

          <p className="font-bold my-5">{t("forwardingPackage")}</p>
          <div className="flex flex-col gap-4">
            <Input
              isRequired
              errorMessage={t("errorTrackingNo")}
              label={t("trackingNo")}
              labelPlacement="outside"
              name="logisticsCode"
              placeholder={t("trackingNoPlaceholder")}
              type="text"
            />

            <Input
              isRequired
              errorMessage={t("errorPackageName")}
              label={t("packageName")}
              labelPlacement="outside"
              name="packageItemName"
              placeholder={t("packageNamePlaceholder")}
              type="text"
            />
          </div>
        </div>

        {/* 右侧：服务选择 + 协议 + 提交按钮 */}
        <div className="rounded-lg bg-[#fff] flex-1 p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <CheckboxGroup
              label={<p className="font-bold mb-5">{t("extraServices")}</p>}
              value={selectedServices}
              onChange={setSelectedServices}
            >
              {services.map((item: any) => (
                <Checkbox key={item.id} value={item.id}>
                  {item.serviceName}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <Button
              className="w-full bg-[#f0700c] text-[#fff]"
              isDisabled={!acceptAgreement || loading}
              isLoading={loading} // 🔥 按钮 loading 效果
              type="submit"
            >
              {t("submit")}
            </Button>
            <Checkbox
              isSelected={acceptAgreement}
              onValueChange={setAcceptAgreement}
            >
              {t("acceptAgreement")}
            </Checkbox>
          </div>
        </div>
      </Form>
    </div>
  );
}
