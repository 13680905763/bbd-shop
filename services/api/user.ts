import axiosInstance from "../axiosInstance";

export const getUserInfo = () => {
  return axiosInstance.get("/user/info");
};

export const updateUserInfo = (data: any) => {
  return axiosInstance.put("/user/info", data);
};
