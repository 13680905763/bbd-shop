// services/walletApi.ts
import type { WalletInfo } from "@/types";

import { request, requestWithOption } from "./request";

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
  listPaymentMethods(bizCode: string, customerCouponId?: string): Promise<any> {
    return request.get("/customer/pay-order/preview", {
      params: { bizCode, customerCouponId },
    });
  },
  /** 申请提现 */
  applyWithdrawal(data: {
    currencyAmount: number;
    currencyCode: string;
  }): Promise<any> {
    return request.post("/customer-withdrawal/apply", data);
  },
  /** 获取提现流水列表 */
  listWithdrawalHistory(params: {
    current: number;
    size: number;
  }): Promise<any> {
    return request.post("/customer-withdrawal/page", params);
  },
  /** 获取支付方式列表 */
  listPaymentMethod: (params: {
    bizCode: string;
    customerCouponId?: string;
  }): Promise<any> =>
    request.get("/customer/pay-order/preview", {
      params,
    }),

  /** 支付 */
  pay: (params: {
    bizCode: string;
    paymentId: string | number;
    addressId: number | string;
    customerCouponId?: string;
  }): Promise<any> => {
    return requestWithOption(
      {
        url: "/customer/pay-order/create",
        method: "POST",
        data: params,
      },
      {
        showToast: true,
      },
    );
  },
};
