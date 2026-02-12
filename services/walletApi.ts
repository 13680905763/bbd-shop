// services/walletApi.ts
import type { WalletInfo } from "@/types";

import { request } from "./request";

export const WalletApi = {
  /** 获取钱包信息 */
  getWalletInfo(): Promise<WalletInfo> {
    return request.get("/customer/wallet/info");
  },

  /** 获取钱包明细列表 */
  listWalletDetails(params: any): Promise<any> {
    return request.get("/customer/wallet/detail/page", {
      params,
    });
  },
  /** 获取积分明细列表 */
  listPoints(params: any): Promise<any> {
    return request.post("/customer-points-detail", params);
  },
  /** 获取支付方式列表 */
  listPaymentMethods(bizCode: string): Promise<any[]> {
    return request.get("/customer/pay-order/preview?bizCode=" + bizCode);
  },
};
