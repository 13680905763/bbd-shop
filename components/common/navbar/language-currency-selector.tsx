"use client";

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { useRouter } from "next/navigation";

import { setUserCurrency, setUserLocale } from "@/i18n/service";
import { currencies, languages } from "@/i18n/config";
import { useGlobalStore } from "@/store";

export default function LanguageCurrencySelector() {
  const { locale, setLocale, currency, setCurrency } = useGlobalStore();

  // console.log("locale", locale);

  const [tempLocale, setTempLocale] = useState(locale); // 临时选择
  const [tempCurrency, setTempCurrency] = useState(currency);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // console.log("保存选择", tempLocale, tempCurrency);
      // 1. 更新 store
      setLocale(tempLocale);
      setCurrency(tempCurrency);
      // 2. 写 localStorage
      localStorage.setItem("locale", tempLocale);
      localStorage.setItem("currency", tempCurrency);
      // 保存语言
      await setUserLocale(tempLocale);
      await setUserCurrency(tempCurrency);

      // 关闭弹窗
      setIsOpen(false);

      // 4. （可选）触发路由刷新，让 next-intl 重新加载语言包
      window.location.reload();
    } catch (e) {
      console.error("切换失败", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover
      showArrow
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          // 每次打开时同步最新保存值
          setTempLocale(locale);
          setTempCurrency(currency);
        }
      }}
    >
      <PopoverTrigger>
        <Button
          className="bg-transparent text-base font-medium"
          size="lg"
          variant="light"
        >
          {languages.find((l) => l.value === locale)?.label}/{currency}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4 min-w-[240px]">
          {/* 语言选择 */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700">语言</p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {languages.map((l) => (
                <Button
                  key={l.value}
                  color={tempLocale === l.value ? "primary" : "default"}
                  radius="sm"
                  size="sm"
                  variant={tempLocale === l.value ? "solid" : "flat"}
                  onPress={() => setTempLocale(l.value)}
                >
                  {l.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 货币选择 */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700">货币</p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {currencies.map((c) => (
                <Button
                  key={c.value}
                  color={tempCurrency === c.value ? "primary" : "default"}
                  radius="sm"
                  size="sm"
                  variant={tempCurrency === c.value ? "solid" : "flat"}
                  onPress={() => setTempCurrency(c.value)}
                >
                  {c.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 提交按钮 */}
          <Button
            className="w-full font-semibold"
            color="primary"
            isLoading={loading}
            radius="sm"
            size="md"
            onPress={handleSubmit}
          >
            提交
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
