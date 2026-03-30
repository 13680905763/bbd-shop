import React from "react";
import { useTranslations } from "next-intl";

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
  const { data: inviteBonus, isLoading: isLoadingInviteBonus } =
    useInviteBonus();

  const tables = [
    {
      title: t("title1"),
      data: inviteBonus?.[1] || [],
    },
    {
      title: t("title2"),
      data: inviteBonus?.[2] || [],
    },
    {
      title: t("title3"),
      data: inviteBonus?.[3] || [],
    },
  ];

  return (
    <CommonModal
      footer={<></>}
      isOpen={isOpen}
      size="5xl"
      title={t("title")}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-6">
        {tables.map((table, index) => (
          <div key={index} className="space-y-2">
            <h3 className="font-semibold text-gray-700">
              {table.title}
              {index !== 2 && (
                <span className="text-sm text-[#f0700c]"> {t("titletip")}</span>
              )}
            </h3>
            <CommonTable
              columns={[
                {
                  key: "activeUsersNum",
                  label: t("tableColumns.activeUsersNum"),
                },
                {
                  key: "remark",
                  label: t("tableColumns.remark"),
                },
              ]}
              data={{ records: table.data }}
              isLoading={isLoadingInviteBonus}
            />
          </div>
        ))}
      </div>
    </CommonModal>
  );
}
