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

export function useChatWaybillList(params: any) {
  return useQuery({
    queryKey: ["chatWaybillList", params],
    queryFn: () => waybillApi.myWaybills(params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // ⚠️ 禁止切回 Tab 时自动请求
  });
}
export function useBatchPay() {
  return useMutation({
    mutationFn: (params: { packageSet: string[] }) =>
      waybillApi.batchPay(params),
  });
}
export function usePreviewCancel() {
  return useMutation({
    mutationFn: (params: { id: string }) => waybillApi.previewCancel(params),
  });
}
export function useCancelWaybill() {
  return useMutation({
    mutationFn: (waybillId: string) => waybillApi.cancelWaybill(waybillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
      queryClient.invalidateQueries({ queryKey: ["warehouseList"] });
    },
  });
}
export function useWithdrawCancel() {
  return useMutation({
    mutationFn: (waybillId: string) => waybillApi.withdrawCancel(waybillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
    },
  });
}
export function usePreviewChangeLine() {
  return useMutation({
    mutationFn: (params: { id: string; addressId?: string }) =>
      waybillApi.previewChangeLine(params),
  });
}
export function useChangeLine() {
  return useMutation({
    mutationFn: (params: any) => waybillApi.changeLine(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
    },
  });
}
export function useChangeAddress() {
  return useMutation({
    mutationFn: (params: any) => waybillApi.changeAddress(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
    },
  });
}
export function useTrackDetail() {
  return useMutation({
    mutationFn: (params: any) => waybillApi.trackDetail(params),
  });
}
export function useReceipt() {
  return useMutation({
    mutationFn: (outboundPackingId: string) =>
      waybillApi.receipt(outboundPackingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
    },
  });
}
