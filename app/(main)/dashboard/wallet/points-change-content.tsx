import React, { useCallback } from "react";

import { CouponExchangeCard } from "@/components/block";
import { BlockSpinner, EmptyState } from "@/components/ui";
import { useCouponsConfig, usePointExchangeCoupon } from "@/hook/api";
import { useConfirm } from "@/components/common";
import { useTranslations } from "next-intl";

export default function PointsRecordContent() {
  const t = useTranslations("dashboard.wallet.score");

  const { data, isFetching } = useCouponsConfig();
  const { mutateAsync: pointExchangeCoupon } = usePointExchangeCoupon();

  const { confirm } = useConfirm();
  console.log("data", data);
  const handleExchange = useCallback((coupon: any) => {
    confirm({
      title: t("exchangeConfirm.title"),
      content: t("exchangeConfirm.content", { points: coupon.exchangePoints, name: coupon.title }),
      onConfirm: async () => {
        await pointExchangeCoupon(coupon.id);
      },
    });
  }, [confirm, t, pointExchangeCoupon]);
  if (!data?.length && !isFetching) return <EmptyState />;

  return (
    <div className="relative">
      {isFetching && <BlockSpinner />}
      <div className="grid grid-cols-3 gap-6">
        {data?.map((coupon: any) => (
          <CouponExchangeCard
            key={coupon.id}
            coupon={coupon}
            onExchange={handleExchange}
          />
        ))}
      </div>
    </div>
  );
}
