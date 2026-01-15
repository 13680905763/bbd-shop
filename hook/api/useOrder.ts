import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  batchPayOrder,
  getOrderList,
  OrderRefund,
  putOrderCancel,
  putOrderRevoke,
} from "@/services/order";

export function useOrderList(
  page: number,
  pageSize: number,
  customerPayStatusCode: string,
) {
  return useQuery({
    queryKey: ["orderList", page, pageSize, customerPayStatusCode],
    queryFn: () => {
      const params: any = {
        current: page,
        size: pageSize,
        customerPayStatusCode,
      };

      if (customerPayStatusCode === "201") {
        params.statusCode = "101";
      }

      return getOrderList(params);
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // ⚠️ 禁止切回 Tab 时自动请求
  });
}

export const useOrderMutations = () => {
  const queryClient = useQueryClient();

  // 批量支付
  const batchPayMutation = useMutation({
    mutationFn: (data: any) => batchPayOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
  });

  // 申请退款
  const refundMutation = useMutation({
    mutationFn: (data: any) => OrderRefund(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
  });

  // 取消订单
  const cancelMutation = useMutation({
    mutationFn: (data: { id: string }) => putOrderCancel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
  });

  // 撤销退款
  const revokeMutation = useMutation({
    mutationFn: (id: string) => putOrderRevoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
  });

  return {
    batchPayMutation,
    refundMutation,
    cancelMutation,
    revokeMutation,
  };
};
