import { request, requestWithOption } from "./request";


/** 获取运费模板 */
export const getWarehouseRoutesList = (): Promise<any> =>
  request.get("/shipping-line-template/all");
/** 获取运费模板 根据货物类别跟国家*/
export const getWarehouseRoutesListByCC = (data: any): Promise<any> => {
  return requestWithOption(
    { url: "/shipping-line-template/query", method: "POST", data },
    { showToast: true, isSuccess: false },
  );
};
/** 获取运费模板 */
export const searchWarehouseRoutesList = (data: any): Promise<any> => {
  return requestWithOption(
    { url: "/shipping-line-template/estimate", method: "POST", data },
    { showToast: true },
  );
};

export const createWaybill = (data: any): Promise<any> => {
  return requestWithOption(
    { url: "/waybill/submit", method: "POST", data },
    { showToast: true },
  );
};
