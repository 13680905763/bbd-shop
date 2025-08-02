import { request } from "./request";

/** 仓库列表 */
export const getWarehouseList = (data: any) =>
  request.post("/waybill/package/page", data);
