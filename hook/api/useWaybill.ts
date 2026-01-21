import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

import { waybillApi } from "@/services/waybillApi";
import { queryClient } from "@/lib/react-query";

export function useWaybillList(params: any) {
  return useQuery({
    queryKey: ["waybillList", params],
    queryFn: () => waybillApi.listWaybill(params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // ⚠️ 禁止切回 Tab 时自动请求
  });
}
export function useBatchPay() {
  return useMutation({
    mutationFn: (params: any) => waybillApi.batchPay(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
    },
  });
}
