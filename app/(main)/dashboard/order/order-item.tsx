import { Button, Divider } from "@heroui/react";

import ProductItem from "./product-item";

export default function OrderItem({ order, onPayOrderRedirect }: any) {
  return (
    <div className="card-cart ">
      <div className="p-4 flex items-center gap-1 ">
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
        <div className="flex grow-0 shrink-0 basis-[120px] justify-center pt-4 border-r-1 border-l-1">
          <p>$ {order?.totalFee}</p>
          {/* <p>国内运费 $ {order?.totalFee}</p> */}
        </div>
        <div className="grow-0 shrink-0 basis-[180px] flex flex-col pt-4 gap-2 px-10">
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
        </div>
      </div>
    </div>
  );
}
