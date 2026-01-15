import axios from "axios";

import { request, requestWithOption } from "./request";


/** 新增地址 */
export const addAddress = (data: any): Promise<string> => {
  return requestWithOption<string>(
    {
      url: "/customer/address/add",
      method: "POST",
      data,
    },
    { showToast: true }, // 成功/失败都会弹 toast
  );
};

export const updateAddress = (data: any): Promise<string> => {
  return requestWithOption(
    {
      url: "/customer/address/update",
      method: "POST",
      data,
    },
    { showToast: true }, // 成功/失败都会弹 toast
  );
};

export const deleteAddress = (data: any): Promise<string> => {
  return requestWithOption(
    {
      url: "/customer/address/delete",
      method: "POST",
      data,
    },
    { showToast: true }, // 成功/失败都会弹 toast
  );
};
export const getAddressList = (): Promise<any[]> => {
  return request.get("/customer/address/list?addressType=1");
};
export const getBillingAddressList = (): Promise<any[]> => {
  return request.get("/customer/address/list?addressType=2");
};
export const getCountries = async (): Promise<any> => {
  try {
    const { data } = await axios.get(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/countries.json",
    );

    console.log("countries", data);

    return data;
  } catch (err) {
    console.error("获取国家列表失败", err);

    return [];
  }
};
export const getProvinces = (countryId: string): Promise<any> => {
  return request.get("/state/country?countryId=" + countryId);
};
export const getCities = (stateId: string): Promise<any> => {
  return request.get("/cities/state?stateId=" + stateId);
};
