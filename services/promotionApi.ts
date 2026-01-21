// services/promotionApi.ts
import { request } from "./request";


export const PromotionApi = {
    /** 获取邀请用户列表 */
    listInvitedUsers(params: any): Promise<any> {
        return request.get("/customer/inviteList", {
            params,
        });
    },
    /** 获取经验明细 */
    listExperience(params: any): Promise<any> {
        return request.get(`/customer-experience-detail`, {
            params,
        });
    },
    /** 获取奖金明细 */
    listBonus(params: any): Promise<any[]> {
        return request.get("/customer-bonus-detail", {
            params,
        });
    },
    /** 获取奖金配置 */
    getBonusConfig(): Promise<any> {
        return request.get(`/promotion-config?configType=EXPERIENCE`);
    },
    // /** 获取奖金配置 */
    // getPromotionConfig(params: any): Promise<any> {
    //     return request.get("/promotion-config", {
    //         params,
    //     });
    // },
};
