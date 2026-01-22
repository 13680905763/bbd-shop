import React from "react";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";
import RouteCard from "@/components/common/route-card";

interface ChangeLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (waybill: any, routeId: string | null) => Promise<void>;
  currentWaybill: any;
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;
}

export default function ChangeLineModal({
  isOpen,
  onClose,
  onConfirm,
  currentWaybill,
  selectedRouteId,
  setSelectedRouteId,
}: ChangeLineModalProps) {
  const t = useTranslations("dashboard.package");
  console.log('currentWaybill', currentWaybill);

  return (
    <CommonModal
      isOpen={isOpen}
      size={"4xl"}
      title={t("changeTitle")}
      onConfirm={async () => await onConfirm(currentWaybill?.id, selectedRouteId)}
      onOpenChange={onClose}
    >
      {/* 路线 */}
      <div className="flex flex-col gap-2">
        {currentWaybill?.changePre?.map((line: any) => (
          <RouteCard
            key={line.id}
            data={line}
            isSelected={line?.id == selectedRouteId}
            onSelect={() => { setSelectedRouteId(line?.id || null) }}
          />
        ))}
      </div>
    </CommonModal>
  );
}
