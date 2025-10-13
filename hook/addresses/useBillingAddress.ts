import { useQuery } from "@tanstack/react-query";

import { getAddressList } from "@/services";
import { useBillingAddressStore } from "@/store";

export const useBillingAddress = () => {
  // console.log("useBillingAddress");

  return useQuery({
    queryKey: ["billingAddress"],
    queryFn: async () => {
      // console.log("shuaxin");

      const data = await getAddressList(2).then((res) => res[0] || {});

      useBillingAddressStore.getState().setBillingAddress(data);

      return data;
    },

    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
  });
};
