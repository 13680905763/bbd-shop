import React from "react";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";

interface LineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWaybill: any;
}

export default function LineDetailModal({
  isOpen,
  onClose,
  currentWaybill,
}: LineDetailModalProps) {
  const t = useTranslations("dashboard.package");

  return (
    <CommonModal
      footer={<div />}
      isOpen={isOpen}
      size="4xl"
      title={t("lineModal.title")}
      onOpenChange={onClose}
    >
      {/* 滚动区域 */}
      <div className="max-h-[60vh] space-y-8 overflow-y-auto pr-2">
        {/* ========== 主运单基本信息 ========== */}
        <div className="space-y-2 rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            {t("lineModal.waybillNumber")}
            <span className="font-medium text-gray-800">
              {currentWaybill?.trackDetail?.trackingNumber}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            {t("lineModal.currentStatus")}
            <span className="font-medium text-[#f0700c]">
              {currentWaybill?.trackDetail?.statusName}
            </span>
          </p>
        </div>

        {/* ========== 主运单时间线 ========== */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            {t("lineModal.mainTimeline")}
          </h3>

          <div className="relative pl-6">
            {/* 竖线 */}
            <div className="absolute bottom-0 left-2 top-0 w-[2px] bg-gray-200" />

            {currentWaybill?.trackDetail?.trackItems?.map(
              (item: any, index: number) => (
                <div key={index} className="relative mb-6 flex items-start">
                  {/* 时间线圆点 */}
                  <div className="absolute left-0 mt-1 h-3 w-3 rounded-full bg-[#f0700c] shadow" />

                  <div className="ml-6">
                    <p className="text-sm font-medium text-gray-800">
                      {item.content}
                    </p>

                    {item.location && (
                      <p className="mt-1 text-xs text-gray-500">
                        {t("lineModal.location")}
                        {item.location}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ========== 多个子运单（如果存在） ========== */}
        {Array.isArray(currentWaybill?.trackDetail?.subOrderList) &&
          currentWaybill?.trackDetail?.subOrderList.length > 0 &&
          currentWaybill?.trackDetail.subOrderList.map((sub: any) => (
            <div key={sub}>
              <h3 className="mb-4 text-lg font-semibold">
                {t("lineModal.subWaybillTitle")}
                {sub}
              </h3>

              <div className="relative pl-6">
                <div className="absolute bottom-0 left-2 top-0 w-[2px] bg-gray-200" />

                {currentWaybill?.trackDetail?.subOrderTrackItems?.[sub]?.map(
                  (item: any, idx: number) => (
                    <div key={idx} className="relative mb-6 flex items-start">
                      <div className="absolute left-0 mt-1 h-3 w-3 rounded-full bg-green-500 shadow" />

                      <div className="ml-6">
                        <p className="text-sm font-medium text-gray-800">
                          {item.content}
                        </p>

                        {item.location && (
                          <p className="mt-1 text-xs text-gray-500">
                            {t("lineModal.location")}
                            {item.location}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-gray-400">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
      </div>
    </CommonModal>
  );
}
