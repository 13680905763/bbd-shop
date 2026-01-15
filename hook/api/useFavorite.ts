import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { delFavorite, getFavorite } from "@/services/goods";

export const useFavoriteList = () => {
  return useQuery({
    queryKey: ["favorite"],
    queryFn: () => getFavorite(),
    staleTime: 0,
  });
};

export const useFavoriteMutations = () => {
  const queryClient = useQueryClient();

  // 删除收藏
  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => delFavorite(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });

  return {
    deleteMutation,
  };
};
