import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { WalletApi } from "@/services/walletApi";
import { queryClient } from "@/lib/react-query";

export const useWalletInfo = () => {
  return useQuery({
    queryKey: ["walletInfo"],
    queryFn: WalletApi.getWalletInfo,
    staleTime: 3 * 1000, // 3 秒内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};

export function useApplyWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { currencyAmount: number; currencyCode: string }) =>
      WalletApi.applyWithdrawal(data),
    onSuccess: () => {
      // Invalidate wallet info to refresh balance
      queryClient.invalidateQueries({ queryKey: ["walletInfo"] });
      // Invalidate wallet details to show new transaction
      queryClient.invalidateQueries({ queryKey: ["walletDetailList"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawalHistory"] });
    },
    onError: (error: any) => {},
  });
}
export const useWalletDetailList = (params: any) => {
  return useQuery({
    queryKey: ["walletDetailList", params],
    queryFn: () => WalletApi.listWalletDetails(params),
    staleTime: 3 * 1000, // 3 秒内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};

export const useWithdrawalHistory = (params: {
  current: number;
  size: number;
}) => {
  return useQuery({
    queryKey: ["withdrawalHistory", params],
    queryFn: () => WalletApi.listWithdrawalHistory(params),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
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
export function usePaymentMethodList(params: {
  bizCode: string;
  customerCouponId?: string;
}) {
  return useQuery({
    queryKey: ["paymentMethodList", params],
    queryFn: () => WalletApi.listPaymentMethod(params),
    gcTime: 1000 * 60,
    staleTime: 0,
    refetchOnMount: true,
    placeholderData: (previousData) => previousData, // 保持旧数据直到新数据加载完成
  });
}
// 支付
export function usePay() {
  return useMutation({
    mutationFn: (data: {
      bizCode: string;
      paymentId: string | number;
      addressId: number | string;
      customerCouponId?: string;
    }) => WalletApi.pay(data),
  });
}
export const useUserCoupon = (params: { status?: number }) => {
  return useQuery({
    queryKey: ["userCoupon", params],
    queryFn: () => WalletApi.listCoupon(params),
    staleTime: 10 * 1000, // 十秒保证积分数据足够新
    refetchOnWindowFocus: true,
  });
};
// 兑换优惠券
export const usePointExchangeCoupon = () => {
  return useMutation({
    mutationFn: (couponId: string | number) =>
      WalletApi.pointExchangeCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCoupon"] });
      queryClient.invalidateQueries({ queryKey: ["walletInfo"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      queryClient.invalidateQueries({ queryKey: ["pointsList"] });
    },
  });
};
// 兑换码兑换优惠券
export const useCodeExchangeCoupon = () => {
  return useMutation({
    mutationFn: (redemptionCode: string) =>
      WalletApi.codeExchangeCoupon(redemptionCode),
    onSuccess: () => {
      // 刷新用户优惠券列表
      queryClient.invalidateQueries({ queryKey: ["userCoupon"] });
      queryClient.invalidateQueries({ queryKey: ["walletInfo"] });
    },
  });
};
export const useConsumeList = (params: {
  current: number;
  size: number;
  bizTypeCode?: string;
}) => {
  return useQuery({
    queryKey: ["consumeList", params],
    queryFn: () => WalletApi.consumePageQuery(params),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
