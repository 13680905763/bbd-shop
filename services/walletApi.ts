// services/walletApi.ts
import { request } from "./request";
import type { WalletInfo, } from "@/types";

export const WalletApi = {
  /** 获取钱包信息 */
  getWalletInfo(): Promise<WalletInfo> {
    return request.get("/customer/wallet/info");
  },

  /** 获取钱包明细列表 */
  listWalletDetails(
    params: any,
  ): Promise<any> {
    return request.get("/customer/wallet/detail/page", {
      params,
    });
  },
  listPoints(params: any): Promise<any> {
    return request.get("/customer-points-detail", {
      params,
    });
  },
};
