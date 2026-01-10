"use client";
import React, { useState } from "react";
import { Button, Checkbox } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useHistory } from "@/hook";
import { useSelection } from "@/hook/useSelection";
import { delHistory } from "@/services/goods";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import ProductCard from "@/components/domain/product-card";
import { useTranslations } from "next-intl";

export default function HistoryPage() {
  const t = useTranslations("dashboard.history");
  const { data, isLoading } = useHistory();
  const router = useRouter();
  const historyList = (data as unknown as any[]) || [];
  const [isManage, setIsManage] = useState(false);
  const queryClient = useQueryClient();

  const {
    selectedIds,
    isSelected,
    toggle,
    selectAll,
    unselectAll,
    isAllSelected,
    hasSelected,
    toggleSelectAll,
  } = useSelection(historyList, {
    idKey: "id",
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => delHistory(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
      unselectAll();
      setIsManage(false);
    },
    onError: () => {},
  });

  const handleDelete = () => {
    if (!hasSelected) return;
    deleteMutation.mutate(selectedIds as string[]);
  };

  const toggleManage = () => {
    if (isManage) {
      unselectAll();
    }
    setIsManage(!isManage);
  };

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return (
    <div>
      <div className="my-5 flex items-center justify-between">
        <div>
          <span className="font-bold mr-5 text-xl">{t("title")}</span>
          {historyList.length > 0 && (
            <span
              className="text-default-500 cursor-pointer hover:text-primary text-sm"
              role="button"
              onClick={toggleManage}
            >
              {isManage ? t("complete") : t("manage")}
            </span>
          )}
        </div>
        {isManage && (
          <div className="flex gap-4 items-center">
            <Checkbox
              isSelected={isAllSelected}
              onValueChange={toggleSelectAll}
            >
              {t("selectAll")}
            </Checkbox>
            <Button
              color="primary"
              isDisabled={!hasSelected}
              isLoading={deleteMutation.isPending}
              onPress={handleDelete}
            >
              {t("delete")}{selectedIds.length ? `(${selectedIds.length})` : ""}
            </Button>
          </div>
        )}
      </div>

      {historyList.length === 0 ? (
        <div className="text-center text-default-500 py-10">{t("noData")}</div>
      ) : (
        <div className="gap-5 grid grid-cols-2 sm:grid-cols-5">
          {historyList.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              imageUrl={item.productPicUrl}
              isManageMode={isManage}
              isSelected={isSelected(item.id)}
              price={item.price}
              title={item.productTitle}
              updateTime={item.updateTime}
              onClick={() => {
                if (item.source && item.sourceProductId) {
                  router.push(`/goods/${item.source}/${item.sourceProductId}`);
                }
              }}
              onToggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
