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

export default function CartPage() {
  const t = useTranslations("Dashboard.CartPage");
  const { currency } = useGlobalStore();
  const { data, isLoading, isError, isFetching } = useCartList();

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
  const handleDeleteCart = async (idList: string[]) => {
    try {
      await deleteCart({ idList });
      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
    } catch {}
  };
  const handleDelCart = () => {
    if (!selectedIdArr.length) {
      addToast({
        color: "danger",
        title: t("selectItemFirst"), // 语言包示例: "Please select items first"
        timeout: 1000,
      });

      return;
    }
    // 打开确认弹窗
    setPendingDeleteIds([...selectedIdArr]); // 克隆数组，避免引用问题
  };
  const handleProductDelete = (productId: string) => {
    setPendingDeleteIds([productId]);
  };
  const handleProductQuantity = async (productId: string, quantity: number) => {
    try {
      await updateCart([
        {
          id: productId,
          quantity,
        },
      ]);

      console.log("6661");
      console.log("666");
      await queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
    } catch (e) {
    } finally {
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
    const totalCents = data
      ?.flatMap((shop) => shop.cartList) // 拍平所有商品
      ?.filter((item) => selectedIdArr.includes(item.id)) // 过滤选中项
      ?.reduce((sum, item) => {
        // 将 totalFee 转成分（乘100取整）
        const fee = Math.round((item?.totalFee ?? 0) * 100);

        return sum + fee;
      }, 0);

    // 最终除以100，保留两位小数
    return totalCents !== undefined ? (totalCents / 100).toFixed(2) : "0.00";
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
  console.log("isLoading", isLoading);

  if (isLoading || isFetching) return <FullscreenLoader />;
  if (isError) return <div>出错了</div>;
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
              {data?.map((item) => (
                <CartItem
                  key={item.shopId}
                  handleProductDelete={handleProductDelete}
                  handleProductQuantity={handleProductQuantity}
                  handleProductRemark={handleProductRemark}
                  selectedMap={selected[item.shopId] || {}}
                  shop={item}
                  texts={t.raw("item")}
                  onToggleItem={(productId, checked) =>
                    toggleItem(item.shopId, productId, checked)
                  }
                  onToggleShop={(checked) => toggleShop(item, checked)}
                />
              ))}
            </div>

            <div className="mt-10  sticky bottom-0 border-t-[1px] bg-white z-10 card-cart">
              <div className="p-3 flex gap-4">
                <Checkbox
                  isSelected={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                >
                  {t("selectAll")}
                </Checkbox>
                <button className="text-[#f0700c]" onClick={handleDelCart}>
                  {t("delete")}
                </button>
              </div>
              <Divider />
              <div className="flex justify-between items-center p-4 gap-4 ">
                <div className="flex gap-4">
                  <span>{t("selected")}</span>
                  <span className="text-[#f0700c]">{selectedIdArr.length}</span>
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
          isOpen={!!pendingDeleteIds} // 根据状态控制显示
          title={t("confirmDeleteTitle")} // 弹窗标题
          onConfirm={async () => {
            console.log("pendingDeleteIds", pendingDeleteIds);

            if (pendingDeleteIds) {
              await handleDeleteCart(pendingDeleteIds); // 调用删除逻辑
            }
          }}
          onOpenChange={(open) => {
            if (!open) setPendingDeleteIds(null); // 关闭时清空待删除 id
          }}
        />
        <CommonModal
          isOpen={isOpenRemark}
          title={t("remarkTitle")}
          onConfirm={submitRemark}
          onOpenChange={onOpenChangeRemark}
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
