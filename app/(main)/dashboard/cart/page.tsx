"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  addToast,
  Button,
  Checkbox,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";

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
  source: string;
  sourceProductId: string;
};

export type Shop = {
  shopId: string;
  shopName: string;
  cartList: Product[];
};

export default function CartPage() {
  const { cartData, isLoading, isError, mutate } = useCart();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState<{
    [shopId: string]: { [productId: string]: boolean };
  }>({});
  const router = useRouter();

  const handleDeleteCart = (onClose: any) => {
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
  const handleDelCart = () => {
    if (selectedIdArr.length > 0) {
      onOpen();
      console.log("删除", { idList: selectedIdArr });
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
  const selectedIdArr = useMemo(() => {
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
  }, [selected]);
  const togglePrice = useMemo(() => {
    return cartData
      ?.flatMap((shop) => shop.cartList) // 拍平所有商品
      ?.filter((item) => selectedIdArr.includes(item.id)) // 过滤选中项
      ?.reduce((sum, item) => sum + item.totalPrice, 0); // 累加价格
  }, [selected]);

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
    <div className="h-full">
      <div className="mt-5">
        <Progress
          currentStep={0}
          steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
        />
      </div>
      <div className="">
        <div className="text-title">
          全部商品 ({cartData?.flatMap((shop) => shop.cartList).length})
        </div>

        <div className="flex flex-col gap-4">
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

        <div className="mt-10  sticky bottom-0 border-t-[1px] bg-white z-10 card-cart">
          <div className="p-2 flex gap-2">
            <Checkbox
              isSelected={isAllSelected()}
              onChange={(e) => toggleAll(e.target.checked)}
            >
              全选
            </Checkbox>
            <Button className="bg-transparent" onPress={handleDelCart}>
              删除商品
            </Button>
          </div>
          <Divider />
          <div className="flex justify-between items-center p-4 gap-4 ">
            <div className="flex gap-4">
              <span>已选</span>
              <span>{selectedIdArr.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-price-lg">PLN {togglePrice}</p>
              <Button
                className="w-[200px]"
                color="primary"
                size="lg"
                onPress={() => router.push("/order/submit-order")}
              >
                下单结算
              </Button>
            </div>
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
