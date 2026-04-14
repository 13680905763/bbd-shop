import { request } from "./request";

export const configApi = {
  /** 获取货币列表 */
  listCurrencies: (): Promise<any[]> => request.get("/rate"),
  /** 获取商品分类 */
  listCategories: (): Promise<any[]> => request.get("/cargo-category"),
  /** 获取奖金配置 */
  getBonusConfig(): Promise<any> {
    return request.get(`/promotion-config?configType=EXPERIENCE`);
  },
  /** 获取积分兑换优惠券列表 */
  listCoupons(): Promise<any[]> {
    return request.get("/coupon?src=2");
  },
  /** 获取增值服务列表 */
  listWarehouseServices(): Promise<any[]> {
    return request.get("/services/query?serviceLevel=2");
  },
  /** 获取保险增值服务列表 */
  listWarehouseServices1(): Promise<any[]> {
    return request.get("/services/query?serviceLevel=3");
  },

  /** 获取活跃用户奖金配置 */
  listInviteBonus: (): Promise<any[]> => {
    return request.get("/invite-bonus");
  },
  /** 获取公共密钥 */
  getPublicKey: (): Promise<any> => {
    return request.get("/customer/public-key");
  },
};
