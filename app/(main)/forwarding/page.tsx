"use client";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Snippet,
  Textarea,
} from "@heroui/react";
import { Image } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FaCamera } from "react-icons/fa";

import { useGlobalStore } from "@/store";
import { createCustomizeOrder, getServicesList } from "@/services";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import Stepper from "@/components/stepper";
import CommonModal from "@/components/modal/common-modal";

export default function ForwardingPage() {
  const t = useTranslations("ForwardingPage");
  const [isLoading, setIsLoading] = useState(false); // 🔹 loading 状态

  const { currency } = useGlobalStore();

  const [servicesList, setServicesList] = useState([]);

  const router = useRouter();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [loading, setLoading] = useState(false); // 🔥 loading 状态

  // 当前服务详情对象
  const [currentService, setCurrentService] = useState<any>(null);
  // 弹窗状态
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);
  // 当前服务详情对象
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getServicesList();

        // 克隆服务，初始化 isCheck、remark
        setServicesList(
          res.map((s: any) => {
            return {
              ...s,
              serviceId: s?.id,
              isCheck: false,
              remark: "",
              quantity: 1,
            };
          }),
        );
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const payload = {
      logisticsCode: data.logisticsCode,
      packageItemName: data.packageItemName,
      serviceList: servicesList
        .filter((s: any) => s.isCheck)
        .map((item: any) => {
          return {
            serviceId: item.serviceId,
            quantity: item.quantity,
            remark: item.remark,
          };
        }),
      receiver: "Bryant-4-Bryant",
      receivePhone: "15916408071",
      receiveAddress: "广东省惠州市惠城区水口荔枝城青创产业园9楼901",
    };

    console.log("提交的数据:", payload);

    try {
      setLoading(true); // 开始 loading
      const bizCode = await createCustomizeOrder(payload);

      console.log("创建成功:", bizCode);

      if (bizCode) {
        router.push("/payment/" + bizCode);
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
  // 保存服务详情备注
  const saveServiceDetail = () => {
    console.log("currentService", currentService);

    // 如果是基础拍照（id === 1），直接关掉弹窗，不修改 localServices
    if (currentService.id == 1) {
      setIsServiceDetailOpen(false);

      return;
    }

    setServicesList((prev: any) =>
      prev.map((s: any) =>
        s.id === currentService.id
          ? {
              ...s,
              remark: currentService?.remark,
              isCheck: true,
              quantity: currentService?.quantity,
            }
          : s,
      ),
    );

    setIsServiceDetailOpen(false);
  };
  // 打开某个服务详情
  const openServiceDetail = (serviceId: string) => {
    const service = servicesList.find((s: any) => s.id === serviceId);

    if (!service) return;
    setCurrentService(service);
    setIsServiceDetailOpen(true);
  };
  // 删除已选服务
  const removeService = (serviceId: string) => {
    setServicesList((prev: any) =>
      prev.map((s: any) =>
        s.id === serviceId ? { ...s, isCheck: false, remark: "" } : s,
      ),
    );
  };

  return (
    <div>
      {isLoading && <FullscreenLoader />}
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
            <span>15916408071</span>
            <span>广东省惠州市惠城区水口荔枝城青创产业园9楼901</span>
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
          <div className="flex flex-col gap-2">
            {servicesList.map((service: any) => (
              <div
                key={service.id}
                className="items-center p-3 border rounded-lg "
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{service.serviceName}</div>
                  {service.id == 1 ? (
                    // 免费的 icon
                    <button
                      className="flex items-center text-green-500 text-sm gap-1 h-8 w-16 justify-center"
                      onClick={() => openServiceDetail(service.id)}
                    >
                      <FaCamera />
                      {t("free")}
                    </button>
                  ) : (
                    <Button
                      className="button-white"
                      size="sm"
                      onPress={() => openServiceDetail(service.id)}
                    >
                      {t("add")}
                    </Button>
                  )}
                </div>

                {service.isCheck && service.id != 1 && (
                  <div className="bg-gray-50 px-3 py-2 rounded-lg mt-2 flex justify-between items-center border border-gray-200">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {t("serviceItem")}
                      </span>
                      {service.remark && (
                        <span className="text-[11px] text-gray-400 mt-0.5 truncate">
                          {t("remark")}: {service.remark}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-500">
                        x{service.quantity}
                      </span>
                      <span className="text-sm font-semibold text-red-500">
                        {currency.symbol}
                        {service.price}
                      </span>
                      <Button
                        className="text-[11px] px-2 h-6"
                        color="danger"
                        size="sm"
                        variant="light"
                        onPress={() => removeService(service.id)}
                      >
                        {t("delete")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* 服务详情弹窗 */}
            {currentService && (
              <CommonModal
                isDismissable={false}
                isOpen={isServiceDetailOpen}
                showCancel={currentService.id != 1}
                title={currentService.serviceName}
                onConfirm={saveServiceDetail}
                onOpenChange={setIsServiceDetailOpen}
              >
                <div className="space-y-5">
                  {/* 服务介绍 */}
                  <div className="bg-[#f8f8f8] p-4 rounded-lg space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {t("serviceIntro")}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {currentService.introduction || t("noIntro")}
                      </p>
                    </div>

                    {/* 示例（id != 1 时才展示） */}
                    {currentService.sample.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {t("sample")}
                        </h3>
                        <div
                          ref={containerRef}
                          className="relative"
                          style={{ width: "100%", overflow: "hidden" }}
                        >
                          <Image.PreviewGroup
                            preview={{
                              getContainer: () =>
                                containerRef.current || document.body, // 让预览挂在这个 div 内
                            }}
                          >
                            <div className="grid grid-cols-4 gap-2">
                              {currentService.sample.map((url: string) => (
                                <Image
                                  key={url}
                                  height={80}
                                  src={url}
                                  width={80}
                                />
                              ))}
                            </div>
                          </Image.PreviewGroup>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 服务费（id != 1 时才展示） */}
                  {currentService.id != 1 && (
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="text-sm text-gray-700">
                        {t("serviceFee")}
                      </span>
                      <div className="flex gap-2">
                        <span className="text-lg font-semibold text-rose-600">
                          {currency.symbol}
                          {currentService.price}
                        </span>
                        {currentService?.stacked == 1 ? (
                          <Stepper
                            value={currentService?.quantity}
                            onChange={(quantity) => {
                              console.log("quantity", quantity);

                              setCurrentService({
                                ...currentService,
                                quantity: quantity,
                              });
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  )}

                  {/* 备注输入框（id != 1 时才展示） */}
                  {currentService.id != 1 && (
                    <Textarea
                      className="w-full mt-2"
                      minRows={3}
                      placeholder={t("remarkPlaceholder")}
                      value={currentService.remark}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          remark: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              </CommonModal>
            )}
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
