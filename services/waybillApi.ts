import { request, requestWithOption } from "./request";

export const waybillApi = {
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
