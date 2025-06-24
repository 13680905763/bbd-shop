import { useQuery } from "../api/useQuery";

export const usePayMethod = (recharge: Boolean) =>
  useQuery(`/payment/list/group?recharge=${recharge}`);
