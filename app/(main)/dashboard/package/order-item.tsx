import { Button, Divider } from "@heroui/react";

import ProductItem from "./product-item";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";

export default function OrderItem({ order, onPayOrderRedirect }: any) {
  console.log("onPayOrderRedirect", onPayOrderRedirect);

  return (
    <div className="card-cart text-sm">
      <div className="p-2 flex items-center gap-1 ">
        <div className="text-sm">
          包裹编号：
          <span className="font-semibold">{order?.outboundCode}</span>
        </div>
      </div>
      <Divider className="border-1" />

      <div className="flex-1 flex flex-col ">
        <div className="flex">
          <div className="flex grow-0 shrink-0 basis-[400px] ">
            {order?.packageItemList?.map((item: any) => (
              <ProductItem key={item.id} product={item.orderProduct} />
            ))}
          </div>

          <div className="flex grow-0 shrink-0 basis-[80px]  p-2">
            <p>{order?.shipping?.methodCode}</p>
          </div>

          <div className="flex  flex-col grow-0 shrink-0 basis-[150px]  p-2">
            <p>服务费：{order?.totalServiceFee}</p>
            <p>总费用：{order?.totalFee}</p>
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
              <div className="text-[#f0700c]">{order?.status}</div>
            )}
          </div>
        </div>
        <div className="flex  gap-2  justify-center flex-col px-2 pb-2">
          {order.serviceList.map((service: any) => (
            <div key={service.serviceId} className="mb-4">
              <div className="text-[#acacac] text-sm mb-2">
                {service.serviceName}
              </div>
              <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
