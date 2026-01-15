"use client";
import { Button, Checkbox, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

import { useGlobalStore } from "@/store";
import { SourceIcon } from "@/components/ui";

function ProductItem({ product, texts, revokeRefund }: any) {
  const { currency } = useGlobalStore();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-1 border-b p-2 px-4">
      {/* 商品主行 */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex grow-0 shrink-0 basis-[400px] gap-2">
          <div className="grow-0 shrink-0 basis-[90px]">
            <Image
              alt="Product"
              height={90}
              radius="md"
              referrerPolicy="no-referrer"
              src={product.skuPicUrl || product?.picUrl}
              width={90}
            />
          </div>
          <div>
            <button
              className="line-clamp-2 font-bold hover:text-[#f0700c] text-left"
              onClick={() => {
                if (product.source === "BBD") return;
                router.push(
                  `/goods/${product.source}/${product?.sourceProductId}`,
                );
              }}
            >
              {product?.productTitle}
            </button>
            <div className="text-gray-500 text-sm line-clamp-2">
              {product?.propAndValue?.propName_valueName}
            </div>
            <div className="text-gray-500">{product?.remark}</div>
            {product?.withdrawRefundFlag && (
              <>
                <div className="text-red-500">
                  {product?.refundStatus} *{product?.applyRefundQty}
                </div>
                <button
                  className="text-blue-500"
                  onClick={() => revokeRefund(product?.refundId)}
                >
                  {texts.withdrawRequest}
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <p className="text-gray-700 text-sm font-medium">
            {currency.symbol}
            {product.price}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">x{product.purchaseQuantity}</p>
        </div>
      </div>

      {
        product?.orderServiceList?.length > 0 && (
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
                  {item.serviceName}*{item.quantity}
                </span>
              ))}
            </div>
          </div>
        )
      }
    </div >
  );
}

export default function OrderItem({
  order,
  onCancelOrder,
  activeTab,
  onChange,
  selected,
  onRequestRefund,
  revokeRefund,
  texts,
}: any) {
  const { currency } = useGlobalStore();
  const router = useRouter();

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
              revokeRefund={revokeRefund}
              texts={texts}
            />
          ))}
        </div>

        <div className="flex flex-col justify-center p-2 flex-[0_0_150px]">
          <span className="text-gray-500 text-sm leading-5">
            {texts.serviceFee}: {currency.symbol}
            {order?.serviceFee || 0}
          </span>

          <span className="text-gray-500 text-sm leading-5">
            {texts.shippingFee}: {currency.symbol}
            {order?.postFee || 0}
          </span>

          <span className="text-gray-500 text-sm leading-5">
            {texts.productFee}: {currency.symbol}
            {order?.productFee || 0}
          </span>

          {/* <span className="text-gray-500 text-sm leading-5">
    {texts.discountFee}: {currency.symbol}{order?.discountFee || 0}
  </span> */}

          <span className="text-gray-500 text-sm leading-5">
            {texts.refundAmount}: {currency.symbol}
            {order?.refundAmount || 0}
          </span>

          <span className="font-semibold text-gray-800 text-sm leading-6">
            {texts.totalFee}: {currency.symbol}
            {order?.totalFee || 0}
          </span>
        </div>

        <div className="grow-0 shrink-0 basis-[180px] flex flex-col gap-2 justify-center items-center">
          {order?.canCancelFlag ? (
            <>
              {/* 支付按钮（主题橙色） */}
              {/* <button
                className="px-3 py-1 rounded-lg text-white bg-[#f0700c] hover:bg-[#d8650b] transition-colors text-sm font-medium shadow-sm"
                onClick={() => onPayOrderRedirect(order?.orderCode)}
              >
                {texts.payment}
              </button> */}
              <Button
                color="primary"
                radius="sm"
                size="sm"
                onPress={() => {
                  router.push(`/payment/${order?.orderCode}`);
                }}
              >
                {texts.payment}
              </Button>
              <Button
                radius="sm"
                size="sm"
                variant="flat"
                onPress={() => onCancelOrder(order?.id)}
              >
                {texts.cancel}
              </Button>
              {/* 取消订单按钮（主题橙色） */}
              {/* <button
                className="px-3 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
                onClick={() => onCancelOrder(order?.id)}
              >
                {texts.cancel}
              </button> */}
            </>
          ) : (
            <>
              {/* 状态文字 */}
              <div className="text-[#f0700c] font-medium">{order?.status}</div>

              {/* 申请退款按钮（绿色按钮） */}

              {order?.canRefundFlag && (
                // <button
                //   className="px-3 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
                //   onClick={() => onRequestRefund()}
                // >
                //   {texts.refund}
                // </button>
                <Button
                  color="danger"
                  radius="sm"
                  size="sm"
                  variant="flat"
                  onPress={() => onRequestRefund()}
                >
                  {texts.refund}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
