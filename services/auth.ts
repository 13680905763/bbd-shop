import { request } from "@/utils/request";

export const loginCustomer = (data: { email: string; password: string }) => {
  return request.post("/customer/login", {
    ...data,
  });
};
export const loginWithGoogle = (idtoken: string) => {
  return request.post("/customer/google/login", {
    idtoken,
  });
};

export const logoutCustomer = () => {
  return request.get("/customer/logout");
};
export const signUpCustomer = (data: { email: string; password: string }) => {
  return request.post("/customer/sign-up", {
    ...data,
  });
};
export const activateEmail = (data: any) => {
  return request.post("/customer/callback", {
    ...data,
  });
};
