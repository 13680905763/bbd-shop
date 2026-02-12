"use client";
import { Button, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useGlobalStore } from "@/store";
import { RefundCountdown, SourceIcon } from "@/components/ui";
import ProductItem from "@/components/block/product-item";
function ProductItemWrapper({ product, onRevoke }: any) {
  const t = useTranslations("dashboard.order.orderItem");

  return (
    <div className="flex flex-col gap-1 border-b p-2 px-4">
      <ProductItem product={product} />
      {product?.withdrawRefundFlag && (
        <div className="mt-2 px-3 py-2 border border-orange-200 rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <div className="">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-orange-600">
                  {product?.refundStatus}
                </span>
                <span className="text-xs text-gray-500">
                  ×{product?.applyRefundQty}
                </span>
              </div>
              {product?.refundApplyRemark && (
                <div className="text-xs text-gray-500  px-2 py-1 rounded">
                  {t("refundRemark")}: {product.refundApplyRemark}
                </div>
              )}
            </div>
            <Button
              color="primary"
              size="sm"
              onPress={() => onRevoke(product?.refundId)}
            >
              {t("withdrawRequest")}
            </Button>
          </div>
        </div>
      )}
      {product?.orderServiceList?.length > 0 && (
        <div className="p-3 bg-[#f8f8f8] rounded-lg mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-800">
              {t("valueAddedService")}
            </span>
            {product.orderServiceList.map((item: any) => (
              <span
                key={item.id}
                className="px-2 py-0.5 text-xs rounded-md bg-white text-gray-700 border border-gray-200"
              >
                {item.serviceName}*{item.quantity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderItem({
  order,
  onCancel,
  showCheckbox,
  onChange,
  isSelected,
  onRefund,
  onRevoke,
}: any) {
  const t = useTranslations("dashboard.order.orderItem");
  const { currency } = useGlobalStore();
  const router = useRouter();

  return (
    <div className="card-cart">
      <div className="p-4 flex items-center gap-1">
        {showCheckbox ? (
          <Checkbox
            isSelected={isSelected(order.orderCode)}
            onChange={() => onChange(order.orderCode)}
          />
        ) : null}
        <SourceIcon source={order?.source} />
        <div className="text-sm font-extrabold">
          {t("orderNumber")} {order?.orderCode}
        </div>
        <div className="text-[#acacac] text-sm">
          {t("createTime")} {order?.createTime}
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col flex-[4]">
          {order?.products.map((product: any, index: number) => (
            <ProductItemWrapper
              key={product.id}
              isLastProduct={index === order?.products.length - 1}
              product={product}
              onRevoke={onRevoke}
            />
          ))}
        </div>

        <div className="flex flex-col justify-center p-2 flex-[0_0_150px]">
          <span className="text-gray-500 text-sm leading-5">
            {t("serviceFee")}: {currency.symbol}
            {order?.serviceFee || 0}
          </span>

          <span className="text-gray-500 text-sm leading-5">
            {t("shippingFee")}: {currency.symbol}
            {order?.postFee || 0}
          </span>

          <span className="text-gray-500 text-sm leading-5">
            {t("productFee")}: {currency.symbol}
            {order?.productFee || 0}
          </span>

          <span className="text-gray-500 text-sm leading-5">
            {t("refundAmount")}: {currency.symbol}
            {order?.refundAmount || 0}
          </span>

          <span className="font-semibold text-gray-800 text-sm leading-6">
            {t("totalFee")}: {currency.symbol}
            {order?.totalFee || 0}
          </span>
        </div>

        <div className="grow-0 shrink-0 basis-[180px] flex flex-col gap-2 justify-center items-center">
          {order?.canCancelFlag ? (
            <>
              <Button
                color="primary"
                radius="sm"
                size="sm"
                onPress={() => {
                  router.push(`/payment/${order?.orderCode}`);
                }}
              >
                {t("payment")}
              </Button>
              <Button
                radius="sm"
                size="sm"
                variant="flat"
                onPress={() => onCancel(order?.id)}
              >
                {t("cancel")}
              </Button>
            </>
          ) : (
            <>
              {/* 状态文字 */}
              <div className="text-[#f0700c] font-medium">{order?.status}</div>
              {order?.canRefundFlag && (
                <Button
                  radius="sm"
                  size="sm"
                  variant="flat"
                  onPress={() => onRefund(order)}
                >
                  {t("refund")}
                  {order?.refundTimeStamp && (
                    <RefundCountdown timestamp={order.refundTimeStamp} />
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
