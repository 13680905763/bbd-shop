"use client";
import React, { useEffect, useState } from "react";
import { addToast, Button, Checkbox, useDisclosure } from "@heroui/react";
import NextLink from "next/link";

import ShopCard from "./shop-card";

import Progress from "@/components/progress";
import { useCart } from "@/services/hooks/useCart";
import { deleteCart } from "@/services/api/cart";
import ConfirmModal from "@/components/confirm-modal";
export type Product = {
  id: string;
  productTitle: string;
  sku: {
    propName_valueName: string;
  };
  skuPicUrl: string;
  remark?: string;
  totalPrice: number;
  price: number;
  postFee: number;
  quantity: number;
};

export type Shop = {
  shopId: string;
  shopName: string;
  cartList: Product[];
};

export default function CartPage() {
  console.log("cart render");

  const { cartData, isLoading, isError, mutate } = useCart();
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState<{
    [shopId: string]: { [productId: string]: boolean };
  }>({});

  function getSelectedProductIds(
    selected: Record<string, Record<string, boolean>>,
  ): string[] {
    const selectedIds: string[] = [];

    for (const shopId in selected) {
      const productMap = selected[shopId];

      for (const productId in productMap) {
        if (productMap[productId]) {
          selectedIds.push(productId);
        }
      }
    }

    return selectedIds;
  }
  const handleDeleteCart = (onClose: any) => {
    const selectedIdArr = getSelectedProductIds(selected);

    deleteCart({ idList: selectedIdArr }).then((e: any) => {
      if (e.success) {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
        onClose();
        mutate();
      } else {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
      }
    });
  };
  const handleCart = () => {
    const selectedIdArr = getSelectedProductIds(selected);

    if (selectedIdArr.length > 0) {
      if (isEdit) {
        onOpen();
        console.log("删除", { idList: selectedIdArr });
      } else {
        console.log("结算");
      }
    } else {
      addToast({
        title: "请先选择商品",
        timeout: 1000,
        // color: "success",
      });
    }
  };

  // 商品勾选
  const toggleItem = (shopId: string, productId: string, checked: boolean) => {
    console.log(shopId, productId, checked);

    setSelected((prev) => ({
      ...prev,
      [shopId]: {
        ...prev[shopId],
        [productId]: checked,
      },
    }));
  };
  // 是否所有商品都选中
  const isAllSelected = () =>
    cartData.every((shop: any) => {
      return shop.cartList.every(
        (product: any) => selected[shop.shopId]?.[product.id],
      );
    });
  // 店铺全选
  const toggleShop = (shop: any, checked: boolean) => {
    setSelected((prev) => {
      const next = { ...prev };

      next[shop.shopId] = {};

      shop.cartList.forEach((product: any) => {
        next[shop.shopId][product.id] = checked;
      });

      return next;
    });
  };

  // 全选
  const toggleAll = (checked: boolean) => {
    const newSelected: typeof selected = {};

    cartData.forEach((shop: any) => {
      newSelected[shop.shopId] = {};
      shop.cartList.forEach((product: any) => {
        newSelected[shop.shopId][product.id] = checked;
      });
    });
    setSelected(newSelected);
  };

  useEffect(() => {
    if (cartData) {
      const init: typeof selected = {};

      cartData.forEach((shop: any) => {
        init[shop.shopId] = {};
        shop.cartList.forEach((product: any) => {
          init[shop.shopId][product.id] = false; // 初始不选中
        });
      });
      console.log("init", init);

      setSelected(init);
    }
  }, [cartData]);
  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>出错了</div>;

  return (
    <div className="flex flex-col h-[100%]">
      <div className="mt-5">
        <Progress
          currentStep={0}
          steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
        />
      </div>
      <div className="  rounded-2xl  flex  flex-col  w-full justify-between max-h-[800px]">
        <div className="felx-1 mb-4">
          全部商品 |
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? "取消" : "管理"}
          </button>
        </div>

        <div className="overflow-y-auto flex flex-col gap-4">
          {cartData.map((shop: any) => (
            <ShopCard
              key={shop.shopId}
              mutate={mutate}
              selectedMap={selected[shop.shopId] || {}}
              shop={shop}
              onToggleItem={(productId, checked) =>
                toggleItem(shop.shopId, productId, checked)
              }
              onToggleShop={(checked) => toggleShop(shop, checked)}
            />
          ))}
        </div>

        <div className="felx-1 rounded-lg bg-white pt-4  flex justify-between items-center ">
          <div>
            <Checkbox
              isSelected={isAllSelected()}
              onChange={(e) => toggleAll(e.target.checked)}
            >
              全选
            </Checkbox>
          </div>
          <div className="flex gap-2 items-center">
            {isEdit ? (
              <Button
                className="min-w-[120px]"
                color="primary"
                size="lg"
                onPress={handleCart}
              >
                删除
              </Button>
            ) : (
              <>
                <div>总计</div>
                <NextLink href="/order/submit-order">
                  <Button className="min-w-[120px]" color="primary" size="lg">
                    提交订单
                  </Button>
                </NextLink>
              </>
            )}
          </div>
        </div>

        <ConfirmModal
          content="确定要删除当前商品吗？"
          isOpen={isOpen}
          title="删除购物车"
          onConfirm={handleDeleteCart}
          onOpenChange={onOpenChange}
        />
      </div>
    </div>
  );
}
