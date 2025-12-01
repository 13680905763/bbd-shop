import { request } from "./request";

import { WalletInfo } from "@/types";

/** 获取钱包信息 */
export const getWalletInfo = (): Promise<WalletInfo> => {
  return request.get("/customer/wallet/info");
};
export const getWalletDetailList = (
  current: number,
  size: number,
): Promise<any> =>
  request.get(`/customer/wallet/detail/page?current=${current}&size=${size}`);

// onpaly支付后通知后端
export const payNotice = (param: any): Promise<any> => {
  return request.get("/onlypay/callback/redirect?" + param);
};
export const getScorelList = (current: number, size: number): Promise<any> =>
  request.get(`/customer/wallet/detail/page?current=${current}&size=${size}`);

export const payPaypel = (param: any): Promise<any> => {
  return request.get("/paypal/return/redirect?" + param);
};
