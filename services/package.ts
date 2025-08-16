import { request } from "./request";

/** 包裹列表 */
export const getPackageList = (data: any) =>
  request.post("/waybill/page", data);
