interface AddressInfo {
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  doorNo?: string;
}

/**
 * 格式化完整的城市/区域字符串
 * 如果 city 和 state 相同，则自动去重
 */
export const formatFullCity = (
  info: AddressInfo | undefined | null,
): string => {
  if (!info) return "";
  const { country = "", state = "", city = "" } = info;

  // 过滤掉空值并 trim
  const parts = [country, state, city].map((s) => s?.trim()).filter(Boolean);

  // 如果 state 和 city 相同（忽略大小写），只保留一个
  if (state && city && state.toLowerCase() === city.toLowerCase()) {
    return `${country} ${state}`.trim();
  }

  return parts.join(" ");
};

/**
 * 格式化详细街道地址
 * 如果有门牌号，会以 (doorNo) 的形式追加
 */
export const formatFullAddress = (
  info: AddressInfo | undefined | null,
): string => {
  if (!info) return "";
  const { address = "", doorNo = "" } = info;

  const cleanAddress = address?.trim() || "";
  const cleanDoorNo = doorNo?.trim() || "";

  if (cleanDoorNo) {
    return `${cleanAddress} (${cleanDoorNo})`;
  }

  return cleanAddress;
};
