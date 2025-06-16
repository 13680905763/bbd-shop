import { request } from "@/utils/request";

export const getWalletDetail = (data: any) => {
  return request.post("/customer/wallet/detail/page", data);
};
