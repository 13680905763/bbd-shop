"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Button, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import CartItem from "./cart-item";
import EditRemarkModal from "./edit-remark-modal";


import {
  FullscreenLoader,
  BusinessProgress,
  BlockSpinner,
  EmptyState,
  ProductItemTitle,
} from "@/components/ui";
import { useGlobalStore } from "@/store";
import { useConfirm } from "@/components/common/modal/confirm-provider";
import { useSelection, useDebounceCallback } from "@/hook/common";
import { CreateOrderPreviewKeyByCartParams, PreviewItem } from "@/types";
import { calculateTotalPrice } from "@/lib/price";
import {
  useCartList,
  useDeleteCart,
  useSubmitCart,
  useUpdateCartItem,
} from "@/hook/business";

export default function CartPage() {
  const t = useTranslations("dashboard.cart");
  const { currency } = useGlobalStore();

  const [remarkModalState, setRemarkModalState] = useState<{
    open: boolean;
    productId: string;
    remark: string;
  }>({ open: false, productId: "", remark: "" });

  const { data, flatList, isLoading, isFetching } = useCartList();
  const { updateItem, isUpdating } = useUpdateCartItem();
  const { deleteItem, isDeleting } = useDeleteCart();
  const { submitCart, isSubmitting } = useSubmitCart();


  const selectableList = useMemo(() => {
    return flatList.filter((item: any) => item.status !== 3);
  }, [flatList]);

  const {
    selectedIds,
    isSelected,
    selectedItems,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
    hasSelected,
    isGroupAllSelected,
    onToggleGroup,
  } = useSelection<any>(selectableList, {
    idKey: "id",
    groupKey: "shopId",
  });
  const { confirm } = useConfirm();

  const handleCreateOrderPreview = async () => {
    try {
      const params: CreateOrderPreviewKeyByCartParams = {
        previewList: selectedIds.map((cartId) => ({
          cartId,
          serviceList: [],
        })) as PreviewItem[],
      };
      await submitCart(params);


    } catch { }
  };

  const deleteCart = async (id?: string) => {
    await confirm({
      content: t("confirmDeleteContent"), // 弹窗正文
      title: t("confirmDeleteTitle"), // 弹窗标题
      onConfirm: async () => {
        await deleteItem({ idList: id ? [id] : selectedIds });
      },
    });
  };

  const updateProductQuantity = useDebounceCallback(
    async (productId: string, quantity: number) => {
      await updateItem({
        id: productId,
        quantity,
      });
    },
    500,
  );

  const updateProductRemark = useCallback(
    (productId: string, remark: string) => {
      setRemarkModalState({ open: true, productId, remark });
    },
    [],
  );
  const submitProductRemark = async (newRemark: string) => {
    if (!remarkModalState.productId) return;
    await updateItem({
      id: remarkModalState.productId,
      remark: newRemark,
    });
  };

  const togglePrice = useMemo(
    () => calculateTotalPrice(selectedItems, "totalFee"),
    [selectedItems],
  );

  if (isLoading) return <FullscreenLoader />;

  return (
    <div className="h-full">
      <div className="mt-5">
        <BusinessProgress currentStep={0} />
      </div>
      <div className="relative">
        {(isFetching || isUpdating) && <BlockSpinner />}
        {data.length === 0 ? (
          <EmptyState desc={t("empty.desc")} title={t("empty.title")} />
        ) : (
          <>
            <div className="space-y-2">
              <ProductItemTitle />
              {data?.map((c: any) => (
                <CartItem
                  key={c.shopId}
                  cart={c}
                  isGroupAllSelected={isGroupAllSelected} //  店铺selected
                  isSelected={isSelected}
                  toggle={onSelect}
                  toggleGroup={onToggleGroup} // 店铺onChange
                  onDelete={deleteCart}
                  onQuantityChange={updateProductQuantity}
                  onRemark={updateProductRemark}
                />
              ))}
            </div>
            <div className="mt-10 sticky bottom-0 bg-white z-10 border border-gray-200 rounded-lg flex justify-between items-center p-4 gap-4 ">
              <div className="flex gap-2">
                <Checkbox
                  isSelected={isAllSelected}
                  onChange={onToggleSelectAll}
                >
                  {t("selectAll")}
                </Checkbox>
                <Button
                  className="text-[#f0700c]"
                  isDisabled={!hasSelected}
                  variant="light"
                  onPress={() => deleteCart()}
                >
                  {t("delete")}
                  {selectedIds.length ? ` (${selectedIds.length})` : ""}
                </Button>
              </div>
              <div className="flex items-center gap-8">
                <p>
                  <span className="font-medium text-2xl">
                    {t("totalPayable")}
                  </span>
                  <span className="font-bold text-3xl text-[#f0700c]">
                    {currency.symbol}
                    {togglePrice}
                  </span>
                </p>
                <Button
                  className="w-[200px]"
                  color="primary"
                  isDisabled={!hasSelected}
                  isLoading={isSubmitting}
                  size="lg"
                  onPress={handleCreateOrderPreview}
                >
                  {t("checkout")}
                  {selectedIds.length ? ` (${selectedIds.length})` : ""}
                </Button>
              </div>
            </div>
          </>
        )}
        <EditRemarkModal
          initialValue={remarkModalState.remark}
          isOpen={remarkModalState.open}
          onOpenChange={(open) =>
            setRemarkModalState((prev) => ({ ...prev, open }))
          }
          onSubmit={submitProductRemark}
        />
      </div>
    </div>
  );
}
