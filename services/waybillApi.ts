import { PageResult } from "@/types/api";
import { request, requestWithOption } from "./request";

export const waybillApi = {
  /** 获取包裹分页列表 */
  listWaybill(
    params: any,
  ): Promise<PageResult<any>> {
    return request.post("/waybill/page", params);
  },

  /** 包裹批量支付 */
  batchPay(data: any): Promise<any> {
    return requestWithOption(
      { url: "/waybill/pay/preview/init", method: "POST", data },
      { showToast: true },
    );
  },



















  /** 创建结算包裹预览 key */
  createPreviewKey(data: any): Promise<string> {
    return request.post("/waybill/preview/init", data);
  },

  /** 获取包裹结算订单预览 */
  getPreviewByKey(key: string): Promise<any> {
    return request.get(`/waybill/preview/key?key=${key}`);
  },

  /** 提交运单 / 创建运单 */
  submit(data: any): Promise<any> {
    return requestWithOption(
      { url: "/waybill/submit", method: "POST", data },
      { showToast: true },
    );
  },
};
