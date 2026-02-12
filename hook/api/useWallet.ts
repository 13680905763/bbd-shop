import { useQuery } from "@tanstack/react-query";

import { WalletApi } from "@/services/walletApi";

export const useWalletInfo = () => {
  return useQuery({
    queryKey: ["walletInfo"],
    queryFn: WalletApi.getWalletInfo,
    staleTime: 3 * 1000, // 3 秒内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};
export const useWalletDetailList = (params: any) => {
  return useQuery({
    queryKey: ["walletDetailList", params],
    queryFn: () => WalletApi.listWalletDetails(params),
    staleTime: 3 * 1000, // 3 秒内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};
export const usePointsList = (params: any) => {
  return useQuery({
    queryKey: ["pointsList", params],
    queryFn: () => WalletApi.listPoints(params),
    staleTime: 3 * 1000, // 3 秒内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};
export function usePaymentMethodList(bizCode: string) {
  return useQuery({
    queryKey: ["paymentMethodList", bizCode],
    queryFn: () => WalletApi.listPaymentMethods(bizCode),
    gcTime: 1000 * 60,
    staleTime: 0,
    refetchOnMount: true,
  });
}
