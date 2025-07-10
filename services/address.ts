import { request } from "./request";

import { AddressItem } from "@/types";

export const addAddress = (data: any): Promise<string> => {
  return request.post("/customer/address/add", data);
};

export const updateAddress = (data: any): Promise<string> => {
  return request.post("/customer/address/update", data);
};

export const deleteAddress = (id: string): Promise<string> => {
  return request.post(`/customer/address/delete`, { id });
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
