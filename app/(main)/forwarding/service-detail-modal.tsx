import React, { useEffect, useRef, useState } from "react";
import { Image } from "antd";
import { Textarea } from "@heroui/react";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";
import Stepper from "@/components/stepper";
import { useGlobalStore } from "@/store";
import { ServiceItem } from "./types";

interface ServiceDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceItem | null;
  onConfirm: (updatedService: ServiceItem) => void;
}

export default function ServiceDetailModal({
  isOpen,
  onOpenChange,
  service,
  onConfirm,
}: ServiceDetailModalProps) {
  const t = useTranslations("forwarding");
  const { currency } = useGlobalStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // 本地暂存状态，避免直接修改父组件状态，直到点击确认
  const [localService, setLocalService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    if (isOpen && service) {
      setLocalService({ ...service });
    }
  }, [isOpen, service]);

  const handleConfirm = () => {
    if (localService) {
      onConfirm(localService);
    }
    onOpenChange(false);
  };

  if (!localService) return null;

  // 基础拍照服务 (id == 1) 特殊处理：没有确认按钮（或者确认就是关闭），没有编辑功能
  // 原逻辑：id==1 时 showCancel=false (实际逻辑里是 showCancel={id!=1})，直接关掉弹窗不修改
  const isBasicService = localService.id == 1;

  return (
    <CommonModal
      isDismissable={false}
      isOpen={isOpen}
      showCancel={!isBasicService}
      title={localService.serviceName}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-5">
        {/* 服务介绍 */}
        <div className="bg-[#f8f8f8] p-4 rounded-lg space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">
              {t("serviceIntro")}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {localService.introduction || t("noIntro")}
            </p>
          </div>

          {/* 示例图 */}
          {localService.sample && localService.sample.length > 0 && (
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
                    getContainer: () => containerRef.current || document.body,
                  }}
                >
                  <div className="grid grid-cols-4 gap-2">
                    {localService.sample.map((url: string) => (
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

        {/* 服务费 & 数量 (非基础服务) */}
        {!isBasicService && (
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm text-gray-700">{t("serviceFee")}</span>
            <div className="flex gap-2">
              <span className="text-lg font-semibold text-rose-600">
                {currency.symbol}
                {localService.price}
              </span>
              {localService.stacked == 1 && (
                <Stepper
                  value={localService.quantity}
                  onChange={(val) =>
                    setLocalService({ ...localService, quantity: val })
                  }
                />
              )}
            </div>
          </div>
        )}

        {/* 备注输入框 (非基础服务) */}
        {!isBasicService && (
          <Textarea
            className="w-full mt-2"
            minRows={3}
            placeholder={t("remarkPlaceholder")}
            value={localService.remark || ""}
            onChange={(e) =>
              setLocalService({ ...localService, remark: e.target.value })
            }
          />
        )}
      </div>
    </CommonModal>
  );
}
