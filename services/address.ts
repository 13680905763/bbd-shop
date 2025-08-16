import { request, requestWithOption } from "./request";

import { AddressItem } from "@/types";

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
export const getAddressList = (addressType: number): Promise<AddressItem[]> => {
  return request.get("/customer/address/list?addressType=" + addressType);
};
export const getCountries = (): Promise<any> => {
  return request.get("/countries/list");
};
export const getProvinces = (countryId: string): Promise<any> => {
  return request.get("/state/country?countryId=" + countryId);
};
export const getCities = (stateId: string): Promise<any> => {
  return request.get("/cities/state?stateId=" + stateId);
};
