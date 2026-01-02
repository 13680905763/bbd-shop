"use client";

import React, { useEffect, useState } from "react";
import {
  getKeyValue,
  Spinner,
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
  const t: any = useTranslations("dashboard.Promotion.experience");

  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getExperienceList();

        console.log("res", res);
        setExperienceList(res.records || []);
      } catch (err) {
        console.error("获取经验明细失败:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <TableBody
          emptyContent={t.noData}
          isLoading={loading}
          items={experienceList || []}
          loadingContent={<Spinner label="Loading..." />}
        >
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
