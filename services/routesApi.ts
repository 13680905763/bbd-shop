import { request, requestWithOption } from "./request";

export const routesApi = {
  /** 获取所有运费模板（无条件） */
  all: (): Promise<any[]> => {
    return request.get("/shipping-line-template/all");
  },
  /** 根据货物类别和国家查询模板 仓库提交查询使用*/
  byCategoryAndCountry: (data: any): Promise<any> => {
    return requestWithOption(
      { url: "/shipping-line-template/query", method: "POST", data },
      { showToast: true, isSuccess: false },
    );
  },
  /** 根据货物类别和国家长宽高重量 查询模板运费估算 */
  byCategoryAndCountryAndVolumeAndWeight: (data: any): Promise<any[]> => {
    return requestWithOption(
      { url: "/shipping-line-template/estimate", method: "POST", data },
      { showToast: true },
    );
  },
};
