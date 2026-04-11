import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCustomerChatContextList, deleteCustomerChatContext } from "@/services/chat";

/**
 * Hook to fetch the list of business consultations for a customer.
 */
export const useChatContextList = (customerId?: string | number) => {
  return useQuery({
    queryKey: ["chatContextList", customerId],
    queryFn: () => fetchCustomerChatContextList(customerId!),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to delete a specific chat context.
 */
export const useDeleteChatContext = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bizCode: string) => deleteCustomerChatContext(bizCode),
    onSuccess: () => {
      // Invalidate the list to refresh from server
      queryClient.invalidateQueries({ queryKey: ["chatContextList"] });
    },
  });
};
