"use client";
import React, { useEffect, useState } from "react";
import {
  addToast,
  Button,
  Checkbox,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Image,
} from "@heroui/react";
import NextLink from "next/link";

import Progress from "@/components/progress";
import { useCart } from "@/services/hooks/useCart";
import { deleteCart } from "@/services/api/cart";
import Stepper from "@/components/stepper";
import { priceFont } from "@/components/primitives";

export default function CartPage() {
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
            <div
              key={shop.shopId}
              className="bg-[#fff] rounded-md  w-full border border-[#ccc] "
            >
              <div className="p-4">
                <Checkbox
                  isSelected={shop.cartList.every(
                    (p: any) => selected[shop.shopId]?.[p.id],
                  )}
                  onChange={(checked) =>
                    toggleShop(shop, checked.target.checked)
                  }
                />
                {shop.shopName}
              </div>

              <Divider />
              <div className="flex flex-col gap-4 p-4">
                {shop?.cartList?.map((product: any) => (
                  <div
                    key={product?.id}
                    className="flex justify-between items-center  gap-4 "
                  >
                    <div className=" flex ">
                      <Checkbox
                        isSelected={selected[shop.shopId]?.[product.id]}
                        onChange={(checked) =>
                          toggleItem(
                            shop.shopId,
                            product.id,
                            checked.target.checked,
                          )
                        }
                      />
                      <Image
                        alt="Product"
                        height={90}
                        src={product?.skuPicUrl}
                        width={90}
                      />
                    </div>
                    <div className="flex-[2] ">
                      <div className="line-clamp-2 text-base font-bold">
                        {product.productTitle}
                      </div>
                      <div className="text-light-gray line-clamp-1">
                        {product.sku.propName_valueName}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-money-lg">
                        总计: ${product.totalPrice}
                      </div>
                      <div
                        className={priceFont({
                          color: "black",
                          size: "sm",
                          weight: "normal",
                        })}
                      >
                        单价: ${product.price}
                      </div>
                      <div className="text-light-gray">
                        国内运费 {product.postFee}
                      </div>
                    </div>

                    <div>
                      <Stepper />
                    </div>

                    <div className="flex justify-center gap-2 flex-1">
                      <Button className="button-default " size="sm">
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
        <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  删除购物车
                </ModalHeader>
                <ModalBody>
                  <p>确定要删除购物车的内容嘛？</p>
                </ModalBody>
                <ModalFooter className="flex gap-2">
                  <Button
                    className="flex-1 button-default"
                    variant="light"
                    onPress={onClose}
                  >
                    取消
                  </Button>
                  <Button
                    className="flex-1"
                    color="primary"
                    onPress={() => handleDeleteCart(onClose)}
                  >
                    删除
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
