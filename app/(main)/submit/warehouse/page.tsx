"use client";

import React, { useEffect, useState } from "react";
import { addToast, Button, Checkbox, Spinner, Textarea } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { AddAddressCard } from "./add-address-card";
import WarehouseCard from "./warehouse-card";

import Progress from "@/components/common/order-progress";
import { useAddressList, useWarehousePreview } from "@/hook";
import AddressCard from "@/components/common/address-card";
import {
  createWaybill,
  getWarehouseRoutesList,
  getWarehouseRoutesListByCC,
  getWarehouseServicesList,
} from "@/services";
import ServiceCard from "@/components/common/service-card";
import RouteCard from "@/components/common/route-card";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import AddressModal from "@/components/modal/address-modal";

type ModalType = "add" | "edit" | "delete" | null;

export default function SubmitOrder() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const key = searchParam.get("key") as string;
  const t = useTranslations("submit.warehouse");

  const [submitting, setSubmitting] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  // 附加服务相关
  const [loadingService, setLoadingService] = useState(true);
  const [servicesList, setServicesList] = useState<any[]>([]);

  // 路由路线相关
  const [loadingRoute, setLoadingRoute] = useState(true);
  const [routesList, setRoutesList] = useState<any[]>([]);
  const [routesMessage, setRoutesMessage] = useState<string>("");

  const { data, isLoading, isError } = useWarehousePreview(key);
  const { data: addressData } = useAddressList();

  // 都用 string 类型 id 进行比较
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [selectedServices, setSelectedServices] = useState<
    { id: string; quantity: number }[]
  >([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [currentRowData, setCurrentRowData] = useState<any>(null);
  const [modalType, setModalType] = useState<ModalType>(null);

  // 初始化加载 附加服务 所有路由路线
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 两个请求并行
        const [serviceRes, routeRes] = await Promise.all([
          getWarehouseServicesList(),
          getWarehouseRoutesList(),
        ]);

        setServicesList(serviceRes || []);
        setRoutesList(routeRes || []);
      } catch {
        // 遇到异常时至少保证不挂
        setServicesList([]);
        setRoutesList([]);
      } finally {
        setLoadingService(false);
        setLoadingRoute(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const countryId = addressData?.find(
      (item) => item.id == selectedAddressId,
    )?.countryId;

    if (!countryId) return;
    setLoadingRoute(true);
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
      .finally(() => {
        setLoadingRoute(false);
      });
  }, [selectedAddressId]);
  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const exists = prev.find((item) => item.id === id);

      if (exists) {
        // 取消选择
        return prev.filter((item) => item.id !== id);
      }

      // 新增：默认数量 1
      return [...prev, { id, quantity: 1 }];
    });
  };
  const handleCountChange = (id: string, nextCount: number) => {
    setSelectedServices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: nextCount } : item,
      ),
    );
  };
  const handleCartSubmit = async () => {
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
        serviceList: selectedServices.map((service) => ({
          serviceId: service?.id,
          quantity: service?.quantity,
          remark: "",
        })),
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

  const handleAdd = () => {
    setModalType("add");
  };
  const handleEdit = (row: any) => {
    setCurrentRowData(row);
    setModalType("edit");
  };

  if (isLoading || loadingService) return <FullscreenLoader />;

  return (
    <div className="container mx-auto bg-[#fff] p-4 py-6">
      <Progress currentStep={2} />

      <div className="flex container gap-10">
        {/* 左侧内容 */}
        <div className="flex-[5] flex flex-col gap-8">
          {/* 商品 */}
          <div>
            <div className="text-title">{t("commodityList")}</div>
            <div className="flex gap-4 flex-col">
              {data?.packageItemList?.map((warehouse: any) => (
                <WarehouseCard key={warehouse?.id} warehouse={warehouse} />
              ))}
            </div>
          </div>

          {/* 服务（多选） */}
          <div>
            <div className="text-title">{t("packagingMethod")}</div>
            <div className="grid grid-cols-4 gap-4">
              {servicesList?.map((svc) => {
                const selectedItem = selectedServices.find(
                  (item) => item.id === String(svc.id),
                );

                return (
                  <ServiceCard
                    key={svc.id}
                    {...svc}
                    isSelected={!!selectedItem}
                    quantity={
                      selectedServices.find((s) => s.id === svc.id)?.quantity ||
                      1
                    }
                    onCountChange={handleCountChange}
                    onSelect={() => toggleService(String(svc.id))}
                  />
                );
              })}
            </div>
          </div>
          {/* 地址 */}
          <div>
            <div className="text-title">{t("shippingAddress")}</div>
            <div className="grid grid-cols-3 gap-4">
              {addressData?.length === 0
                ? null
                : addressData?.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      data={addr}
                      isDisabled={loadingRoute}
                      isSelected={selectedAddressId === String(addr.id)}
                      onEdit={() => handleEdit(addr)}
                      onSelect={(id: string | null) => setSelectedAddressId(id)}
                    />
                  ))}
              <AddAddressCard onAdd={handleAdd} />
            </div>
          </div>
          {/* 路线 */}
          <div>
            <div className="text-title">{t("deliveryRoute")}</div>

            {/* 如果在加载，优先显示 loading */}
            {loadingRoute ? (
              <div className="flex h-[20vh] items-center justify-center">
                <Spinner />
              </div>
            ) : (
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
            )}
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
              onPress={handleCartSubmit}
            >
              {t("submit")}
            </Button>

            <Checkbox isSelected={isCheck} size="sm" onValueChange={setIsCheck}>
              {t("agreement")}
            </Checkbox>
          </div>
        </div>

        <AddressModal
          defaultData={currentRowData}
          isOpen={modalType === "add" || modalType === "edit"}
          type={modalType === "add" ? "add" : "edit"}
          onOpenChange={(open) => {
            if (!open) setModalType(null);
          }}
        />
      </div>
    </div>
  );
}
