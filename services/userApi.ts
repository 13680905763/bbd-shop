import { request } from "./request";

import { encryptField } from "@/utils/encrypt";

export const userApi = {
  /** 获取用户信息 */
  getUserInfo(): Promise<any> {
    return request.get("/customer/detail");
  },

  /** 更新用户信息 */
  updateUserInfo: (data: any): Promise<any> =>
    request.post(`/customer/update`, data),

  /** 变更密码 */
  changePassword: async (data: any): Promise<any> => {
    const encryptedData = await encryptField(data);

    return request.post(`/customer/password`, encryptedData);
  },
  /** 发送验证码 */
  sendVerificationCode: (email: string): Promise<any> =>
    request.post(`/customer/sendVerificationCode?email=${email}`),
  /** 重置密码 */
  resetPassword: async (data: any): Promise<any> => {
    const encryptedData = await encryptField(data);

    return request.post(`/customer/resetPassword`, encryptedData);
  },
  /** 获取用户经验 */
  getExperience(): Promise<any> {
    return request.get(`/customer-experience/myExperience`);
  },
  /** 获取经验明细 */
  listExperience(params: any): Promise<any> {
    return request.get(`/customer-experience-detail`, {
      params,
    });
  },
};
