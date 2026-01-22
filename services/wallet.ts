import { request } from "./request";



// onpaly支付后通知后端
export const payNotice = (param: any): Promise<any> => {
  return request.get("/onlypay/callback/redirect?" + param);
};

export const payPaypel = (param: any): Promise<any> => {
  return request.get("/paypal/return/redirect?" + param);
};
