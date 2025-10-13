// /hooks/useInitLocaleCurrency.ts
"use client";
import { useEffect } from "react";

import { useGlobalStore } from "@/store";
import { setUserCurrency, setUserLocale } from "@/i18n/service";

export function useInitLocaleCurrency() {
  const { setLocale, setCurrency } = useGlobalStore();

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    const storedCurrency = localStorage.getItem("currency");

    if (storedLocale) {
      setLocale(storedLocale);
      setUserLocale(storedLocale);
    }
    if (storedCurrency) {
      setCurrency(storedCurrency);
      setUserCurrency(storedCurrency);
    }
  }, []);
}
