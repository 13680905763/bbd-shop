import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getOrderList } from "@/services/order";

export function useOrderList(
  page: number,
  pageSize: number,
  customerPayStatusCode: string,
) {
  return useQuery({
    queryKey: ["orderList", page, pageSize, customerPayStatusCode],
    queryFn: () =>
      getOrderList({ current: page, size: pageSize, customerPayStatusCode }),
    placeholderData: keepPreviousData,
  });
}
