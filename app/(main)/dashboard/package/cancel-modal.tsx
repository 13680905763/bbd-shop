import React from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import { IoCloseCircleOutline, IoSwapHorizontalOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalData: any;
  setModalData: (data: any) => void;
  onOpenChangeLine: () => void;
}

export default function CancelModal({
  isOpen,
  onClose,
  modalData,
  setModalData,
  onOpenChangeLine,
}: CancelModalProps) {
  const t = useTranslations("dashboard.package");
  const { currency } = useGlobalStore();

  return (
    <CommonModal
      footer={<div />}
      isOpen={isOpen}
      title={t("cancelModal.title")}
      onOpenChange={onClose}
    >
      <div className="flex justify-center gap-6 py-6">
        <Card
          isPressable
          className="w-52 rounded-2xl border border-gray-200 shadow-sm transition-all duration-200 hover:border-red-500 hover:bg-red-50"
          onPress={() => {
            setModalData({ ...modalData, isCancelling: true });
            if (modalData.confirm) modalData.confirm();
          }}
        >
          <CardBody className="flex flex-col items-center justify-between space-y-3 px-3 py-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              {modalData?.isCancelling ? (
                <Spinner color="danger" size="lg" />
              ) : (
                <IoCloseCircleOutline className="h-10 w-10 text-red-500" />
              )}
              <p
                className={`text-base font-semibold ${
                  modalData?.isCancelling ? "text-gray-500" : "text-red-600"
                }`}
              >
                {modalData?.isCancelling
                  ? t("cancelModal.cancelCard.submittingTitle")
                  : t("cancelModal.cancelCard.title")}
              </p>
              <p className="text-sm text-gray-500">
                {modalData?.isCancelling
                  ? t("cancelModal.cancelCard.submittingSubtitle")
                  : t("cancelModal.cancelCard.subtitle")}
              </p>
            </div>

            {/* 下半部分：费用明细 */}
            <div className="w-full rounded-xl border-t border-gray-100 bg-white pt-2 text-sm text-gray-700">
              <div className="flex justify-between px-2 py-1">
                <span>{t("cancelModal.cancelCard.serviceFee")}</span>
                <span>
                  {currency.symbol}
                  {modalData?.cancelPre?.serviceFee ?? 0}
                </span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>{t("cancelModal.cancelCard.packingFee")}</span>
                <span>
                  {currency.symbol}
                  {modalData?.cancelPre?.packingFee ?? 0}
                </span>
              </div>
              <div className="flex justify-between px-2 py-1 font-semibold text-red-600">
                <span>{t("cancelModal.cancelCard.totalFee")}</span>
                <span>
                  {currency.symbol}
                  {modalData?.cancelPre?.totalFee ?? 0}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 更换路线 */}
        {modalData?.currentPackage?.changeFlag && (
          <Card
            isPressable
            className="h-auto w-48 border border-gray-200 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
            onPress={() => {
              if (modalData?.isCancelling) return;
              setModalData({ ...modalData, isUpdatingRoute: true });
              onOpenChangeLine();
            }}
          >
            <CardBody className="flex flex-col items-center justify-center text-center">
              {modalData?.isUpdatingRoute ? (
                <Spinner color="danger" size="lg" />
              ) : (
                <IoSwapHorizontalOutline className="h-8 w-8 text-blue-500" />
              )}

              <p className="text-lg font-semibold text-blue-600">
                {t("cancelModal.changeRouteCard.title")}
              </p>
              <p className="text-sm text-gray-500">
                {t("cancelModal.changeRouteCard.subtitle")}
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </CommonModal>
  );
}
