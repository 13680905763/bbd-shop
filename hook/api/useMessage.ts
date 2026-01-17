import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { delMessage, getMessageList, readMessage } from "@/services";

interface MessageListParams {
  page: number;
  pageSize: number;
  statusCode?: string | number;
}

export const useMessageList = (params: MessageListParams) => {
  const { page, pageSize, statusCode } = params;

  return useQuery({
    queryKey: ["messageList", params],
    queryFn: () =>
      getMessageList({
        current: page,
        size: pageSize,
        statusCode,
      }),
    enabled: !!page && !!pageSize, // 👈 防止无效请求
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

export const useMessageMutations = () => {
  const queryClient = useQueryClient();

  // 删除消息
  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => delMessage(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    },
  });

  // 已读消息
  const readMutation = useMutation({
    mutationFn: (id: string) => readMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    },
  });

  return {
    deleteMutation,
    readMutation,
  };
};
