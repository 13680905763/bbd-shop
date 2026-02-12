"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { addToast, Button, Checkbox, Spinner, Textarea } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import WarehouseServiceCard from "./werahouse-service-card";

import { useGlobalStore } from "@/store";
import RouteCard from "@/components/common/route-card";
import {
  BlockSpinner,
  BusinessProgress,
  FullscreenLoader,
} from "@/components/ui";
import AddressModal from "@/components/modal/address-modal";
import {
  useCreateWaybill,
  useWarehouseServicesList,
  useWaybillFeeEstimate,
  useWaybillPreview,
} from "@/hook/api";
import { AddAddress, PackageProductItem } from "@/components/block";
import { useEnhancedSelection } from "@/hook/common";
import { useAddressList } from "@/hook";
import AddressItem from "@/components/block/address-item";
import { Address, AddressModalState } from "@/types";
import { routesApi } from "@/services/routesApi";

export default function SubmitOrder() {
  const { currency } = useGlobalStore();
  const t = useTranslations("submit.warehouse");
  const router = useRouter();
  const searchParam = useSearchParams();
  const key = searchParam.get("key") as string;

  const [modalState, setModalState] = useState<AddressModalState>({
    type: null,
  });
  // 都用 string 类型 id 进行比较
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const { data, isLoading } = useWaybillPreview(key);
  const { data: serviceList } = useWarehouseServicesList();
  const { data: addressList } = useAddressList();
  const { mutateAsync: createWaybillAsync, isPending } = useCreateWaybill();

  const {
    items: services, // 渲染数据（包含 isSelected 和 quantity）
    toggleSelection, // 切换选中状态
    updateQuantity, // 更新数量
    getSelectedItems, // 获取选中结果
  } = useEnhancedSelection(serviceList);

  const getSelectedServices = useCallback(() => {
    return getSelectedItems().map((item) => ({
      serviceId: item.id,
      quantity: item.quantity,
      remark: item.remark,
    }));
  }, [getSelectedItems]);

  const estimatePayload = useMemo(() => {
    if (!selectedRouteId || !selectedAddressId || !data?.param) return null;

    return {
      serviceList: getSelectedServices(),
      templateId: selectedRouteId,
      addressId: selectedAddressId,
      ...data.param,
    };
  }, [selectedRouteId, selectedAddressId, getSelectedServices, services]);

  const { data: feeEstimate, isFetching: isEstimating } =
    useWaybillFeeEstimate(estimatePayload);

  useEffect(() => {
    if (estimatePayload && feeEstimate) {
      console.log("Fee Estimating:", feeEstimate);
    }
  }, [estimatePayload]);

  const [isCheck, setIsCheck] = useState(false);
  // 路由路线相关
  const [isRouteEstimating, setIsRouteEstimating] = useState(false);
  const [routesList, setRoutesList] = useState<any[]>([]);
  const [routesMessage, setRoutesMessage] = useState<string>(
    t("defaultMessage"),
  );

  useEffect(() => {
    const countryId = addressList?.find(
      (item) => item.id == selectedAddressId,
    )?.countryId;

    if (!countryId) return;
    setIsRouteEstimating(true);
    routesApi
      .byCategoryAndCountry({
        categoryIds: data?.packageItemList.map((item: any) => item?.categoryId),
        countryId,
        weight: data?.outbound?.estimateTotalWeight,
        volume: data?.outbound?.estimateTotalVolume,
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
      .finally(() => {
        setIsRouteEstimating(false);
      });
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
    const payload = {
      serviceList: getSelectedServices(),
      templateId: selectedRouteId,
      addressId: selectedAddressId,
      remark,
      ...data.param,
    };

    console.log("提交数据", payload);

    // 调接口
    await createWaybillAsync(payload);
    router.push(`/dashboard/package`);
  };

  if (isLoading) return <FullscreenLoader />;

  return (
    <div className="container mx-auto bg-[#fff] p-4 py-6">
      <BusinessProgress currentStep={2} />
      <div className="flex container gap-10">
        {/* 左侧内容 */}
        <div className="flex-[5] space-y-4">
          {/* 商品 */}
          <div>
            <div className="text-title">{t("commodityList")}</div>
            <div className="space-y-2">
              {data?.packageItemList?.map((item: any) => (
                <PackageProductItem
                  key={item?.id}
                  isBorder={true}
                  packageItem={item}
                />
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
                    onSelect={toggleSelection}
                    onUpdateQuantity={updateQuantity}
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
                  selected={selectedAddressId === String(addressDetail.id)}
                  showDeleteButton={false}
                  onEdit={handleEditClick}
                  onSelect={() => setSelectedAddressId(addressDetail.id)}
                />
              ))}
              <AddAddress type="address" onAdd={handleAddClick} />
            </div>
          </div>
          {/* 路线 */}
          <div className="relative">
            <div className="text-title">{t("deliveryRoute")}</div>
            <div className="flex flex-col gap-4">
              {isRouteEstimating && <BlockSpinner />}
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
            <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-xl mt-4">
              <div className="flex-1 min-w-[140px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-orange-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {t("totalWeight")}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {data?.outbound?.estimateTotalWeight || 0}
                  <span className="text-base font-normal text-gray-500 ml-1">
                    g
                  </span>
                </p>
              </div>

              <div className="flex-1 min-w-[140px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        clipRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {t("totalVolume")}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {data?.outbound?.estimateTotalVolume || 0}
                  <span className="text-base font-normal text-gray-500 ml-1">
                    cm³
                  </span>
                </p>
              </div>
            </div>
            {isEstimating ? (
              <div className="mt-2 p-4   text-sm rounded-lg text-center flex items-center justify-center">
                <div>{t("estimating")}</div>
                <Spinner className=" ml-2" />
              </div>
            ) : (
              feeEstimate?.outbound && (
                <div className="mt-4 p-4  bg-gray-100 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {t("estimatedShipping")}
                    </span>
                    <span className="font-medium">
                      {currency.symbol}
                      {feeEstimate?.outbound.estimateShippingFee}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {t("estimatedService")}
                    </span>
                    <span className="font-medium">
                      {currency.symbol}
                      {feeEstimate.outbound.serviceFee}
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">
                      {t("estimatedTotal")}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {currency.symbol}
                      {feeEstimate.outbound.totalFee}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 text-left">
                    {t("estimatedTip")}
                  </div>
                </div>
              )
            )}
            <Button
              className="w-full my-4"
              color="primary"
              isLoading={isPending}
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
