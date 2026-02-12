import { request, requestWithOption } from "./request";

import { PageResult } from "@/types/api";

export const waybillApi = {
  /** 获取运单分页列表 */
  listWaybill(params: any): Promise<PageResult<any>> {
    return request.post("/waybill/page", params);
  },
  /** 运单批量支付 */
  batchPay(data: any): Promise<any> {
    return request.post("/waybill/pay/preview/init", data);
  },
  /** 运单取消预览 */
  previewCancel(params: { id: string }): Promise<any> {
    return request.put(`/waybill/cancel/preview/${params.id}`);
  },
  /** 运单取消 */
  cancelWaybill(waybillId: string): Promise<any> {
    return request.put(`/waybill/cancel/${waybillId}`);
  },
  /** 包裹撤销取消 */
  withdrawCancel(waybillId: string): Promise<any> {
    return request.put(`/waybill/cancel/withdraw/${waybillId}`);
  },
  /** 运单更换路线预览 */
  previewChangeLine(params: { id: string; addressId?: string }): Promise<any> {
    return requestWithOption(
      { url: `/waybill/change/line/fee`, method: "GET", params },
      { isSuccess: false },
    );
  },
  /** 包裹物流查询 */
  trackDetail(params: any): Promise<any> {
    return request.get(`/track`, { params });
  },
  /** 运单更换路线提交 */
  changeLine(data: any): Promise<any> {
    return request.post(`/waybill/change/line`, data);
  },
  /** 运单更换地址提交 */
  changeAddress(data: any): Promise<any> {
    return request.post(`/waybill/change/address-line`, data);
  },
  /** 运单确认收货 */
  receipt(outboundPackingId: string): Promise<any> {
    return request.put(`/waybill/sign?outboundPackingId=${outboundPackingId}`);
  },
};
