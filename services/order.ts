import { request, requestWithOption } from "./request";

import {
  createOrderByRechargeParams,
  createOrderPreviewKeyByProductParams,
  createPayOrderParams,
  OrderPreviewByCart,
  OrderPreviewByProduct,
} from "@/types";

/** 创建立即购买订单预览key */
export const createOrderPreviewKeyByProduct = (
  data: createOrderPreviewKeyByProductParams,
): Promise<string> => request.post("/orders/preview/init", data);

/** 创建充值订单 */
export const createOrderByRecharge = (
  data: createOrderByRechargeParams,
): Promise<string> => request.post("/customer/wallet/recharge", data);
/** 创建立即购买订单 */
export const createOrderByProduct = (
  data: createOrderPreviewKeyByProductParams,
): Promise<string> => request.post("/orders/create", data);

/** 创建购物车结算订单 */
export const createOrderByCart = (data: any): Promise<string> =>
  request.post("/customer/cart/order/submit", data);

/** 购物车结算订单预览 */
export const getOrderPreviewCart = (key: string): Promise<OrderPreviewByCart> =>
  request.get("/customer/cart/order/preview/key?key=" + key);
/** 更新购物车结算订单预览 */
export const updateOrderPreviewCart = (
  data: OrderPreviewByCart,
): Promise<OrderPreviewByCart> =>
  request.post("/customer/cart/order/preview", data);

/** 商品立即购买订单预览 */
export const getOrderPreviewProduct = (
  key: string,
  options?: { showToast?: boolean },
): Promise<OrderPreviewByProduct> => {
  return requestWithOption(
    {
      url: `/orders/preview/key?key=${key}`,
      method: "GET",
    },
    {
      showToast: options?.showToast ?? false, // 默认显示提示
    },
  );
};
/** 更新商品立即购买订单预览 */
export const updateOrderPreviewProduct = (
  data: any,
): Promise<OrderPreviewByCart> => request.post("/orders/preview", data);
/** 付款 */
export const createPayOrder = (data: createPayOrderParams): Promise<any> => {
  return requestWithOption(
    {
      url: "/customer/pay-order/create",
      method: "POST",
      data,
    },
    {
      showToast: true,
    },
  );
};
/** 获取支付状态 */
export const getPayOrderStatus = (bizCode: string): Promise<number> =>
  request.get(`/customer/pay-order/status?bizCode=${bizCode}`);

/** 获取增值服务列表 */
export const getServicesList = (): Promise<any> => {
  return requestWithOption(
    { url: "/services/query?serviceLevel=1", method: "GET" },
    { showToast: false },
  );
};

/** 订单取消 */
export const createCustomizeOrder = (data: any): Promise<any> => {
  return requestWithOption(
    { url: "/drop-shipping-order", method: "POST", data },
    { showToast: true },
  );
};

/** 撤销列表 */
export const getRefundList = (data = {}): Promise<any> => {
  return request.post("/order-refund/list", data);
};
