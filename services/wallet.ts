import { request } from "./request";


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
