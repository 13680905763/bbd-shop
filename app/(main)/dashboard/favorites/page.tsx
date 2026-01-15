"use client";

import React, { useState } from "react";
import { Button, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";

import { useFavoriteList, useFavoriteMutations } from "@/hook/api";
import { useSelection } from "@/hook/common";
import { FullscreenLoader } from "@/components/ui";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/block";


export default function FavoritesPage() {
  const t = useTranslations("dashboard.favorite");
  const { data, isLoading } = useFavoriteList();
  const { deleteMutation } = useFavoriteMutations();
  const router = useRouter();
  const list = (data as unknown as any[]) || [];

  const [isManage, setIsManage] = useState(false);

  const {
    selectedIds,
    isSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
    onClearAll,
    hasSelected,
  } = useSelection(list, {
    idKey: "id",
  });

  const handleDelete = () => {
    if (!hasSelected) return;
    deleteMutation.mutateAsync(selectedIds as string[], {
      onSuccess: () => {
        onClearAll();
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
          {list.length > 0 && (
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

      {list.length === 0 ? (
        <div className="text-center text-default-500 py-10">{t("noData")}</div>
      ) : (
        <div className="gap-5 grid grid-cols-2 sm:grid-cols-5">
          {list.map((product) => (
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
