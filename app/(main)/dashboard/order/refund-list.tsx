import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Image,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useGlobalStore } from "@/store";
import { CommonTable } from "@/components/common";
import { useRefundOrderList } from "@/hook/api";

export default function RefundList() {
  const t = useTranslations("dashboard.order.refundList");
  const { currency } = useGlobalStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isFetching } = useRefundOrderList({
    current: page,
    size: pageSize,
  });
  console.log('refundList', data, isFetching);
  const renderCell = (
    item: any,
    columnKey: any,
  ) => {
    const value = item[columnKey];

    // 商品信息（图片 + 标题 + SKU）
    if (columnKey === "productTitle") {
      const imgSrc = item.skuUrl || item.picUrl;

      return (
        <div className="flex items-center gap-3 min-w-[240px] max-w-[400px]">
          <div className="flex-shrink-0 h-16 w-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <Image
              alt={item.productTitle || "Product Image"}
              className="w-full h-full object-cover"
              classNames={{
                wrapper: "w-full h-full",
                img: "w-full h-full",
              }}
              referrerPolicy="no-referrer"
              src={imgSrc || "/placeholder.png"}
              radius="none"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <div
              className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug"
              title={value}
            >
              {value || "--"}
            </div>
            <div
              className="text-xs text-gray-500 line-clamp-1"
              title={item.propAndValue?.propName_valueName}
            >
              {item.propAndValue?.propName_valueName || "--"}
            </div>
          </div>
        </div>
      );
    }

    // 备注信息限制长度
    if (columnKey === "applyRemark" || columnKey === "handleRemark") {
      return (
        <div
          className="max-w-[200px] text-sm text-gray-600 line-clamp-4"
          title={value}
        >
          {value || "--"}
        </div>
      );
    }

    // 金额统一格式
    if (columnKey === "refundAmount") {
      return `${currency?.symbol}${Number(value).toFixed(2)}`;
    }

    // 时间格式化
    if (columnKey === "createTime" || columnKey === "updateTime") {
      return value ? value.replace("T", " ").slice(0, 19) : "--";
    }

    return value || "--";
  };
  const columns = [
    { key: "orderCode", label: t("tableColumn.orderCode") },
    { key: "productTitle", label: t("tableColumn.productTitle") },
    // { key: "propAndValue", label: t("tableColumn.propAndValue") },
    { key: "refundAmount", label: t("tableColumn.refundAmount") },
    { key: "applyRemark", label: t("tableColumn.applyRemark") },
    { key: "handleRemark", label: t("tableColumn.handleRemark") },
    { key: "status", label: t("tableColumn.status") },
    { key: "updateTime", label: t("tableColumn.updateTime") },
  ];

  return (
    <>
      <div className="font-bold my-4">{t('title')}</div>
      <CommonTable
        columns={columns}
        data={data}
        renderCell={renderCell}
        isLoading={isFetching}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </>
  );
}
