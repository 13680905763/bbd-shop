import React from "react";

import { CouponExchangeCard } from "@/components/block";
import { BlockSpinner, EmptyState } from "@/components/ui";
import { useCouponsConfig } from "@/hook/api";

export default function PointsRecordContent() {
  const { data, isFetching } = useCouponsConfig();

  console.log("data", data);

  if (!data?.length && !isFetching) return <EmptyState />;

  return (
    <div className="relative">
      {isFetching && <BlockSpinner />}
      <div className="grid grid-cols-3 gap-6">
        {data?.map((coupon: any) => (
          <CouponExchangeCard
            key={coupon.id}
            coupon={coupon}
            onExchange={() => console.log("redeem coupon", coupon)}
          />
        ))}
      </div>
    </div>
  );
}
