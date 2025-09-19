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

import { getPromotionBonusList } from "@/services";

export default function PromotionBonuscePage() {
  const t: any = useTranslations("Dashboard.Promotion.bonus");

  const [bonusList, setBonusList] = useState([]);

  useEffect(() => {
    getPromotionBonusList().then((res) => {
      console.log("res", res);
      setBonusList(res.records);
    });
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
        <TableBody emptyContent={t.noData} items={bonusList || []}>
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
