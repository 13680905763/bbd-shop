import { useQuery } from "@tanstack/react-query";

import { getUserInfo } from "@/services";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    staleTime: 10 * 1000, // 十秒保证积分数据足够新
    refetchOnWindowFocus: true,
  });
};
