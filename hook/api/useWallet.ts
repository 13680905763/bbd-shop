import { WalletApi } from "@/services/walletApi";
import { useQuery } from "@tanstack/react-query";


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
