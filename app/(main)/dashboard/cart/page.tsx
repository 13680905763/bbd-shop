"use client";
import React, { useMemo, useRef, useState } from "react";
import { Button, Checkbox, Divider, Textarea } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import CartItem from "./cart-item";

import ConfirmModal from "@/components/modal/confirm-modal";
import {
  createOrderPreviewKeyByCart,
  deleteCart,
  updateCart,
} from "@/services";
import { useCartList } from "@/hook";
import CommonModal from "@/components/modal/common-modal";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import OrderProgress from "@/components/common/order-progress";
import { useGlobalStore } from "@/store";
import { queryClient } from "@/lib/react-query";
import { useSelection } from "@/hook/useSelection";
import { debounce } from "@/lib/debounce";

export default function CartPage() {
  const t = useTranslations("dashboard.cart");
  const { currency } = useGlobalStore();
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 批量支付 loading

  const [modal, setModal] = useState<{
    type: "delete" | "remark" | null;
    productId?: string[] | string; // 退款 modal 选中商品信息
  }>({ type: null });
  const { data, isLoading, isFetching } = useCartList();

  // 扁平化购物车数据
  const flatList =
    useMemo(() => {
      return data?.flatMap((shop) => shop.cartList);
    }, [data]) ?? [];

  const {
    selectedIds,
    isSelected,
    toggle,
    isAllSelected,
    toggleSelectAll,
    hasSelected,
    isGroupAllSelected,
    toggleGroup,
  } = useSelection(flatList, {
    idKey: "id",
    groupKey: "shopId",
  });

  const [remarkText, setRemarkText] = useState("");

  const router = useRouter();
  const handleCartSubmit = async () => {
    try {
      setIsSubmitting(true);
      const previewList = (selectedIds as string[]).map((cartId) => ({
        cartId,
        serviceList: [],
      }));
      const key: string = await createOrderPreviewKeyByCart({ previewList });

      router.push("/submit/order?type=cart&key=" + key);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCartDelete = async (idList: string[]) => {
    try {
      await deleteCart({ idList });
      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
    } catch {}
  };

  const handleProductDelete = (productId: string) => {
    setModal({ type: "delete", productId: [productId] });
  };
  // 防抖函数：只创建一次
  const debouncedUpdate = useRef(
    debounce(async (productId: string, quantity: number) => {
      await updateCart([
        {
          id: productId,
          quantity,
        },
      ]);
      await queryClient.invalidateQueries({ queryKey: ["cartList"] });
    }),
  ).current;
  const handleProductQuantity = async (productId: string, quantity: number) => {
    debouncedUpdate(productId, quantity); // 调用防抖
  };
  const handleProductRemark = (productId: string, remark: string) => {
    setModal({ type: "remark", productId });
    setRemarkText(remark);
  };

  const submitRemark = async () => {
    if (!modal.productId) return;
    try {
      await updateCart([
        {
          id: modal.productId,
          remark: remarkText,
        },
      ]);

      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 刷新
    } catch (e) {
    } finally {
      setModal({ type: null });
      setRemarkText("");
    }
  };

  const togglePrice = useMemo(() => {
    const totalCents = data
      ?.flatMap((shop) => shop.cartList) // 拍平所有商品
      ?.filter((item) => selectedIds.includes(item.id)) // 过滤选中项
      ?.reduce((sum, item) => {
        // 将 totalFee 转成分（乘100取整）
        const fee = Math.round((item?.totalFee ?? 0) * 100);

        return sum + fee;
      }, 0);

    // 最终除以100，保留两位小数
    return totalCents !== undefined ? (totalCents / 100).toFixed(2) : "0.00";
  }, [selectedIds]);

  if (isLoading || isFetching) return <FullscreenLoader />;
  // 判断购物车是否为空
  const isCartEmpty =
    !data || data.flatMap((shop) => shop.cartList).length === 0;

  return (
    <div className="h-full">
      <div className="mt-5">
        <OrderProgress currentStep={0} />
      </div>
      <div>
        <div className="text-title">
          {t("title", {
            count: data?.flatMap((shop) => shop.cartList).length || 0,
          })}
        </div>

        {isCartEmpty ? (
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
                  handleProductDelete={handleProductDelete}
                  handleProductQuantity={handleProductQuantity}
                  handleProductRemark={handleProductRemark}
                  isGroupAllSelected={isGroupAllSelected(c.shopId)} //  店铺selected
                  isSelected={isSelected}
                  toggle={toggle}
                  toggleGroup={() => toggleGroup(c.shopId)} // 店铺onChange
                />
              ))}
            </div>

            <div className="mt-10  sticky bottom-0 border-t-[1px] bg-white z-10 card-cart">
              <div className="p-3 flex gap-2">
                <Checkbox isSelected={isAllSelected} onChange={toggleSelectAll}>
                  {t("selectAll")}
                </Checkbox>
                <Button
                  className="text-[#f0700c]"
                  isDisabled={!hasSelected}
                  size="sm"
                  variant="light"
                  onPress={() => {
                    setModal({
                      type: "delete",
                      productId: selectedIds as string[],
                    });
                  }}
                >
                  {t("delete")}
                </Button>
              </div>
              <Divider />
              <div className="flex justify-between items-center p-4 gap-4 ">
                <div className="flex gap-4">
                  <span>{t("selected")}</span>
                  <span className="text-[#f0700c]">{selectedIds.length}</span>
                </div>
                <div className="flex items-center gap-8">
                  <p>
                    <span className="font-semibold ">{t("totalPayable")}</span>
                    <span className=" font-semibold  text-[#f0700c]">
                      {currency.symbol}
                      {togglePrice}
                    </span>
                  </p>

                  <Button
                    className="w-[150px]"
                    color="primary"
                    isDisabled={!hasSelected}
                    isLoading={isSubmitting}
                    size="lg"
                    onPress={handleCartSubmit}
                  >
                    {t("checkout")}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        <ConfirmModal
          content={t("confirmDeleteContent")} // 弹窗正文
          isOpen={modal.type === "delete"} // 根据状态控制显示
          title={t("confirmDeleteTitle")} // 弹窗标题
          onConfirm={async () => {
            if (!modal?.productId) return;
            await handleCartDelete(modal.productId as string[]); // 调用删除逻辑
          }}
          onOpenChange={(open) => {
            if (!open) setModal({ type: null }); // 关闭时清空待删除 id
          }}
        />
        <CommonModal
          isOpen={modal.type === "remark"}
          title={t("remarkTitle")}
          onConfirm={submitRemark}
          onOpenChange={(open) => {
            if (!open) setModal({ type: null }); // 关闭时清空待删除 id
          }}
        >
          <Textarea
            placeholder={t("remarkPlaceholder")}
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
          />
        </CommonModal>
      </div>
    </div>
  );
}
