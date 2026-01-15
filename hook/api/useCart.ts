import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createOrderPreviewKeyByCart,
  deleteCart,
  getCartList,
  updateCart,
} from "@/services";

export const useCartList = () => {
  return useQuery({
    queryKey: ["cartList"],
    queryFn: () => getCartList(),
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
  });
};

export const useCartMutations = () => {
  const queryClient = useQueryClient();

  // 更新购物车 (数量/备注)
  const updateMutation = useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });

  // 删除购物车商品
  const deleteMutation = useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });

  // 提交购物车生成订单预览 Key
  const submitMutation = useMutation({
    mutationFn: createOrderPreviewKeyByCart,
  });

  return {
    updateMutation,
    deleteMutation,
    submitMutation,
  };
};
