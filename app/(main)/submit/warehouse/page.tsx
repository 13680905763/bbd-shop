"use client";

import React, { useCallback, useEffect, useState } from "react";
import { addToast, Button, Checkbox, Spinner, Textarea } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";


import Progress from "@/components/common/order-progress";
import { useAddressList } from "@/hook";
import {
  createWaybill,
  getWarehouseRoutesListByCC,
} from "@/services";
import WarehouseServiceCard from "./werahouse-service-card";
import RouteCard from "@/components/common/route-card";
import { FullscreenLoader } from "@/components/ui";
import AddressModal from "@/components/modal/address-modal";
import { useWarehouseServicesList, useWaybillPreview } from "@/hook/api";
import { AddAddress, PackageProductItem } from "@/components/block";
import { useServiceSelection } from "@/hook/common";
import AddressItem from "@/components/block/address-item";
import { Address, AddressModalState } from "@/types";


export default function SubmitOrder() {
  const t = useTranslations("submit.warehouse");
  const router = useRouter();
  const searchParam = useSearchParams();
  const key = searchParam.get("key") as string;

  const [modalState, setModalState] = useState<AddressModalState>({
    type: null,
  });

  const { data, isLoading } = useWaybillPreview(key);
  const { data: serviceList } = useWarehouseServicesList();
  const { data: addressList } = useAddressList();

  const {
    services,           // 渲染数据（包含 isSelected 和 quantity）
    toggleSelection,    // 切换选中状态
    updateQuantity,     // 更新数量
    getSelectedServices // 获取选中结果
  } = useServiceSelection(serviceList);


  const [submitting, setSubmitting] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  // 路由路线相关
  const [routesList, setRoutesList] = useState<any[]>([]);
  const [routesMessage, setRoutesMessage] = useState<string>(t("defaultMessage"));

  // 都用 string 类型 id 进行比较
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");


  useEffect(() => {
    const countryId = addressList?.find(
      (item) => item.id == selectedAddressId,
    )?.countryId;

    if (!countryId) return;
    getWarehouseRoutesListByCC({
      categoryIds: data?.packageItemList.map((item: any) => item?.categoryId),
      countryId,
    })
      .then((res) => {
        console.log("res", res, typeof res != "string", res?.length);
        if (typeof res != "string" && res?.length) {
          setRoutesList(res || []);
        } else {
          setSelectedRouteId("");
          setRoutesList([]);
          setRoutesMessage(res);
        }
      })

  }, [selectedAddressId]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setModalState({ type: null });
  }, []);
  const handleAddClick = useCallback(() => {
    setModalState({ type: "add" });
  }, []);
  const handleEditClick = useCallback((address: Address) => {
    setModalState({ type: "edit", address });
  }, []);

  const handleSubmitWaybill = async () => {
    if (!isCheck) {
      return addToast({
        title: t("toast.agreementRequired"),
        timeout: 1500,
        color: "warning",
      });
    }
    if (!selectedAddressId) {
      return addToast({
        title: t("toast.addressRequired"),
        timeout: 1500,
        color: "warning",
      });
    }
    if (!selectedRouteId) {
      return addToast({
        title: t("toast.routeRequired"),
        timeout: 1500,
        color: "warning",
      });
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = {
        serviceList: getSelectedServices(),
        templateId: selectedRouteId,
        addressId: selectedAddressId,
        remark,
        ...data.param,
      };

      console.log("提交数据", payload);

      // 调接口
      await createWaybill(payload);
      router.push(`/dashboard/package`);
    } finally {
      setSubmitting(false);
    }
  };
  if (isLoading) return <FullscreenLoader />;

  return (
    <div className="container mx-auto bg-[#fff] p-4 py-6">
      <Progress currentStep={2} />
      <div className="flex container gap-10">
        {/* 左侧内容 */}
        <div className="flex-[5] space-y-4">
          {/* 商品 */}
          <div>
            <div className="text-title">{t("commodityList")}</div>
            <div className="space-y-2">
              {data?.packageItemList?.map((item: any) => (
                <PackageProductItem key={item?.id} isBorder={true} packageItem={item} />
              ))}
            </div>
          </div>
          {/* 服务（多选） */}
          <div>
            <div className="text-title">{t("packagingMethod")}</div>
            <div className="grid grid-cols-4 gap-2">
              {services?.map((service: any) => {
                return (
                  <WarehouseServiceCard
                    key={service.id}
                    service={service}
                    onUpdateQuantity={updateQuantity}
                    onSelect={toggleSelection}
                  />
                );
              })}
            </div>
          </div>
          {/* 地址 */}
          <div>
            <div className="text-title">{t("shippingAddress")}</div>
            <div className="grid grid-cols-3 gap-4">
              {addressList?.map((addressDetail: Address) => (
                <AddressItem
                  key={addressDetail.id}
                  addressDetail={addressDetail}
                  selectable={true}
                  showDeleteButton={false}
                  selected={selectedAddressId === String(addressDetail.id)}
                  onSelect={() => setSelectedAddressId(addressDetail.id)}
                  onEdit={handleEditClick}
                />
              ))}
              <AddAddress onAdd={handleAddClick} type="address" />
            </div>
          </div>
          {/* 路线 */}
          <div>
            <div className="text-title">{t("deliveryRoute")}</div>
            <div className="flex flex-col gap-4">
              {routesList?.map((route) => (
                <RouteCard
                  key={route.id}
                  data={route}
                  isSelected={selectedRouteId === String(route.id)}
                  onSelect={(id) => setSelectedRouteId(String(id))}
                />
              ))}
              {routesList?.length < 1 && (
                <div className="flex flex-col items-center justify-center h-[20vh] text-gray-500">
                  <p className="text-lg mb-2">{routesMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧操作栏 */}
        <div className="flex-[2]">
          <div className="sticky top-20 h-[calc(100vh-80px)]">
            <div className="text-title">{t("leavingMessage")}</div>
            <Textarea
              fullWidth
              placeholder={t("placeholder")}
              size="lg"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            <Button
              className="w-full my-4"
              color="primary"
              isLoading={submitting}
              radius="sm"
              size="lg"
              onPress={handleSubmitWaybill}
            >
              {t("submit")}
            </Button>
            <Checkbox isSelected={isCheck} size="sm" onValueChange={setIsCheck}>
              {t("agreement")}
            </Checkbox>
          </div>
        </div>
        <AddressModal
          defaultData={
            modalState.type === "edit" ? modalState.address : undefined
          }
          isOpen={modalState.type === "add" || modalState.type === "edit"}
          type={modalState.type === "add" ? "add" : "edit"}
          onOpenChange={handleOpenChange}
        />
      </div>
    </div>
  );
}
