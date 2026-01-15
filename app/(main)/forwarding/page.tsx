"use client";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
} from "@heroui/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { FaCamera } from "react-icons/fa";

import { IoCopyOutline } from "react-icons/io5";

import { useGlobalStore } from "@/store";
import {FullscreenLoader} from "@/components/ui";
import CopyText from "@/components/ui/copy-text";

import { useForwardingLogic } from "./useForwardingLogic";
import { ServiceItem } from "./types";
import ServiceDetailModal from "./service-detail-modal";

export default function Forwarding() {
  const t = useTranslations("forwarding");
  const { currency } = useGlobalStore();

  const {
    servicesList,
    isLoading,
    isSubmitting,
    updateService,
    removeService,
    submitOrder,
  } = useForwardingLogic();

  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceItem | null>(null);
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);

  // 打开某个服务详情
  const openServiceDetail = (serviceId: string | number) => {
    const service = servicesList.find((s) => s.id === serviceId);
    if (!service) return;
    setCurrentService(service);
    setIsServiceDetailOpen(true);
  };
  const handleServiceConfirm = (updatedService: ServiceItem) => {
    // 基础拍照（id === 1）直接关闭弹窗，不修改状态
    if (updatedService.id == 1) {
      setIsServiceDetailOpen(false);
      return;
    }
    updateService(updatedService.id, {
      remark: updatedService.remark,
      isCheck: true,
      quantity: updatedService.quantity,
    });
    setIsServiceDetailOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    
    await submitOrder({
      logisticsCode: data.logisticsCode as string,
      packageItemName: data.packageItemName as string,
    });
  };

  return (
    <div>
      {isLoading && <FullscreenLoader />}
      <div className="bg-[url('/images/estimation.webp')] bg-no-repeat bg-cover h-[180px]" />

      <Form
        className="container mx-auto flex justify-between gap-5 p-5 flex-row"
        onSubmit={handleSubmit}
      >
        {/* 左侧：地址 + 包裹信息 */}
        <div className="rounded-lg bg-[#fff] flex-[3] p-8">
          <p className="font-bold mb-5">{t("warehouseAddress")}</p>
          <div className="relative w-full bg-[#f4f4f5] rounded-large p-4 text-sm font-mono text-default-600">
            <div className="flex flex-col gap-1">
              <span>Bryant-4-Bryant</span>
              <span>15916408071</span>
              <span>广东省惠州市惠城区水口荔枝城青创产业园9楼901</span>
            </div>
            <CopyText
              className="absolute top-3 right-3 text-default-400 hover:text-default-700 transition-colors p-1 rounded-md hover:bg-default-100"
              text={`Bryant-4-Bryant\n15916408071\n广东省惠州市惠城区水口荔枝城青创产业园9楼901`}
            >
              <IoCopyOutline size={18} />
            </CopyText>
          </div>
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
            {servicesList.map((service) => (
              <div
                key={service.id}
                className="items-center p-3 border rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{service.serviceName}</div>
                  {service.id == 1 ? (
                    <button
                      className="flex items-center text-green-500 text-sm gap-1 h-8 w-16 justify-center"
                      onClick={() => openServiceDetail(service.id)}
                      type="button" // 明确 type="button" 防止触发表单提交
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
            
            <ServiceDetailModal 
              isOpen={isServiceDetailOpen}
              onOpenChange={setIsServiceDetailOpen}
              service={currentService}
              onConfirm={handleServiceConfirm}
            />
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <Button
              className="w-full bg-[#f0700c] text-[#fff]"
              isDisabled={!acceptAgreement || isSubmitting}
              isLoading={isSubmitting}
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
