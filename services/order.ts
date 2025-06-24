import { request } from "@/utils/request";

export const createOrderByRecharge = (data: any) => {
  return request.post("/customer/wallet/recharge", data);
};
export const createPayOrder = (data: any) => {
  return request.post("/customer/pay-order/create", data);
};
export const createOrderByProduct = (data: any) => {
  return request.post("/orders/create", data);
};
export const createOrderByCart = (data: any) => {
  return request.post("/customer/cart/submit", data);
};
