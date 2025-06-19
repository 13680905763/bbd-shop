// hooks/useCart.ts

import { useQuery } from "../api/useQuery";

import { Shop } from "@/app/(main)/dashboard/cart/page";

export const useCart = () => useQuery<Shop[]>("/customer/cart/shop");
