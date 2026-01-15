import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getServicesList, createCustomizeOrder } from "@/services";
import { ServiceItem, ForwardingFormData } from "./types";

export function useForwardingLogic() {
  const router = useRouter();
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false); // 页面初始化加载
  const [isSubmitting, setIsSubmitting] = useState(false); // 提交加载

  // 获取服务列表
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getServicesList();
        if (Array.isArray(res)) {
          setServicesList(
            res.map((s: any) => ({
              ...s,
              serviceId: s?.id,
              isCheck: false,
              remark: "",
              quantity: 1,
            }))
          );
        }
      } catch (error) {
        console.error("Fetch services failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 更新服务列表（通用方法）
  const updateService = (id: string | number, updates: Partial<ServiceItem>) => {
    setServicesList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  // 移除服务（取消勾选，清空备注）
  const removeService = (id: string | number) => {
    updateService(id, { isCheck: false, remark: "" });
  };

  // 提交订单
  const submitOrder = async (formData: ForwardingFormData) => {
    try {
      setIsSubmitting(true);
      
      const selectedServices = servicesList
        .filter((s) => s.isCheck)
        .map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
          remark: item.remark,
        }));

      const payload = {
        ...formData,
        serviceList: selectedServices,
        receiver: "Bryant-4-Bryant", 
        receivePhone: "15916408071",
        receiveAddress: "广东省惠州市惠城区水口荔枝城青创产业园9楼901",
      };

      console.log("提交的数据:", payload);
      const bizCode = await createCustomizeOrder(payload);

      if (bizCode) {
        router.push("/payment/" + bizCode);
      } else {
        router.push("/dashboard/order");
      }
    } catch (err) {
      console.error("创建失败:", err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    servicesList,
    isLoading,
    isSubmitting,
    updateService,
    removeService,
    submitOrder,
  };
}
