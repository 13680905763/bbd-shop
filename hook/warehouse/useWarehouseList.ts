import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getWarehouseList } from "@/services";

export function useWarehouseList(
  page: number,
  pageSize: number,
  statusCode: string,
) {
  return useQuery({
    queryKey: ["warehouseList", page, pageSize, statusCode],
    queryFn: () =>
      getWarehouseList({
        current: page,
        size: pageSize,
        statusCode: statusCode,
      }),
    placeholderData: keepPreviousData,
  });
}
