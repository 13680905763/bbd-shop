"use client";
import { Checkbox, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

import SourceIcon from "@/components/common/source-icon";
import { useGlobalStore } from "@/store";

type ProductItemProps = {
  product: any;
  isLastProduct: boolean;
  texts: any;
};

function ProductItem({ product, texts }: ProductItemProps) {
  const router = useRouter();
  const { currency } = useGlobalStore();

  return (
    <div className="flex flex-col gap-1 border-b p-2 px-4">
      {/* 商品主行 */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex grow-0 shrink-0 basis-[400px] gap-2">
          <div className="grow-0 shrink-0 basis-[90px]">
            <button
              onClick={() => {
                if (product.source === "BBD") return;
                router.push(
                  `/goods/${product.source}/${product?.sourceProductId}`,
                );
              }}
            >
              <Image
                alt="Product"
                height={90}
                radius="none"
                referrerPolicy="no-referrer"
                src={product.skuPicUrl || product?.picUrl}
                width={90}
              />
            </button>
          </div>
          <div>
            <div className="line-clamp-2 font-bold">
              {product?.productTitle}
            </div>
            <div className="text-gray-500 text-sm">
              {product?.sku?.propName_valueName}
            </div>
            <div className="text-gray-500">{product?.remark}</div>
            <div className="text-red-500">{product?.refundStatus}</div>
          </div>
        </div>

        <div>
          <p className="text-gray-700 text-sm font-medium">
            {currency.symbol}
            {product.price}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">x{product.quantity}</p>
        </div>
      </div>

      {product?.orderServiceList?.length > 0 && (
        <div className="p-3 bg-[#f8f8f8] rounded-lg mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-800">
              {texts.valueAddedService}
            </span>
            {product.orderServiceList.map((item: any) => (
              <span
                key={item.serviceId}
                className="px-2 py-0.5 text-xs rounded-md bg-white text-gray-700 border border-gray-200"
              >
                {item.serviceName}
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
  onPayOrderRedirect,
  onCancelOrder,
  activeTab,
  onChange,
  selected,
  onRequestRefund,
  texts,
}: any) {
  const { currency } = useGlobalStore();

  return (
    <div className="card-cart">
      <div className="p-4 flex items-center gap-1">
        {activeTab === "waitPay" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}
        <SourceIcon source={order?.source} />
        <div className="text-sm font-extrabold">
          {texts.orderNumber} {order?.orderCode}
        </div>
        <div className="text-[#acacac] text-sm">
          {texts.createTime} {order?.createTime}
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col flex-[4]">
          {order?.products.map((product: any, index: number) => (
            <ProductItem
              key={product.sourceSkuId}
              isLastProduct={index === order?.products.length - 1}
              product={product}
              texts={texts}
            />
          ))}
        </div>

        <div className="flex grow-0 shrink-0 basis-[120px] justify-center items-center">
          <p>
            {currency.symbol}
            {order?.totalFee}
          </p>
        </div>

        <div className="grow-0 shrink-0 basis-[180px] flex flex-col gap-2 justify-center items-center">
          {order?.statusCode === 101 ? (
            <>
              <button
                className="text-[#f0700c]"
                onClick={() => onPayOrderRedirect(order?.orderCode)}
              >
                {texts.payment}
              </button>
              <button
                className="text-[#f0700c]"
                onClick={() => onCancelOrder(order?.id)}
              >
                {texts.cancel}
              </button>
            </>
          ) : (
            <>
              <div className="text-[#f0700c]">{order?.status}</div>
              {order?.statusCode === 102 ? (
                <button
                  className="text-[#f0700c]"
                  onClick={() => onRequestRefund()} // ✅ 这里加上
                >
                  {texts.refund}
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
