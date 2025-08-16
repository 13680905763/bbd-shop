import { Button, Divider } from "@heroui/react";

import ProductItem from "./product-item";

export default function OrderItem({ order, onPayOrderRedirect }: any) {
  return (
    <div className="card-cart text-sm">
      <div className="p-2 flex items-center gap-1 ">
        <div className="text-sm">
          包裹编号：
          <span className="font-semibold">{order?.outboundCode}</span>
        </div>
      </div>
      <Divider className="border-1" />

      <div className="flex">
        <div className="flex grow-0 shrink-0 basis-[400px]">
          {order?.packageItemList?.map((item: any) => (
            <ProductItem key={item.id} product={item.orderProduct} />
          ))}
        </div>
        {/* <div className="flex grow-0 shrink-0 basis-[100px] p-2   ">
          <p>{order?.address?.recipient}</p>
        </div> */}
        <div className="flex grow-0 shrink-0 basis-[80px]  p-2">
          <p>{order?.shipping?.methodCode}</p>
        </div>
        <div className="flex flex-col grow-0 shrink-0 basis-[80px]  p-2">
          <p>留言</p>
          <p>拍照图片</p>
        </div>
        <div className="flex  flex-col grow-0 shrink-0 basis-[150px]  p-2">
          <p>服务费：{order?.totalServiceFee}</p>
          <p>总费用：{order?.totalFee}</p>
        </div>
        <div className="flex  flex-col grow-0 shrink-0 basis-[120px]  p-2">
          <p>{order?.status}</p>
        </div>
        <div className="grow-0 shrink-0 basis-[180px] flex flex-col p-2 gap-2 px-10">
          {order?.status === "待付款" ? (
            <>
              <Button
                color="primary"
                radius="none"
                size="sm"
                onPress={() => {
                  onPayOrderRedirect(order?.outboundCode);
                }}
              >
                支付
              </Button>
              <Button className="button-default" radius="none" size="sm">
                取消
              </Button>
            </>
          ) : (
            <div>已支付</div>
          )}
        </div>
      </div>
    </div>
  );
}
