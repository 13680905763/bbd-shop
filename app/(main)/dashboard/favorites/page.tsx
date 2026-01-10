"use client";

import React, { useState } from "react";
import { Button, Checkbox } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useFavorite } from "@/hook";
import { useSelection } from "@/hook/useSelection";
import { delFavorite } from "@/services/goods";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import ProductCard from "@/components/domain/product-card";
import { useTranslations } from "next-intl";

interface FavoriteItem {
  id: string;
  createTime?: string;
  updateTime?: string;
  customerId?: number;
  source: string;
  sourceProductId: string;
  productTitle: string;
  productUrl?: string;
  productPicUrl: string;
  collection?: number;
  productPrice?: number | string;
}

export default function FavoritesPage() {
  const t = useTranslations("dashboard.favorite");
  const { data, isLoading } = useFavorite();
  const router = useRouter();
  // Ensure list is typed and defaults to empty array
  const list = (data as unknown as FavoriteItem[]) || [];

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
  } = useSelection(list, {
    idKey: "id",
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => delFavorite(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
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

      {list.length === 0 ? (
        <div className="text-center text-default-500 py-10">{t("noData")}</div>
      ) : (
        <div className="gap-5 grid grid-cols-2 sm:grid-cols-5">
          {list.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              imageUrl={item.productPicUrl}
              isManageMode={isManage}
              isSelected={isSelected(item.id)}
              price={item.productPrice}
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
