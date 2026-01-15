"use client";
import React, { useState } from "react";
import { Button, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";

import { useHistoryList, useHistoryMutations } from "@/hook/api";
import { useSelection } from "@/hook/common";
import { FullscreenLoader } from "@/components/ui";
import { ProductCard } from "@/components/block";
import { useTranslations } from "next-intl";

export default function HistoryPage() {
  const t = useTranslations("dashboard.history");
  const router = useRouter();
  const { data, isLoading } = useHistoryList();
  const { deleteMutation } = useHistoryMutations();
  const historyList = (data as unknown as any[]) || [];
  const [isManage, setIsManage] = useState(false);

  const {
    selectedIds,
    isSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
    onClearAll,
    hasSelected,
  } = useSelection(historyList, {
    idKey: "id",
  });

  const handleDelete = () => {
    if (!hasSelected) return;
    deleteMutation.mutateAsync(selectedIds as string[], {
      onSuccess: () => {
        setIsManage(false);
      },
    });
  };

  const toggleManage = () => {
    if (isManage) {
      onClearAll();
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
              onValueChange={onToggleSelectAll}
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
          {historyList.map((product) => (
            <ProductCard
              key={product.id}
              isManageMode={isManage}
              isSelected={isSelected(product.id)}
              product={{ ...product }}
              onClick={() => {
                if (product.source && product.sourceProductId) {
                  router.push(`/goods/${product.source}/${product.sourceProductId}`);
                }
              }}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
