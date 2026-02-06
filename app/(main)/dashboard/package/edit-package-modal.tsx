import React, { useState } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import { IoLocationOutline, IoSwapHorizontalOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWaybill: any;
  onChangeRoute: (waybill: any) => Promise<void>;
  onChangeAddress: (waybill: any) => Promise<void>;
}

export default function EditPackageModal({
  isOpen,
  onClose,
  currentWaybill,
  onChangeRoute,
  onChangeAddress,
}: EditPackageModalProps) {
  const t = useTranslations("dashboard.package");
  const [loadingType, setLoadingType] = useState<"route" | "address" | null>(null);

  const canChangeRoute = currentWaybill?.changeFlag;
  const canChangeAddress = currentWaybill?.addressFlag;

  const handleAction = async (type: "route" | "address") => {
    if (loadingType) return;
    if (type === "route" && !canChangeRoute) return;
    if (type === "address" && !canChangeAddress) return;

    setLoadingType(type);
    try {
      if (type === "route") {
        await onChangeRoute(currentWaybill);
      } else {
        await onChangeAddress(currentWaybill);
      }
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      title={t("editModal.title")}
      onOpenChange={onClose}
      footer={<div />}
    >
      <div className="flex flex-col gap-4 py-4">
        <Card
          isPressable={canChangeRoute}
          isDisabled={!!loadingType || !canChangeRoute}
          className={`w-full border transition-all ${
            loadingType || !canChangeRoute 
              ? "opacity-70 bg-gray-50 border-gray-100" 
              : "hover:bg-orange-50 border-transparent hover:border-[#f0700c] hover:border-opacity-30"
          }`}
          onPress={() => handleAction("route")}
        >
          <CardBody className="flex flex-row items-center gap-4 p-4">
            <div className={`p-3 rounded-full flex items-center justify-center w-12 h-12 ${
                !canChangeRoute ? "bg-gray-200" : "bg-orange-100"
            }`}>
              {loadingType === "route" ? (
                <Spinner size="sm" color="warning" />
              ) : (
                <IoSwapHorizontalOutline className={`h-6 w-6 ${
                    !canChangeRoute ? "text-gray-400" : "text-[#f0700c]"
                }`} />
              )}
            </div>
            <div className="flex flex-col flex-1 text-left">
              <span className={`font-semibold ${!canChangeRoute ? "text-gray-400" : "text-gray-800"}`}>
                {t("editModal.changeRoute")}
              </span>
              <span className="text-xs text-gray-500">{t("editModal.routeDesc")}</span>
            </div>
          </CardBody>
        </Card>

        <Card
          isPressable={canChangeAddress}
          isDisabled={!!loadingType || !canChangeAddress}
          className={`w-full border transition-all ${
            loadingType || !canChangeAddress
              ? "opacity-70 bg-gray-50 border-gray-100" 
              : "hover:bg-orange-50 border-transparent hover:border-[#f0700c] hover:border-opacity-30"
          }`}
          onPress={() => handleAction("address")}
        >
          <CardBody className="flex flex-row items-center gap-4 p-4">
            <div className={`p-3 rounded-full flex items-center justify-center w-12 h-12 ${
                !canChangeAddress ? "bg-gray-200" : "bg-orange-100"
            }`}>
              {loadingType === "address" ? (
                <Spinner size="sm" color="warning" />
              ) : (
                <IoLocationOutline className={`h-6 w-6 ${
                    !canChangeAddress ? "text-gray-400" : "text-[#f0700c]"
                }`} />
              )}
            </div>
            <div className="flex flex-col flex-1 text-left">
              <span className={`font-semibold ${!canChangeAddress ? "text-gray-400" : "text-gray-800"}`}>
                {t("editModal.changeAddress")}
              </span>
              <span className="text-xs text-gray-500">{t("editModal.addressDesc")}</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </CommonModal>
  );
}
