import { Button } from "@heroui/react";
import React, { useState } from "react";
import { IoTicketOutline, IoWallet } from "react-icons/io5";
import { useTranslations } from "next-intl";

import PointsRecordContent from "./points-change-content";

import { usePointsList, useUserInfo } from "@/hook/api";
import { CommonTable, CommonTabs } from "@/components/common";

export default function ScoreTab() {
  const t = useTranslations("dashboard.wallet.score");
  const { data: user } = useUserInfo();
  const [activeTab, setActiveTab] = useState("score");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: scoreList,
    isLoading: scoreListLoading,
    isFetching,
  } = usePointsList({
    current: page,
    size: pageSize,
  });

  const tableColumns = [
    {
      key: "bizType",
      label: t("tableColumns.bizType"),
    },
    {
      key: "amount",
      label: t("tableColumns.amount"),
    },
    {
      key: "availablePoints",
      label: t("tableColumns.availablePoints"),
    },
    {
      key: "createTime",
      label: t("tableColumns.createTime"),
    },
  ];
  const tabs = [
    {
      key: "score",
      title: t("details"),
      content: (
        <CommonTable
          columns={tableColumns}
          data={scoreList}
          isLoading={scoreListLoading || isFetching}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      ),
    },
    { key: "coupon", title: t("exchangeCoupon"), content: <PointsRecordContent /> },
  ];

  return (
    <div>
      <div className="flex justify-between bg-[#ffeee1] rounded-lg p-8">
        <div className="flex items-center gap-2">
          <IoWallet className="w-6 h-6 text-[#f0700c]" />
          <div className="text-lg font-bold">{t("title")}</div>
          <span className="text-money-3xl">{user?.myPoints}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            color="primary"
            size="md"
            onPress={() => setActiveTab("coupon")}
          >
            <IoTicketOutline className="w-5 h-5 " />
            {t("exchangeCoupon")}
          </Button>
        </div>
      </div>
      <CommonTabs
        selectedKey={activeTab}
        tabs={tabs}
        onSelectionChange={(key: any) => setActiveTab(key)}
      />
    </div>
  );
}
