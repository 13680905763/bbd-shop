import { PromotionApi } from "@/services/promotionApi";
import { useQuery } from "@tanstack/react-query";


export const useInvitedUsers = (params: any) => {
  return useQuery({
    queryKey: ["invitedUsers", params],
    queryFn: () => PromotionApi.listInvitedUsers(params),
    staleTime: 10 * 1000, // 10 秒内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};
export const useExperience = (params: any) => {
  return useQuery({
    queryKey: ["experience", params],
    queryFn: () => PromotionApi.listExperience(params),
    staleTime: 10 * 1000, // 10 秒内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};
export const useBonus = (params: any) => {
  return useQuery({
    queryKey: ["bonus", params],
    queryFn: () => PromotionApi.listBonus(params),
    staleTime: 10 * 1000, // 10 秒内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};
export const useBonusConfig = () => {
  return useQuery({
    queryKey: ["bonusConfig"],
    queryFn: () => PromotionApi.getBonusConfig(),
    staleTime: 1000 * 1000, // 10 秒内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};
// export const usePointsList = () => {
//   return useQuery({
//     queryKey: ["pointsList"],
//     queryFn: () => PromotionApi.listPromotionBonuses(),
//     staleTime: 10 * 1000, // 10 秒内认为是新鲜的
//     refetchOnWindowFocus: true, // 用户回来自动更新
//     refetchOnReconnect: true, // 网络恢复自动更新
//   });
// };
