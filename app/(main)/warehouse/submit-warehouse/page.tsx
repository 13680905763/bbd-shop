"use client";
import React, { useEffect, useState } from "react";
import { addToast, Button, Checkbox, Textarea } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

import WarehouseCard from "./warehouse-card";
import { AddAddressCard } from "./add-address-card";

import Progress from "@/components/common/order-progress";
import { useAddressList, useWarehousePreview } from "@/hook";
import AddressCard from "@/components/common/address-card";
import {
  addAddress,
  createWaybill,
  getWarehouseRoutesList,
  getWarehouseServicesList,
  updateAddress,
} from "@/services";
import ServiceCard from "@/components/common/service-card";
import RouteCard from "@/components/common/route-card";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import FormModal from "@/components/modal/form-modal";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { queryClient } from "@/lib/react-query";
const fieldsaddress: FieldConfig[] = [
  {
    key: "recipient",
    type: "input",
    name: "recipient",
    label: "收件人",
    placeholder: "请输入收件人姓名",
  },
  {
    key: "phone",

    type: "input",
    name: "phone",
    label: "联系方式",
    placeholder: "请输入联系方式",
  },
  {
    key: "area",

    type: "area",
    name: "area",
    label: "area",
    placeholder: "area",
  },

  {
    key: "address",

    type: "input",
    name: "address",
    label: "详细地址",
    placeholder: "请输入您详细地址",
  },
  {
    key: "doorNo",

    type: "input",
    name: "doorNo",
    label: "门牌号",
    placeholder: "请输入您的门牌号",
  },
  {
    key: "postcode",

    type: "input",
    name: "postcode",
    label: "邮编",
    placeholder: "请输入邮编",
  },

  {
    key: "defaultAddress",

    type: "checkbox",
    name: "defaultAddress",
    label: "设为默认地址",
  },
];
const initAddress = {
  recipient: "",
  phone: "",
  countryId: "",
  stateId: "",
  city: "",
  addressType: "",
  postcode: "",
  defaultAddress: 0,
  doorNo: "",
};

type ModalType = "add" | "edit" | "delete" | null;

export default function SubmitOrder() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const key = searchParam.get("key") as string;

  const [submitting, setSubmitting] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [routesData, setRoutesData] = useState<any[]>([]);
  const [orderData, setOrderData] = useState<any>(null);

  const { data, isLoading, isError } = useWarehousePreview(key);
  const { data: addressData } = useAddressList();

  // 都用 string 类型 id 进行比较
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [currentRowData, setCurrentRowData] = useState<any>(initAddress);
  const [modalType, setModalType] = useState<ModalType>(null);

  useEffect(() => {
    setOrderData(data);
  }, [data]);

  useEffect(() => {
    getWarehouseServicesList().then((res) => setServices(res || []));
    getWarehouseRoutesList().then((res) => setRoutesData(res || []));
  }, []);

  // 切换服务选择
  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const handleCartSubmit = async () => {
    if (!isCheck) {
      return addToast({
        title: "请勾选免责声明",
        timeout: 1500,
        color: "warning",
      });
    }
    if (!selectedAddressId) {
      return addToast({
        title: "请选择收货地址",
        timeout: 1500,
        color: "warning",
      });
    }
    if (!selectedRouteId) {
      return addToast({
        title: "请选择运输路线",
        timeout: 1500,
        color: "warning",
      });
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = {
        serviceList: selectedServices.map((sid) => ({
          serviceId: sid,
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

      addToast({ title: "提交成功", timeout: 1500, color: "success" });
      router.push(`/dashboard/package`);
    } catch (err) {
      console.error("提交失败", err);
      addToast({ title: "提交失败", timeout: 1500, color: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdd = () => {
    setCurrentRowData(initAddress);
    setModalType("add");
  };
  const handleEdit = (row: any) => {
    setCurrentRowData(row);
    setModalType("edit");
  };
  // 地址保存时处理
  const handleSave = async () => {
    const { createTime, updateTime, customerId, ...filteredData } =
      currentRowData;

    try {
      if (modalType === "add") {
        await addAddress({
          ...currentRowData,
          addressType: 1,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
        }); // 新增接口
      } else if (modalType === "edit") {
        await updateAddress({
          ...filteredData,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
          city: filteredData?.city || filteredData?.state,
        }); // 编辑接口
      }
      setModalType(null);
    } catch {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["addressList"] }); // 手动刷新
    }
  };

  if (isLoading) return <FullscreenLoader />;
  if (isError) return <div>出错了</div>;

  return (
    <div className="container mx-auto bg-[#fff] p-4 py-6">
      <Progress currentStep={2} />

      <div className="flex container gap-10">
        {/* 左侧内容 */}
        <div className="flex-[5] flex flex-col gap-8">
          {/* 地址 */}
          <div>
            <div className="text-title">Shipping Address</div>
            <div className="flex gap-4">
              {addressData?.length === 0 ? (
                <AddAddressCard onAdd={handleAdd} />
              ) : (
                addressData?.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    data={addr}
                    isSelected={selectedAddressId === String(addr.id)}
                    onEdit={() => handleEdit(addr)}
                    onSelect={(id) => setSelectedAddressId(String(id))}
                  />
                ))
              )}
            </div>
          </div>

          {/* 商品 */}
          <div>
            <div className="text-title">Commodity List</div>
            <div className="flex gap-4 flex-col">
              {data?.packageItemList?.map((warehouse: any) => (
                <WarehouseCard key={warehouse?.id} warehouse={warehouse} />
              ))}
            </div>
          </div>

          {/* 服务（多选） */}
          <div>
            <div className="text-title">Packaging Method</div>
            <div className="flex flex-wrap gap-4">
              {services?.map((svc) => (
                <ServiceCard
                  key={svc.id}
                  {...svc}
                  isSelected={selectedServices.includes(String(svc.id))}
                  onSelect={() => toggleService(String(svc.id))}
                />
              ))}
            </div>
          </div>

          {/* 路线 */}
          <div>
            <div className="text-title">Delivery Route</div>
            <div className="flex flex-col gap-4">
              {routesData?.map((route) => (
                <RouteCard
                  key={route.id}
                  data={route}
                  isSelected={selectedRouteId === String(route.id)}
                  onSelect={(id) => setSelectedRouteId(String(id))}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 右侧操作栏 */}
        <div className="flex-[2]">
          <div className="sticky top-20 h-[calc(100vh-80px)]">
            <div className="text-title">Leaving A Message</div>
            <Textarea
              fullWidth
              placeholder="If you have any special requirements, please note here"
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
              Submit Package
            </Button>

            <Checkbox isSelected={isCheck} size="sm" onValueChange={setIsCheck}>
              I have read and agreed bbdbuy Package Shipping Agreement
            </Checkbox>
          </div>
        </div>

        <FormModal
          fields={fieldsaddress}
          formData={currentRowData}
          isOpen={modalType === "add" || modalType === "edit"}
          title={modalType === "add" ? "添加地址" : "编辑地址"}
          onChange={setCurrentRowData}
          onOpenChange={(open) => {
            if (!open) setModalType(null);
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
