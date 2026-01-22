"use client";

import { configApi } from "@/services/configApi";
import { create } from "zustand";


interface GlobalState {
  language: string;
  currency: any;
  languages: { label: string; value: string }[];
  currencies: { label: string; value: string; symbol: string; rate: number }[];
  setLanguage: (language: string) => void;
  setCurrency: (currency: any) => void;
  fetchConfig: () => Promise<void>;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  language: "",
  currency: {},
  languages: [],
  currencies: [],

  setLanguage: (language) => {
    set({ language });
  },

  setCurrency: (currency) => {
    set({ currency });
  },

  fetchConfig: async () => {
    const res: any = await configApi.getCurrency();

    const initcurrency = res.find((item: any) => item?.currency == "USD");

    set({
      currencies: res.map((item: any) => ({
        label: item?.currency,
        value: item?.currency,
        symbol: item?.symbol,
        rate: item?.rate,
      })),
      currency: {
        label: initcurrency?.currency,
        value: initcurrency?.currency,
        symbol: initcurrency?.symbol,
        rate: initcurrency?.rate,
      },
    });
  },
}));
