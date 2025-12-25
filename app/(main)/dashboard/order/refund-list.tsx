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

import PaginationBar from "@/components/common/pagination-bar";
import { useGlobalStore } from "@/store";
import { getRefundList } from "@/services";

export default function RefundList() {
  const t = useTranslations("Dashboard.OrderPage");
  const { currency } = useGlobalStore();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalr, setTotal] = useState(10);
  const [refundList, setRefundList] = useState([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const res = await getRefundList({
        current: page,
        size: pageSize,
      });

      setRefundList(res.records);
      setTotal(res?.total);
    } catch (err) {
      console.error("获取服务列表失败:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);
  const renderCell = ({
    item,
    columnKey,
    currency,
  }: {
    item: any;
    columnKey: string;
    currency?: any;
  }) => {
    const value = item[columnKey];

    // 商品标题
    if (columnKey === "productTitle") {
      return (
        <div className="text-base text-gray-800 leading-snug line-clamp-2">
          {value}
        </div>
      );
    }

    // SKU属性
    if (columnKey === "propAndValue") {
      return (
        <div className="text-sm text-gray-500 leading-snug line-clamp-2">
          {value?.propName_valueName}
        </div>
      );
    }
    // 金额统一格式
    if (columnKey === "refundAmount") {
      return `${currency?.symbol}${Number(value).toFixed(2)}`;
    }

    // 图片列
    if (columnKey === "picUrl") {
      const imgSrc = item.skuUrl || value;

      return (
        <Image
          alt="商品图片"
          height={50}
          referrerPolicy="no-referrer"
          src={imgSrc}
          width={50}
        />
      );
    }

    // 时间格式化
    if (columnKey === "createTime" || columnKey === "updateTime") {
      return value ? value.replace("T", " ").slice(0, 19) : "--";
    }

    return value || "--";
  };
  const columns = [
    { key: "orderCode", label: t("refundTable.orderCode") },
    { key: "picUrl", label: t("refundTable.picUrl") },
    { key: "productTitle", label: t("refundTable.productTitle") },
    { key: "propAndValue", label: "sku" },
    { key: "refundAmount", label: t("refundTable.refundAmount") },
    { key: "applyRemark", label: t("refundTable.applyRemark") },
    { key: "handleRemark", label: t("refundTable.handleRemark") },
    { key: "status", label: t("refundTable.status") },
    // { key: "createTime", label: t("refundTable.createTime") },
    { key: "updateTime", label: t("refundTable.updateTime") },
  ];

  return (
    <>
      <Table
        isHeaderSticky
        removeWrapper
        classNames={{
          wrapper: "p-0 rounded-none border border-default-200 min-w-[900px]",
          thead: "bg-default-50",
          th: "text-default-600 font-medium !rounded-none text-sm",
          tr: "border-b last:border-b-0",
          td: "text-sm text-default-700",
        }}
        radius="none"
        shadow="none"
      >
        <TableHeader columns={columns}>
          {(column: any) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody
          emptyContent={t("refundTable.emptyContent")}
          isLoading={isLoading}
          items={refundList}
          loadingContent={<Spinner />}
        >
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey: any) => (
                <TableCell className="text-sm text-default-700 break-words whitespace-normal">
                  {renderCell({
                    item,
                    columnKey,
                    currency,
                  })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-10 sticky bottom-0 border-t bg-white z-10 p-4 card-cart">
        {(totalr as number) > 0 && (
          <PaginationBar
            page={page}
            pageSize={pageSize}
            total={totalr as number}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    </>
  );
}
