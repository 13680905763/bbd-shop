import { useQuery } from "@tanstack/react-query";

import { getBillingAddressList } from "@/services";

export const useBillingAddress = () => {
  return useQuery({
    queryKey: ["billingAddress"],
    queryFn: getBillingAddressList,
    select: (list) => list?.[0] ?? null,
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
  });
};
