import { useQuery } from "@tanstack/react-query";

import { getServicesList } from "@/services";
export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServicesList,
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
  });
};
