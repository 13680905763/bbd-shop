import useSWR from "swr";

import { fetcher } from "../fetcher";
import { getUserInfo } from "../api/user";

export function useUser() {
  const { data, error, mutate } = useSWR("/user/info", fetcher);

  const updateUser = async (data: any) => {
    await getUserInfo();
    mutate(); // 更新缓存，自动刷新组件
  };

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    updateUser,
  };
}
