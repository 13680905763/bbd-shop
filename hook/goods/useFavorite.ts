import { useQuery } from "@tanstack/react-query";

import { getFavorite } from "@/services";

export const useFavorite = () => {
  return useQuery({
    queryKey: ["favorite"],
    queryFn: () => getFavorite(),
    staleTime: 0, // 缓存 5 分钟
  });
};
