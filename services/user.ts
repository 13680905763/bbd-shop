import { request } from "./request";

/** 获取用户信息 */
export const getMessageList = (params: any): Promise<any> => {
  return request.get(`/system-notice/list`, { params });
};
/** 已读用户信息 */
export const readMessage = (id: string): Promise<any> => {
  return request.put("/system-notice/" + id);
};
/** 删除用户信息 */
export const delMessage = (data: number[]): Promise<any> => {
  return request.delete("/system-notice/batch", {
    data,
  });
};
/** 上传用户头像 */

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  try {
    const response = await request.post("/customer/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 明确告知服务器这是一个表单数据
      },
    });

    return response;
  } catch (error) {
    console.error("请求失败:", error);
    throw error + "上用户头像";
  }
};

/** 获取积分列表 */
export const getPointsList = (): Promise<any> => {
  return request.get(`/customer-points-detail`);
};
/** 获取经验列表 */
export const getExperienceList = (): Promise<any> => {
  return request.get(`/customer-experience-detail`);
};
/** 获取邀请列表 */
export const getPromotionUserList = (): Promise<any> => {
  return request.get(`/customer/inviteList`);
};

/** 获取奖金配置 */
export const getPromotionBonusList = (): Promise<any> => {
  return request.get(`/customer-bonus-detail`);
};
