import { useQuery } from "@tanstack/react-query";

import { getWalletInfo } from "@/services/wallet";

export const useWalletInfo = () => {
  return useQuery({
    queryKey: ["walletInfo"],
    queryFn: getWalletInfo,
    staleTime: 3 * 1000,          // 3 秒内认为是新鲜的
    refetchOnWindowFocus: true,   // 用户回来自动更新
    refetchOnReconnect: true,     // 网络恢复自动更新
  });
};
