"use client";

import React, { useEffect, useState } from "react";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import { getExperienceList } from "@/services";

export default function PromotionExperiencePage() {
  const t: any = useTranslations("Dashboard.Promotion.experience");

  const [experienceList, setExperienceList] = useState([]);

  useEffect(() => {
    getExperienceList().then((res) => {
      console.log("res", res);
      setExperienceList(res.records);
    });
  }, []);
  const texts = {
    title: "经验明细",
    noData: "暂无交易记录",
  };
  const tableColumns = [
    {
      key: "email",
      label: "被邀请人邮箱",
    },
    {
      key: "experience",
      label: "经验值",
    },
    {
      key: "createTime",
      label: "时间",
    },
  ];

  return (
    <>
      <div className="font-bold my-4">{t.title}</div>
      <Table
        isHeaderSticky
        classNames={{
          wrapper: "p-0 rounded-none border-1",
          tr: "border-b-1 last:border-b-0 !shadow-none",
          th: "text-default-500 !rounded-none",
        }}
        radius="none"
        shadow="none"
      >
        <TableHeader columns={t.raw("tableColumns")}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={t.noData} items={experienceList || []}>
          {(item: any) => (
            <TableRow key={item?.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
