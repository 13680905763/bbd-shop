import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useGlobalStore } from "@/store";
import { configApi } from "@/services/configApi";
import { setUserCurrency } from "@/i18n/service";

// 货物分类列表
export const useCategoryOptions = () => {
  return useQuery({
    queryKey: ["categoryOptions"],
    queryFn: configApi.listCategories,
    staleTime: 50 * 1000,
    refetchOnWindowFocus: true,
  });
};
// 货币列表
export const useCurrencyOptions = () => {
  const query = useQuery({
    queryKey: ["currencyOptions"],
    queryFn: configApi.listCurrencies,
    staleTime: 50 * 1000,
    refetchOnWindowFocus: true,
  });

  const { data } = query;
  const { setCurrencies, currency, setCurrency } = useGlobalStore();

  useEffect(() => {
    if (data && data.length > 0) {
      // 1. 同步币种列表
      setCurrencies(data);

      const formatted = data.map((item: any) => ({
        label: item.currency,
        value: item.currency,
        symbol: item.symbol,
        rate: item.rate,
      }));

      // 寻找当前选中的币种在接口列表中的实时数据
      const currentInNew = formatted.find((c: any) => c.value === currency?.value);

      /**
       * 判断是否需要更新当前选中的货币：
       * 1. 当前是本地兜底的 (isLocal)
       * 2. 汇率变了 (rate 不一致)
       * 3. 选中的币种在后台不存在了 (!currentInNew)
       */
      const needUpdate =
        currency?.isLocal ||
        (currentInNew && currentInNew.rate !== currency.rate) ||
        !currentInNew;

      if (needUpdate) {
        // 如果找不到匹配的（过期了），默认拿 fallback (USD 或第一个)
        const updateTarget =
          currentInNew ||
          formatted.find((c: any) => c.value === "USD") ||
          formatted[0];

        setCurrency(updateTarget);
        setUserCurrency(updateTarget)
      }
    }
  }, [data, currency, setCurrency, setCurrencies]);

  return query;
};
// 奖金等级列表
export const useBonusConfig = () => {
  return useQuery({
    queryKey: ["bonusConfig"],
    queryFn: () => configApi.getBonusConfig(),
    staleTime: 10 * 60 * 100 * 1000, // 10 分钟内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};
// 优惠券列表
export const useCouponsConfig = () => {
  return useQuery({
    queryKey: ["couponsConfig"],
    queryFn: () => configApi.listCoupons(),
    staleTime: 10 * 60 * 100 * 1000, // 10 秒内认为是新鲜的
  });
};


// 获取活跃用户奖金配置
export const useInviteBonus = () => {
  return useQuery({
    queryKey: ["inviteBonus"],
    queryFn: () => configApi.listInviteBonus(),
    staleTime: 10 * 60 * 1000,
  });
};
