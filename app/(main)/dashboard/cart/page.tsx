"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  addToast,
  Button,
  Checkbox,
  Divider,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import ShopCard from "./shop-card";

import Progress from "@/components/common/progress";
import ConfirmModal from "@/components/modal/confirm-modal";
import {
  createOrderPreviewKeyByCart,
  deleteCart,
  updateCart,
} from "@/services";
import { useCartList } from "@/hook";
import CommonModal from "@/components/modal/common-modal";

export default function CartPage() {
  const { data, isLoading, isError } = useCartList();
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<{
    [shopId: string]: { [productId: string]: boolean };
  }>({});

  // 当前要删除的商品 id（单个为 string，批量为 string[]，默认 null）
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[] | null>(
    null,
  );
  const [pendingRemarkProductId, setPendingRemarkProductId] = useState<
    string | null
  >(null);
  const [remarkText, setRemarkText] = useState("");
  const {
    isOpen: isOpenRemark,
    onOpen: onOpenRemark,
    onOpenChange: onOpenChangeRemark,
  } = useDisclosure();
  const router = useRouter();
  const handleCartSubmit = async () => {
    if (selectedIdArr.length > 0) {
      const previewList = selectedIdArr.map((cartId: string) => ({
        cartId,
        serviceList: [],
      }));
      const key: any = await createOrderPreviewKeyByCart({
        previewList,
      });

      router.push("/order/submit-order?type=cart&key=" + key);
    } else {
      addToast({
        title: "请先选择商品",
        timeout: 1000,
        // color: "success",
      });
    }
  };
  const handleDeleteCart = async (idList: string[], onClose: () => void) => {
    try {
      const tip = await deleteCart({ idList });

      addToast({ title: tip, timeout: 1000, color: "success" });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
    } catch (e) {}
  };
  const handleDelCart = () => {
    if (selectedIdArr.length > 0) {
      console.log("删除", { idList: selectedIdArr });
      setPendingDeleteIds(selectedIdArr);
    } else {
      addToast({
        title: "请先选择商品",
        timeout: 1000,
      });
    }
  };
  const handleProductDelete = (productId: string) => {
    setPendingDeleteIds([productId]);
  };
  const handleProductQuantity = async (productId: string, quantity: number) => {
    try {
      const tip = await updateCart([
        {
          id: productId,
          quantity,
        },
      ]);

      addToast({ title: tip, timeout: 1000, color: "success" });
    } catch (e) {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
    }
  };
  const handleProductRemark = (productId: string, remark: string) => {
    setPendingRemarkProductId(productId);
    setRemarkText(remark);
    onOpenRemark();
  };

  const submitRemark = async () => {
    if (!pendingRemarkProductId) return;
    try {
      const res = await updateCart([
        {
          id: pendingRemarkProductId,
          remark: remarkText,
        },
      ]);

      addToast({ title: res, timeout: 1000, color: "success" });
      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 刷新
    } catch (e) {
    } finally {
      onOpenChangeRemark();
      setPendingRemarkProductId(null);
      setRemarkText("");
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

  const allSelected = useMemo(() => {
    return data?.every((shop) =>
      shop.cartList.every((product) => selected[shop.shopId]?.[product.id]),
    );
  }, [data, selected]);
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

    data?.forEach((shop) => {
      newSelected[shop.shopId] = {};
      shop.cartList.forEach((product) => {
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
    return data
      ?.flatMap((shop) => shop.cartList) // 拍平所有商品
      ?.filter((item) => selectedIdArr.includes(item.id)) // 过滤选中项
      ?.reduce((sum, item) => sum + item?.unitPrice * item.quantity, 0); // 累加价格
  }, [selected]);

  useEffect(() => {
    if (data) {
      const init: typeof selected = {};

      data.forEach((shop: any) => {
        init[shop.shopId] = {};
        shop.cartList.forEach((product: any) => {
          init[shop.shopId][product.id] = false; // 初始不选中
        });
      });
      console.log("init", init);

      setSelected(init);
    }
  }, [data]);
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
          全部商品 ({data?.flatMap((shop) => shop.cartList).length})
        </div>

        <div className="flex flex-col gap-4">
          {data?.map((shop) => (
            <ShopCard
              key={shop.shopId}
              handleProductDelete={handleProductDelete}
              handleProductQuantity={handleProductQuantity}
              handleProductRemark={handleProductRemark}
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
              isSelected={allSelected}
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
              <p className="text-price-lg"> {togglePrice}</p>
              <Button
                className="w-[200px]"
                color="primary"
                size="lg"
                onPress={handleCartSubmit}
              >
                下单结算
              </Button>
            </div>
          </div>
        </div>

        <ConfirmModal
          content="确定要删除当前商品吗？"
          isOpen={!!pendingDeleteIds}
          title="删除购物车"
          onConfirm={(onClose) => {
            if (pendingDeleteIds) {
              handleDeleteCart(pendingDeleteIds, onClose);
            }
          }}
          onOpenChange={() => setPendingDeleteIds(null)}
        />
        <CommonModal
          isOpen={isOpenRemark}
          title="备注"
          onConfirm={submitRemark}
          onOpenChange={onOpenChangeRemark}
        >
          <Textarea
            placeholder="请输入备注"
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
          />
        </CommonModal>
      </div>
    </div>
  );
}
