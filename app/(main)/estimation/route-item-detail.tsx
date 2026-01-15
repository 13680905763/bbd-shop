import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import { RouteItem } from "./types";

interface RouteItemDetailProps {
  route: RouteItem;
}

export default function RouteItemDetail({ route }: RouteItemDetailProps) {
  const t = useTranslations("estimation");

  return (
    <div className="flex gap-5 pb-8">
      <div className="flex-1 rounded-sm p-4 ">
        <p className="font-semibold mb-2">
          {t("pricingStandard")}({route.firstWeight}g)
        </p>
        <Table aria-label={t("pricingStandard")}>
          <TableHeader>
            <TableColumn>{t("firstWeightFee")}</TableColumn>
            <TableColumn>{t("additionalWeightFee")}</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{route.firstWeightFee}</TableCell>
              <TableCell>{route.additionalWeightFee}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex-1 rounded-sm p-4">
        <p className="font-semibold mb-2">{t("shippingLimit")}</p>
        <div className="rounded-xl bg-white px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-lg font-semibold text-gray-800">
            {route?.shippingLine?.minWeight} - {route?.shippingLine?.maxWeight}
          </span>
          <span className="ml-1 text-sm text-gray-500">g</span>
        </div>
        <p className="font-semibold my-2">{t("routeFeature")}</p>
        <div className="rounded-xl bg-[#fff] p-6 text-sm">
          {route.shippingLine.description}
        </div>
      </div>
    </div>
  );
}
