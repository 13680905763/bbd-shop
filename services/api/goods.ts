import axiosInstance from "../axiosInstance";

export const getGoodsInfo = () => {
  return axiosInstance.post("/product/search/id", {
    source: "TAOBAO",
    productId: "788110260427",
  });
};
