import React from "react";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";
import RouteCard from "@/components/common/route-card";

interface ChangeLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  modalData: any;
  setModalData: (data: any) => void;
}

export default function ChangeLineModal({
  isOpen,
  onClose,
  onConfirm,
  modalData,
  setModalData,
}: ChangeLineModalProps) {
  const t = useTranslations("dashboard.package");

  return (
    <CommonModal
      isOpen={isOpen}
      size={"4xl"}
      title={t("changeTitle")}
      onConfirm={onConfirm}
      onOpenChange={onClose}
    >
      {/* 路线 */}
      <div className="flex flex-col gap-2">
        {modalData?.linePre?.map((route: any) => (
          <RouteCard
            key={route.id}
            data={route}
            isSelected={route?.checked}
            onSelect={(id: any) =>
              setModalData({
                ...modalData,
                linePre: modalData?.linePre?.map((item: any) => {
                  return {
                    ...item,
                    checked: id == item?.id ? true : false,
                  };
                }),
              })
            }
          />
        ))}
      </div>
    </CommonModal>
  );
}
