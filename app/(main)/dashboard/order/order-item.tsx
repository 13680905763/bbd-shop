import { Button, Divider } from "@heroui/react";

import ProductItem from "./product-item";

import SourceIcon from "@/components/common/source-icon";

export default function OrderItem({ order, onPayOrderRedirect }: any) {
  return (
    <div className="card-cart ">
      <div className="p-4 flex items-center gap-1 ">
        <SourceIcon source={order?.source} />
        <div>创建时间：{order?.createTime}</div>
        <div>订单号：{order?.orderCode}</div>
      </div>

      <Divider className="border-1" />

      <div className="flex">
        <div className="flex flex-col   flex-[4]">
          {order?.products.map((product: any, index: number) => (
            <ProductItem
              key={product.id}
              isLastProduct={index === order?.products.length - 1}
              product={product}
            />
          ))}
        </div>
        <div className="flex grow-0 shrink-0 basis-[120px] justify-center items-center">
          <p>$ {order?.totalFee}</p>
          {/* <p>国内运费 $ {order?.totalFee}</p> */}
        </div>
        <div className="grow-0 shrink-0 basis-[180px] flex flex-col  gap-2  justify-center items-center">
          {order?.customerPayStatusCode === 201 ? (
            <>
              <Button
                color="primary"
                radius="none"
                size="sm"
                onPress={() => {
                  onPayOrderRedirect(order?.orderCode);
                }}
              >
                支付
              </Button>
              <Button className="button-default" radius="none" size="sm">
                取消
              </Button>
            </>
          ) : (
            <div className="text-[#f0700c]">{order?.status}</div>
          )}
        </div>
      </div>
    </div>
  );
}
