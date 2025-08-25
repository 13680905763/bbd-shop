"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  addToast,
  Button,
  Checkbox,
  Divider,
  Image,
  Textarea,
} from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

import OrderCard from "./order-card";

import Progress from "@/components/common/progress";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import CommonModal from "@/components/modal/common-modal";
import { useOrderPreview } from "@/hook";
import {
  createOrderByCart,
  createOrderByProduct,
  updateOrderPreviewCart,
  updateOrderPreviewProduct,
} from "@/services";
import { useServicesStore } from "@/store";
import { createOrderPreviewKeyByProductParams } from "@/types";

export default function SubmitOrder() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const type = searchParam.get("type") as "cart" | "product";
  const key = searchParam.get("key") as string;

  const { data, isLoading, isError } = useOrderPreview(type, key);
  const [orderData, setOrderData] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);
  const [ischeck, setIscheck] = useState(false);

  const services = useServicesStore((state) => state.services);

  // 本地状态：存储克隆的服务列表，用于单商品
  const [localServices, setLocalServices] = useState<any[]>([]);

  // 弹窗状态
  const [isServiceListOpen, setIsServiceListOpen] = useState(false);
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);

  // 当前操作的商品ID
  const [currentCartId, setCurrentCartId] = useState<string | null>(null);

  // 当前服务详情对象
  const [currentService, setCurrentService] = useState<any>(null);
  // 新增状态
  const [isServiceSubmitting, setIsServiceSubmitting] = useState(false);

  useEffect(() => {
    if (data) setOrderData(data);
  }, [data]);

  // 打开商品服务列表弹窗
  const openServiceModal = (cartId: string) => {
    console.log("cartId", cartId);

    setCurrentCartId(cartId);
    // 克隆服务，初始化 isCheck、remark
    setLocalServices(
      services.map((s: any) => ({
        ...s,
        isCheck: false,
        remark: "",
      })),
    );
    setIsServiceListOpen(true);
  };

  // 打开某个服务详情
  const openServiceDetail = (serviceId: string) => {
    const service = localServices.find((s) => s.id === serviceId);

    if (!service) return;
    setCurrentService(service);
    setIsServiceDetailOpen(true);
  };

  // 保存服务详情备注
  const saveServiceDetail = () => {
    setLocalServices((prev) =>
      prev.map((s) =>
        s.id === currentService.id
          ? { ...s, remark: currentService.remark, isCheck: true }
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
    if (!currentCartId) return;
    const checkedServices = localServices
      .filter((s) => s.isCheck)
      .map((s) => ({ serviceId: s.id, remark: s.remark }));

    try {
      setIsServiceSubmitting(true); // ✅ 开始 loading
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
      setIsServiceListOpen(false);
    } catch (err) {
      addToast({ title: "提交失败", color: "danger" });
    } finally {
      setIsServiceSubmitting(false); // ✅ 结束 loading
    }
  };

  const handleSubmitOrder = async () => {
    if (!ischeck) {
      addToast({ title: "请勾选免责声明", timeout: 1000, color: "warning" });

      return;
    }
    if (submitting) return;
    setSubmitting(true);

    try {
      if (type === "cart") {
        const bizCode = await createOrderByCart(orderData?.param);

        router.push("/order/pay-order/" + bizCode);
      } else {
        const bizCode = await createOrderByProduct(
          orderData?.param as createOrderPreviewKeyByProductParams,
        );

        router.push("/order/pay-order/" + bizCode);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const togglePrice = useMemo(
    () =>
      orderData?.orderList?.reduce(
        (sum: any, item: any) => sum + item?.totalFee,
        0,
      ),
    [orderData],
  );

  if (isLoading) return <FullscreenLoader loading={isLoading} />;
  if (isError) return <div>出错了</div>;

  return (
    <div className="container mx-auto bg-white p-4 py-6">
      <Progress
        currentStep={0}
        steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
      />

      <div className="text-title mt-4 mb-2">确认产品信息</div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center p-4 bg-[#ffeee1] rounded-lg">
          <span className="flex-1 text-left">产品</span>
          <span className="flex-[0_0_200px] text-center">备注</span>
          <span className="flex-[0_0_130px] text-center">单价</span>
          <span className="flex-[0_0_150px] text-center">数量</span>
          <span className="flex-[0_0_150px] text-center">合计</span>
        </div>

        {orderData?.orderList?.map((order: any) => (
          <OrderCard
            key={order.shopName}
            openServiceModal={openServiceModal}
            order={order}
          />
        ))}
      </div>

      {/* 协议和免责声明 */}
      <div className="text-right mt-5 p-4">
        <p className="text-sm text-[#fbbd8a] mb-2">
          <span className="hover:text-[#f0700c] cursor-pointer">
            《禁运物品声明》
          </span>
          <span className="hover:text-[#f0700c] cursor-pointer ml-2">
            《服务条款和用户管理》
          </span>
          <span className="hover:text-[#f0700c] cursor-pointer ml-2">
            《退换货服务》
          </span>
          <span className="hover:text-[#f0700c] cursor-pointer ml-2">
            《免责声明》
          </span>
        </p>
        <Checkbox
          color="primary"
          isSelected={ischeck}
          size="sm"
          onValueChange={setIscheck}
        >
          <span className="text-[#676969]">我已阅读并同意BBDbuy的免责声明</span>
        </Checkbox>
        <div className="card-tip text-left !mb-0 mt-2">
          注意：付款完成后，您需要在包裹到达并存放在仓库后提交包裹进行国际递送。
        </div>
      </div>

      <Divider className="mb-4" />

      <div className="flex justify-end items-center gap-4 mb-2">
        <div className="text-[#3d3d3d] text-sm flex items-center gap-1">
          应付金额:
        </div>
        <p className="text-price-xl">{togglePrice}</p>
        <Button
          className="w-[300px]"
          color="primary"
          isLoading={submitting}
          size="lg"
          onPress={handleSubmitOrder}
        >
          提交
        </Button>
      </div>

      {/* 商品服务列表弹窗 */}
      <CommonModal
        confirmText="提交"
        isLoading={isServiceSubmitting}
        isOpen={isServiceListOpen}
        size="xl"
        title="增值服务"
        onConfirm={handleServiceSubmit}
        onOpenChange={setIsServiceListOpen}
      >
        {localServices.map((service) => (
          <div
            key={service.id}
            className="items-center p-4 border rounded-lg mb-4"
          >
            <div className="flex justify-between items-center">
              <div className="font-medium">{service.serviceName}</div>
              <Button
                className="button-white"
                size="sm"
                onPress={() => openServiceDetail(service.id)}
              >
                添加
              </Button>
            </div>

            {service.isCheck && (
              <div className="bg-gray-50 px-3 py-2 rounded-lg mt-2 flex justify-between items-center border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    服务项
                  </span>
                  {service.remark && (
                    <span className="text-[11px] text-gray-400 mt-0.5 truncate">
                      备注：{service.remark}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-500">x1</span>
                  <span className="text-sm font-semibold text-red-500">
                    ￥{service.price}
                  </span>
                  <Button
                    className="text-[11px] px-2 h-6"
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => removeService(service.id)}
                  >
                    删除
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
          key={currentService.id}
          confirmText="保存"
          isOpen={isServiceDetailOpen}
          size="xl"
          title={currentService.serviceName}
          onCancel={() => setIsServiceDetailOpen(false)}
          onConfirm={saveServiceDetail}
          onOpenChange={setIsServiceDetailOpen}
        >
          <div className="space-y-5">
            <div className="bg-[#f8f8f8] p-4 rounded-lg space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">服务介绍</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {currentService.introduction || "暂无介绍"}
                </p>
              </div>

              {currentService.sample && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">示例</h3>
                  <Image
                    alt="服务示例"
                    className="border border-gray-200"
                    height={80}
                    radius="md"
                    src={currentService.sample}
                    width={80}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm text-gray-700">服务费</span>
              <span className="text-lg font-semibold text-rose-600">
                {currentService.price}
              </span>
            </div>

            <Textarea
              className="w-full mt-2"
              minRows={3}
              placeholder="请输入备注（选填）"
              value={currentService.remark}
              onChange={(e) =>
                setCurrentService({
                  ...currentService,
                  remark: e.target.value,
                })
              }
            />
          </div>
        </CommonModal>
      )}
    </div>
  );
}
