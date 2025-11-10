import { request, requestWithOption } from "./request";

/** 包裹列表 */
export const getPackageList = (data: any) =>
  request.post("/waybill/page", data);

/** 包裹批量支付 */

export const batchPayPackage = (data: any): Promise<any> => {
  return requestWithOption(
    { url: "/waybill/pay/preview/init", method: "POST", data },
    { showToast: true },
  );
};
/** 包裹取消预览 */

export const refundPrePayPackage = (id: string): Promise<any> => {
  return request.put(`/waybill/cancel/preview/${id}`);
};

/** 包裹取消 */
export const refundPayPackage = (id: string): Promise<any> => {
  return requestWithOption(
    { url: `/waybill/cancel/${id}`, method: "put" },
    { showToast: true },
  );
};
/** 包裹撤销取消 */
export const withdrawPayPackage = (id: string): Promise<any> => {
  return requestWithOption(
    { url: `/waybill/cancel/withdraw/${id}`, method: "put" },
    { showToast: true },
  );
};
