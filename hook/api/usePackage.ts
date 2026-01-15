import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getPackageList } from "@/services";

export function usePackageList(
  page: number,
  pageSize: number,
  statusCode: string,
) {
  return useQuery({
    queryKey: ["packageList", page, pageSize, statusCode],
    queryFn: () =>
      getPackageList({
        current: page,
        size: pageSize,
        statusCode: statusCode,
      }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // ⚠️ 禁止切回 Tab 时自动请求
  });
}
