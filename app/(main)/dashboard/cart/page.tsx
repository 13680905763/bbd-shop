"use client";
import React, { useMemo, useState } from "react";
import { Button, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import CartItem from "./cart-item";
import { useCartList, useCartMutations } from "@/hook/api";
import { FullscreenLoader, OrderProgress } from "@/components/ui";
import { useGlobalStore } from "@/store";
import { useConfirm } from "@/components/common/modal/confirm-provider";
import { useSelection, useDebounceCallback } from "@/hook/common";
import {
  CreateOrderPreviewKeyByCartParams,
  PreviewItem,
} from "@/types";

import { calculateTotalPrice } from "@/lib/price";
import EditRemarkModal from "./edit-remark-modal";

export default function CartPage() {
  const t = useTranslations("dashboard.cart");
  const { currency } = useGlobalStore();

  const [remarkModalState, setRemarkModalState] = useState<{
    open: boolean;
    productId: string;
    remark: string;
  }>({ open: false, productId: "", remark: "" });

  const { data, isLoading } = useCartList();
  // 扁平化购物车数据
  const flatList =
    useMemo(() => {
      return data?.flatMap((shop) => shop.cartList);
    }, [data]) ?? [];

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
  } = useSelection(flatList, {
    idKey: "id",
    groupKey: "shopId",
  });
  const { confirm } = useConfirm();
  const router = useRouter();

  const { updateMutation, deleteMutation, submitMutation } = useCartMutations();

  const handleSubmitCart = async () => {
    try {
      const params: CreateOrderPreviewKeyByCartParams = {
        previewList: selectedIds.map((cartId) => ({
          cartId,
          serviceList: [],
        })) as PreviewItem[],
      };
      const key = await submitMutation.mutateAsync(params);
      if (key) {
        router.push("/submit/order?type=cart&key=" + key);
      }
    } catch { }
  };

  const handleDeleteCart = async () => {
    await confirm({
      content: t("confirmDeleteContent"), // 弹窗正文
      title: t("confirmDeleteTitle"), // 弹窗标题
      onConfirm: async () => {
        await deleteMutation.mutateAsync({ idList: selectedIds });
      },
    });
  };
  const handleDeleteProduct = async (productId: string) => {
    await confirm({
      content: t("confirmDeleteContent"), // 弹窗正文
      title: t("confirmDeleteTitle"), // 弹窗标题
      onConfirm: async () => {
        await deleteMutation.mutateAsync({ idList: [productId] });
      },
    });
  };

  const handleUpdateProductQuantity = useDebounceCallback(
    async (productId: string, quantity: number) => {
      await updateMutation.mutateAsync([
        {
          id: productId,
          quantity,
        },
      ]);
    },
    500
  );

  const handleUpdateProductRemark = (productId: string, remark: string) => {
    setRemarkModalState({ open: true, productId, remark });
  };

  const submitRemark = async (newRemark: string) => {
    if (!remarkModalState.productId) return;
    await updateMutation.mutateAsync([
      {
        id: remarkModalState.productId,
        remark: newRemark,
      },
    ]);
  };

  const togglePrice = useMemo(() =>
    calculateTotalPrice(selectedItems, "totalFee")
    , [selectedItems]);

  if (isLoading) return <FullscreenLoader />;

  return (
    <div className="h-full">
      <div className="mt-5">
        <OrderProgress currentStep={0} />
      </div>
      <div>
        <div className="text-title">
          {t("title", {
            count: flatList.length,
          })}
        </div>
        {flatList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <p className="text-lg mb-2">{t("empty.title")}</p>
            <p className="text-sm">{t("empty.desc")}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {data?.map((c) => (
                <CartItem
                  key={c.shopId}
                  cart={c}
                  isGroupAllSelected={isGroupAllSelected(c.shopId)} //  店铺selected
                  isSelected={isSelected}
                  onDeleteProduct={handleDeleteProduct}
                  onQuantityChange={handleUpdateProductQuantity}
                  onRemark={handleUpdateProductRemark}
                  toggle={onSelect}
                  toggleGroup={() => onToggleGroup(c.shopId)} // 店铺onChange
                />
              ))}
            </div>

            <div className="mt-10  sticky bottom-0 border-t-[1px] bg-white z-10 card-cart">
              <div className="flex justify-between items-center p-4 gap-4 ">
                <div className="flex gap-2">
                  <Checkbox isSelected={isAllSelected} onChange={onToggleSelectAll}>
                    {t("selectAll")}
                  </Checkbox>
                  <Button
                    className="text-[#f0700c]"
                    isDisabled={!hasSelected}
                    size="sm"
                    variant="light"
                    onPress={handleDeleteCart}
                  >
                    {t("delete")}{selectedIds.length ? ` (${selectedIds.length})` : ""}
                  </Button>
                </div>
                <div className="flex items-center gap-8">
                  <p>
                    <span className="font-semibold ">{t("totalPayable")}</span>
                    <span className=" font-bold text-3xl text-[#f0700c]">
                      {currency.symbol}
                      {togglePrice}
                    </span>
                  </p>
                  <Button
                    className="w-[150px]"
                    color="primary"
                    isDisabled={!hasSelected}
                    isLoading={submitMutation.isPending}
                    size="lg"
                    onPress={handleSubmitCart}
                  >
                    {t("checkout")}{selectedIds.length ? ` (${selectedIds.length})` : ""}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
        <EditRemarkModal
          initialValue={remarkModalState.remark}
          isOpen={remarkModalState.open}
          onSubmit={submitRemark}
          onOpenChange={(open) =>
            setRemarkModalState((prev) => ({ ...prev, open }))
          }
        />
      </div>
    </div>
  );
}
