import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { delHistory, getHistory } from "@/services/goods";

export const useHistoryList = () => {
  return useQuery({
    queryKey: ["history"],
    queryFn: () => getHistory(),
    staleTime: 0,
  });
};

export const useHistoryMutations = () => {
  const queryClient = useQueryClient();

  // 删除浏览记录
  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => delHistory(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  return {
    deleteMutation,
  };
};
