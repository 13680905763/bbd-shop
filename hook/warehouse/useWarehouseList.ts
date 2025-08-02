import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getWarehouseList } from "@/services";

export function useWarehouseList(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["warehouseList", page, pageSize],
    queryFn: () =>
      getWarehouseList({
        current: page,
        size: pageSize,
      }),
    placeholderData: keepPreviousData,
  });
}
