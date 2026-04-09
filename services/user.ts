import { request, requestWithOption } from "./request";
import { encryptField } from "@/utils/encrypt";

import { LoginFormData, SignUpFormData, UserInfo } from "@/types";
/** 注册 */
export const signUpCustomer = async (data: SignUpFormData): Promise<string> => {
  const encryptedData = await encryptField(data);

  return requestWithOption<string>(
    {
      url: "/customer/sign-up",
      method: "POST",
      data: encryptedData,
    },
    { showToast: true }, // 成功/失败自动弹 toast
  );
};

/** 注册 / 邮箱验证 */
export const activateEmail = async (data: any): Promise<string> => {
  const encryptedData = await encryptField(data);
  return requestWithOption<string>(
    {
      url: "/customer/active",
      method: "POST",
      data: encryptedData,
    },
    { showToast: true }, // 成功/失败都会弹 toast
  );
};

/** 登录 */
export const loginCustomer = async (data: LoginFormData): Promise<string> => {
  const encryptedData = await encryptField(data);

  return requestWithOption<string>(
    {
      url: "/customer/login",
      method: "POST",
      data: encryptedData,
    },
    { showToast: true }, // 登录成功/失败都会弹 toast
  );
};


/** 谷歌登录新 */
export const loginWithGoogleNew = async (data: any): Promise<string> => {
  const encryptedData = await encryptField(data);
  return requestWithOption<string>(
    {
      url: "/customer/google/code",
      method: "POST",
      data: encryptedData,
    },
    { showToast: true }, // 登录成功/失败都会弹 toast
  );
};

/** 退出登录 */
export const logoutCustomer = (): Promise<void> => {
  return requestWithOption<void>(
    {
      url: "/customer/logout",
      method: "GET",
    },
    { showToast: true }, // 成功提示“已退出登录”
  );
};

/** 更新用户信息 */
export const updateUserInfo = (data: any): Promise<UserInfo> => {
  return requestWithOption(
    { url: "/customer/update", method: "POST", data },
    { showToast: true },
  );
};
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
export const updatePwd = async (data: any): Promise<UserInfo> => {
  const encryptedData = await encryptField(data, [
    "oldPassword",
    "newPassword",
    "password",
  ]);

  return requestWithOption(
    { url: "/customer/password", method: "POST", data: encryptedData },
    { showToast: true },
  );
};

/** 发送验证码 */
export const sendVerificationCode = async (email: string): Promise<any> => {
  const encryptedData = await encryptField({ email });
  return requestWithOption(
    {
      url: "/customer/sendVerificationCode?email=" + encryptedData.email,
      method: "POST",
    },
    { showToast: true },
  );
};

/** 重置密码 */
export const resetPassword = async (data: any): Promise<any> => {
  const encryptedData = await encryptField(data);

  return requestWithOption(
    {
      url:
        "/customer/resetPassword?email=" +
        data?.email +
        "&verificationCode=" +
        data?.verificationCode,
      method: "POST",
      data: encryptedData,
    },
    { showToast: true },
  );
};
