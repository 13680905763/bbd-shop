"use server";

import { cookies } from "next/headers";

import { languages, defaultLocale } from "./config";

const COOKIE_LOCALE = "NEXT_LOCALE";

// =====================
// 语言方法
// =====================
export async function getUserLocale() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_LOCALE)?.value;

  if (locale && languages.some((l) => l.value === locale)) return locale;
  console.log("return locale", locale);

  return defaultLocale;
}

export async function setUserLocale(language: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_LOCALE,
    value: language,
    path: "/",
  });
}
