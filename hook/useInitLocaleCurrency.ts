// /hooks/useInitLocaleCurrency.ts
"use client";
import { useEffect } from "react";

import { useGlobalStore } from "@/store";

export function useInitLocaleCurrency() {
  const { setLocale, setCurrency } = useGlobalStore();

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    const storedCurrency = localStorage.getItem("currency");

    if (storedLocale) setLocale(storedLocale);
    if (storedCurrency) setCurrency(storedCurrency);
  }, []);
}
