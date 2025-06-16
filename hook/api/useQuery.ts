import useSWR from "swr";

import { fetcher } from "@/utils/request";

export function useQuery<T = any>(key: string | null, enabled = true) {
  return useSWR<T>(enabled ? key : null, fetcher);
}
