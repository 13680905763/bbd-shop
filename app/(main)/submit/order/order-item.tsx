"use client";

import { Button, Divider } from "@heroui/react";

import { useGlobalStore } from "@/store";
import { SourceIcon } from "@/components/ui";
import { ProductItem } from "@/components/block";

interface OrderItemProps {
  order: any;
  openServiceModal?: (cartId: string, skuId: string) => void;
  isExpired?: boolean;
  texts: {
    valueAddedService: string;
    noService: string;
    remark: string;
    shippingFee: string;
    serviceFee: string;
    productFee: string;
    shopTotal: string;
    add: string;
  };
}

export default function OrderItem({
  order,
  openServiceModal,
  isExpired = false,
  texts,
}: OrderItemProps) {
  const { currency } = useGlobalStore();

  return (
    <div className="card-cart overflow-auto">
      {/* 店铺头部 */}
      <div className="p-3 flex items-center gap-2 bg-[#f8f8f8]">
        <SourceIcon source={order?.source} />
        <div>{order?.shopName}</div>
      </div>

      <Divider />

      {/* 商品列表 */}
      <div className="space-y-4 p-4">
        {order.products.map((product: any) => (
          <div key={product?.propAndValue?.propName_valueName}>
            <ProductItem
              key={product.id}
              isDisabled={isExpired}
              // isSelected={isSelected(product.id)}
              product={product}
            // onDelete={onDeleteProduct}
            // onUpdateQuantity={onQuantityChange}
            // onRemark={onRemark}
            // onToggle={() => toggle(product.id)}
            />

            {/* 增值服务 */}
            {!isExpired && (
              <div className="p-3 bg-[#f8f8f8] rounded-lg mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-800">
                      {texts.valueAddedService}
                    </span>
                    {product?.orderServiceList?.length > 0 ? (
                      product.orderServiceList.map((item: any) => (
                        <span
                          key={item.serviceCode}
                          className="px-2 py-0.5 text-xs rounded-md bg-white text-gray-700 border border-gray-200"
                        >
                          {item.serviceName}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">
                        {texts.noService}
                      </span>
                    )}
                  </div>

                  <Button
                    className="button-white"
                    size="sm"
                    onPress={() => {
                      openServiceModal?.(
                        product?.cartId || 1,
                        product?.propAndValue?.propId_valueId,
                      );
                    }}
                  >
                    {texts.add}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 底部合计 */}
      {
        !isExpired &&
        <div className="p-4 text-right">
          <div>
            {texts.shippingFee}: {currency.symbol}
            {order?.postFee}
          </div>
          <div>
            {texts.serviceFee}: {currency.symbol}
            {order?.serviceFee}
          </div>
          <div>
            {texts.productFee}: {currency.symbol}
            {order?.productFee}
          </div>
          <div className="font-bold">
            {texts.shopTotal}: {currency.symbol}
            {order?.totalFee}
          </div>
        </div>
      }
    </div>
  );
}
