"use client";

import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";

import { languages } from "@/i18n/config";
import { useGlobalStore } from "@/store";
import { setUserLocale } from "@/i18n/service";

export default function LanguageCurrencySelector() {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    fetchConfig,
    currencies,
  } = useGlobalStore();

  useEffect(() => {
    const init = async () => {
      console.log("初始化 store");

      await fetchConfig(); // 等待异步执行完成
      console.log("currencies", currencies);
      // await setUserLocale(language);
    };

    init();
  }, []);

  // useEffect(() => {
  //   console.log("language", language);
  // }, [language]);
  // useEffect(() => {
  //   console.log("currencies", currencies);
  // }, [currencies]);

  const [tempLanguage, setTempLanguage] = useState(language); // 临时选择
  const [tempCurrency, setTempCurrency] = useState({ ...currency });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("保存选择", tempLanguage, tempCurrency);
      // 1. 更新 store
      setLanguage(tempLanguage);
      setCurrency({ ...tempCurrency });
      // 2. 写 localStorage
      localStorage.setItem("language", tempLanguage);
      localStorage.setItem("currency", JSON.stringify(tempCurrency));
      // 保存语言
      await setUserLocale(tempLanguage);
      // await setUserCurrency(tempCurrency);

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
          setTempLanguage(language);
          setTempCurrency({ ...currency });
        }
      }}
    >
      <PopoverTrigger>
        <Button
          className="bg-transparent text-base font-medium"
          size="lg"
          variant="light"
        >
          {languages.find((l) => l.value === language)?.label}/{currency.value}
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
                  color={tempLanguage === l.value ? "primary" : "default"}
                  radius="sm"
                  size="sm"
                  variant={tempLanguage === l.value ? "solid" : "flat"}
                  onPress={() => setTempLanguage(l.value)}
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
              {currencies.map((c: any) => (
                <Button
                  key={c.value}
                  color={tempCurrency.value === c.value ? "primary" : "default"}
                  radius="sm"
                  size="sm"
                  variant={tempCurrency.value === c.value ? "solid" : "flat"}
                  onPress={() => setTempCurrency({ ...c })}
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
