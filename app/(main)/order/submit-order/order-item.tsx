"use client";

import { Button, Divider, Image } from "@heroui/react";

import SourceIcon from "@/components/common/source-icon";
import { safeMul } from "@/utils/number";
import { useGlobalStore } from "@/store";

interface OrderItemProps {
  order: any;
  openServiceModal: (cartId: string, skuId: string) => void;
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
      <div className="flex flex-col gap-4 p-4">
        {order.products.map((product: any) => (
          <div key={product?.sku?.propName_valueName}>
            <div className="flex">
              <div className="flex flex-1">
                <div className="flex grow-0 shrink-0 basis-[400px] gap-2">
                  {/* 商品图 */}
                  <div className="grow-0 shrink-0 basis-[90px]">
                    <Image
                      alt="Product"
                      height={90}
                      src={product?.skuPicUrl || product?.picUrl}
                      width={90}
                    />
                  </div>
                  {/* 商品信息 */}
                  <div>
                    <div className="line-clamp-2 font-bold">
                      {product?.productTitle}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {product?.sku?.propName_valueName}
                    </div>
                  </div>
                </div>
              </div>

              {/* 备注 */}
              <div className="flex justify-center flex-[0_0_200px]">
                <p className="max-w-44 truncate">
                  {texts.remark}：
                  <span className="text-gray-500">
                    {product?.remark ?? texts.noService}
                  </span>
                </p>
              </div>
              {/* 单价 */}
              <div className="flex justify-center flex-[0_0_130px]">
                <p>
                  {currency.symbol}
                  {product.price}
                </p>
              </div>
              {/* 数量 */}
              <div className="flex justify-center flex-[0_0_150px]">
                <p>x{product.quantity}</p>
              </div>
              {/* 小计 */}
              <div className="flex justify-center flex-[0_0_150px]">
                <p>
                  {currency.symbol}
                  {safeMul(product.price, product.quantity)}
                </p>
              </div>
            </div>

            {/* 增值服务 */}
            <div className="p-3 bg-[#f8f8f8] rounded-lg">
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
                    openServiceModal(
                      product?.cartId || 1,
                      product?.sku?.propId_valueId,
                    );
                  }}
                >
                  {texts.add}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部合计 */}
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
    </div>
  );
}
