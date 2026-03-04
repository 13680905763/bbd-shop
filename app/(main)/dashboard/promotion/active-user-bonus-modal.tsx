import React from "react";
import { useTranslations } from "next-intl";

import { useGlobalStore } from "@/store";
import { CommonTable } from "@/components/common";
import CommonModal from "@/components/modal/common-modal";
import { useInviteBonus } from "@/hook/api";

interface ActiveUserBonusModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ActiveUserBonusModal({
  isOpen,
  onOpenChange,
}: ActiveUserBonusModalProps) {
  const t = useTranslations("dashboard.promotion.page.activeUserBonus");
  const { currency } = useGlobalStore();
  const { data: inviteBonus, isLoading: isLoadingInviteBonus } =
    useInviteBonus();

  return (
    <CommonModal
      footer={<></>}
      isOpen={isOpen}
      size="xl"
      title={t("title")}
      onOpenChange={onOpenChange}
    >
      <CommonTable
        columns={[
          {
            key: "activeUsersNum",
            label: t("tableColumns.activeUser"),
          },
          {
            key: "remark",
            label: t("tableColumns.remark"),
          },
        ]}
        data={{ records: inviteBonus || [] }}
        isLoading={isLoadingInviteBonus}
      />
    </CommonModal>
  );
}
