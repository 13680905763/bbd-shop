"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCamera } from "react-icons/fa";
import { Image } from "antd";

import OrderItem from "./order-item";

import {
  BusinessProgress,
  FullscreenLoader,
  ProductItemTitle,
} from "@/components/ui";
import { ProductItem } from "@/components/block";
import CommonModal from "@/components/modal/common-modal";
import { useOrderPreview, useServices } from "@/hook";
import {
  createOrderByCart,
  createOrderByProduct,
  updateOrderPreviewCart,
  updateOrderPreviewProduct,
} from "@/services";
import { useGlobalStore } from "@/store";
import { createOrderPreviewKeyByProductParams } from "@/types";
import { queryClient } from "@/lib/react-query";
import Stepper from "@/components/stepper";
import { safeMul } from "@/utils/number";
import { useConfirm } from "@/components/common/modal/confirm-provider";

export default function SubmitOrder() {
  const t = useTranslations("SubmitOrder");
  const { currency } = useGlobalStore();
  const { confirm } = useConfirm();
  const searchParam = useSearchParams();
  const router = useRouter();
  const type = searchParam.get("type") as "cart" | "product";
  const key = searchParam.get("key") as string;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const t1 = useTranslations("dashboard.cart");

  const { data, isLoading } = useOrderPreview(type, key);

  useEffect(() => {
    if (data?.expirationList?.length > 0) {
      confirm({
        title: t1("itemExpired"),
        content: (
          <div className="w-full">
            <div className="text-gray-500 mb-4">{t1("itemExpiredContent")}</div>
            <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-2">
              {data.expirationList.map((item: any) => (
                <OrderItem
                  key={item.shopName}
                  isExpired={true}
                  openServiceModal={openServiceModal}
                  order={item}
                  texts={t.raw("OrderItem")}
                />
              ))}
            </div>
          </div>
        ),
        onConfirm: () => {
          queryClient.invalidateQueries({
            queryKey: ["cartList"],
          });
          router.back();
        },
        showCancel: false,
        hideCloseButton: true,
        size: "4xl",
        confirmText: t1("back"),
      });
    }
  }, [data, t1, confirm, router]);

  const {
    data: services,
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useServices();
  const [orderData, setOrderData] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // 本地状态：存储服务列表
  const [localServices, setLocalServices] = useState<any[]>([]);

  // 弹窗状态
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);

  // 当前操作的商品ID
  const [currentCartId, setCurrentCartId] = useState<string | null>(null);

  // 当前服务详情对象
  const [currentService, setCurrentService] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) setOrderData(data);
  }, [data]);

  // 打开商品服务列表弹窗
  const openServiceModal = (cartId: string, skuId: string) => {
    setCurrentCartId(cartId);
    const handleSO = orderData?.orderList?.find((item: any) => {
      return item?.products.find((iitem: any) => {
        return iitem?.propAndValue?.propId_valueId == skuId;
      });
    });
    const hanldeSer =
      handleSO.products
        .find((item: any) => {
          return item?.propAndValue?.propId_valueId == skuId;
        })
        ?.orderServiceList?.map((item: any) => {
          return {
            id: item?.id,
            quantity: item?.quantity || 1,
            remark: item?.remark || "",
          };
        }) || [];

    console.log("hanldeSer", hanldeSer);
    // 克隆服务，初始化 isCheck、remark
    setLocalServices(
      services.map((s: any) => {
        console.log(
          "hanldeSer.find((id: any) => id == s.id)",
          hanldeSer.find((item: any) => item.id == s.id),
        );

        return {
          ...s,
          isCheck: hanldeSer.find((item: any) => item.id == s.id)
            ? true
            : false,
          // remark: hanldeSer.find((id: any) => id == s.id).remark || "",
          remark: "",
          quantity:
            hanldeSer.find((item: any) => item.id == s.id)?.quantity || 1,
          // quantity: 1,
        };
      }),
    );
    onOpen();
  };

  // 打开某个服务详情
  const openServiceDetail = (serviceId: string) => {
    const service = localServices.find((s) => s.id === serviceId);

    console.log("service", service);

    if (!service) return;
    setCurrentService(service);
    setIsServiceDetailOpen(true);
  };

  // 保存服务详情备注
  const saveServiceDetail = () => {
    // 如果是基础拍照（id === 1），直接关掉弹窗，不修改 localServices
    if (currentService.id == 1) {
      setIsServiceDetailOpen(false);

      return;
    }
    setLocalServices((prev) =>
      prev.map((s) =>
        s.id === currentService.id
          ? {
            ...s,
            remark: currentService?.remark,
            isCheck: true,
            quantity: currentService?.quantity,
          }
          : s,
      ),
    );
    setIsServiceDetailOpen(false);
  };

  // 删除已选服务
  const removeService = (serviceId: string) => {
    setLocalServices((prev) =>
      prev.map((s) =>
        s.id === serviceId ? { ...s, isCheck: false, remark: "" } : s,
      ),
    );
  };

  // 修改 handleServiceSubmit
  const handleServiceSubmit = async () => {
    console.log("currentCartId", currentCartId);

    if (!currentCartId) return;

    const checkedServices = localServices
      .filter((s) => s.isCheck)
      .map((s) => ({
        serviceId: s.id,
        remark: s.remark,
        quantity: s.quantity,
      }));

    console.log("checkedServices", checkedServices);

    try {
      let res;

      if (type === "cart") {
        res = await updateOrderPreviewCart({
          ...orderData.param,
          previewList: orderData.param.previewList.map((item: any) =>
            item.cartId === currentCartId
              ? { ...item, serviceList: checkedServices }
              : item,
          ),
        });
      } else {
        res = await updateOrderPreviewProduct({
          ...orderData.param,
          serviceList: checkedServices,
        });
      }

      setOrderData(res);
      onOpenChange();
    } catch { }
  };
  const handleSubmitOrder = async () => {
    if (!isChecked) {
      await confirm({
        title: t("disclaimer"),
        content: t("disclaimerDescription"),
        onConfirm: () => setIsChecked(true),
      });

      return false;
    }
    if (submitting) return;
    setSubmitting(true);

    try {
      if (type === "cart") {
        const bizCode = await createOrderByCart(orderData?.param);

        await queryClient.removeQueries({ queryKey: ["cartList"] });
        await queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
        router.push("/payment/" + bizCode);
      } else {
        const bizCode = await createOrderByProduct(
          orderData?.param as createOrderPreviewKeyByProductParams,
        );

        await queryClient.removeQueries({ queryKey: ["cartList"] });
        await queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新

        router.push("/payment/" + bizCode);
      }
    } finally {
      console.log("手动刷新");
      setSubmitting(false);
    }
  };

  const togglePrice = useMemo(() => {
    const totalCents =
      orderData?.orderList?.reduce(
        (sum: number, item: any) =>
          sum + Math.round(Number(item?.totalFee || 0) * 100),
        0,
      ) || 0;

    return totalCents / 100;
  }, [orderData]);

  if (isLoading) return <FullscreenLoader />;

  return (
    <div className="container mx-auto bg-white p-4 py-6">
      <BusinessProgress currentStep={0} />

      <div className="text-title mt-4 mb-2">{t("confirmProductInfo")}</div>
      <div className="space-y-4">
        <ProductItemTitle />
        {orderData?.orderList?.map((order: any) => (
          <OrderItem
            key={order.shopName}
            openServiceModal={openServiceModal}
            order={order}
            texts={t.raw("OrderItem")}
          />
        ))}
      </div>

      {/* 协议和免责声明 */}
      <div className="text-right mt-5 p-4">
        <p className="text-sm text-[#fbbd8a] mb-2">
          <span className="hover:text-[#f0700c] cursor-pointer">
            《{t("declaration")}》
          </span>
          <span className="hover:text-[#f0700c] cursor-pointer ml-2">
            《{t("terms")}》
          </span>
          <span className="hover:text-[#f0700c] cursor-pointer ml-2">
            《{t("returnPolicy")}》
          </span>
          <span className="hover:text-[#f0700c] cursor-pointer ml-2">
            《{t("disclaimer")}》
          </span>
        </p>
        <Checkbox
          color="primary"
          isSelected={isChecked}
          size="sm"
          onValueChange={setIsChecked}
        >
          <span className="text-[#676969]">{t("agreement")}</span>
        </Checkbox>
        <div className="card-tip text-left !mb-0 mt-2">{t("notice")}</div>
      </div>

      <Divider className="mb-4" />

      <div className="flex justify-end items-center gap-4 mb-2">
        <div className="text-[#3d3d3d] text-sm flex items-center gap-1">
          {t("amountDue")}
        </div>
        <p className="text-price-xl">
          {currency.symbol}
          {togglePrice}
        </p>
        <Button
          className="w-[300px]"
          color="primary"
          isLoading={submitting}
          size="lg"
          onPress={handleSubmitOrder}
        >
          {t("submit")}
        </Button>
      </div>

      {/* 商品服务列表弹窗 */}
      <CommonModal
        isDismissable={false}
        isOpen={isOpen}
        title={t("valueAddedService")}
        onConfirm={handleServiceSubmit}
        onOpenChange={onOpenChange}
      >
        {localServices.map((service) => (
          <div key={service.id} className="items-center p-3 border rounded-lg ">
            <div className="flex justify-between items-center">
              <div className="font-medium">{service.serviceName}</div>
              {service.id == 1 ? (
                // 免费的 icon
                <button
                  className="flex items-center text-green-500 text-sm gap-1 h-8 w-16 justify-center"
                  onClick={() => openServiceDetail(service.id)}
                >
                  <FaCamera />
                  {t("free")}
                </button>
              ) : (
                <Button
                  className="button-white"
                  size="sm"
                  onPress={() => openServiceDetail(service.id)}
                >
                  {t("add")}
                </Button>
              )}
            </div>

            {service.isCheck && service.id != 1 && (
              <div className="bg-gray-50 px-3 py-2 rounded-lg mt-2 flex justify-between items-center border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {t("serviceItem")}
                  </span>
                  {service.remark && (
                    <span className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {t("remark")}: {service.remark}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-500">
                    x{service.quantity}
                  </span>
                  <span className="text-sm font-semibold text-red-500">
                    {currency.symbol}
                    {safeMul(service.quantity, service.price)}
                  </span>
                  <Button
                    className="text-[11px] px-2 h-6"
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => removeService(service.id)}
                  >
                    {t("delete")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CommonModal>

      {/* 服务详情弹窗 */}
      {currentService && (
        <CommonModal
          isDismissable={false}
          isOpen={isServiceDetailOpen}
          showCancel={currentService.id != 1}
          title={currentService.serviceName}
          onConfirm={saveServiceDetail}
          onOpenChange={setIsServiceDetailOpen}
        >
          <div className="space-y-5">
            {/* 服务介绍 */}
            <div className="bg-[#f8f8f8] p-4 rounded-lg space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {t("serviceIntro")}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {currentService.introduction || t("noIntro")}
                </p>
              </div>

              {/* 示例（id != 1 时才展示） */}
              {currentService.sample.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {t("sample")}
                  </h3>
                  <div
                    ref={containerRef}
                    className="relative"
                    style={{ width: "100%", overflow: "hidden" }}
                  >
                    <Image.PreviewGroup
                      preview={{
                        getContainer: () =>
                          containerRef.current || document.body, // 让预览挂在这个 div 内
                      }}
                    >
                      <div className="grid grid-cols-4 gap-2">
                        {currentService.sample.map((url: string) => (
                          <Image key={url} height={80} src={url} width={80} />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  </div>
                </div>
              )}
            </div>

            {/* 服务费（id != 1 时才展示） */}
            {currentService.id != 1 && (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm text-gray-700">{t("serviceFee")}</span>
                <div className="flex gap-2">
                  <span className="text-lg font-semibold text-rose-600">
                    {currency.symbol}
                    {currentService.price}
                  </span>
                  {currentService?.stacked == 1 ? (
                    <Stepper
                      value={currentService?.quantity}
                      onChange={(quantity) => {
                        console.log("quantity", quantity);

                        setCurrentService({
                          ...currentService,
                          quantity: quantity,
                        });
                      }}
                    />
                  ) : null}
                </div>
              </div>
            )}

            {/* 备注输入框（id != 1 时才展示） */}
            {currentService.id != 1 && (
              <Textarea
                className="w-full mt-2"
                minRows={3}
                placeholder={t("remarkPlaceholder")}
                value={currentService.remark}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    remark: e.target.value,
                  })
                }
              />
            )}
          </div>
        </CommonModal>
      )}
    </div>
  );
}
