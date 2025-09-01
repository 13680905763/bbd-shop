import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getOrderList } from "@/services/order";

export function useOrderList(
  page: number,
  pageSize: number,
  customerPayStatusCode: string,
) {
  return useQuery({
    queryKey: ["orderList", page, pageSize, customerPayStatusCode],
    queryFn: () => {
      const params: any = {
        current: page,
        size: pageSize,
        customerPayStatusCode,
      };

      if (customerPayStatusCode === "201") {
        params.statusCode = "101";
      }

      return getOrderList(params);
    },
    placeholderData: keepPreviousData,
  });
}
