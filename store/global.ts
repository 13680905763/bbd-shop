// /store/useGlobalStore.ts
import { create } from "zustand";

import { getCurrency } from "@/services";

export const useGlobalStore = create<any>((set) => ({
  language: localStorage.getItem("language") || "en",
  currency: localStorage.getItem("currency")
    ? JSON.parse(localStorage.getItem("currency") as string)
    : {
        label: "CNY",
        value: "CNY",
        symbol: "¥",
      },
  languages: [],
  currencies: [],
  setLanguage: (language: any) => set({ language }),
  setCurrency: (currency: any) => set({ currency }),
  // 加一个异步 action
  fetchConfig: async () => {
    const res: any = await getCurrency();

    set({
      currencies: res.map((item: any) => ({
        label: item?.currency,
        value: item?.currency,
        symbol: item?.symbol,
      })),
    });
  },
}));
