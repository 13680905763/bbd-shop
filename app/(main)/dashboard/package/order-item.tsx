"use client";
import { useRef } from "react";
import { Button, Checkbox, Divider, Image } from "@heroui/react";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";

export default function OrderItem({
  order,
  onPayOrderRedirect,
  activeTab,
  selected,
  onChange,
}: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const frameId = useRef<number>();

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
    velocity.current = 0;
    scrollRef.current!.style.cursor = "grabbing";
    cancelAnimationFrame(frameId.current!);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // 拖动放大
    const newScrollLeft = scrollLeft.current - walk;

    velocity.current = newScrollLeft - (scrollRef.current.scrollLeft || 0);
    scrollRef.current.scrollLeft = newScrollLeft;
  };

  const handleMouseUpOrLeave = () => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.cursor = "grab";

    // 惯性滚动
    const momentum = () => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollLeft += velocity.current;
      velocity.current *= 0.95;
      if (Math.abs(velocity.current) > 0.5) {
        frameId.current = requestAnimationFrame(momentum);
      }
    };

    frameId.current = requestAnimationFrame(momentum);
  };

  return (
    <div className="card-cart mb-4 p-2 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2 p-2 text-sm">
        {activeTab === "pay" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}
        包裹编号:
        <span className="font-semibold">{order?.packingPackageCode}</span>
      </div>
      <Divider className="border-gray-200" />

      <div className="flex flex-col">
        <div className="flex items-center border-b border-gray-200 p-2 text-center text-sm">
          {/* 图片列表，仅摁住拖动 */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-hidden cursor-grab select-none flex-1"
            role="button"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
          >
            {order?.packageItemList?.map((item: any) => (
              <div key={item.id} className="flex-shrink-0">
                <Image
                  alt="Product"
                  className="object-cover border border-gray-200 rounded-sm"
                  draggable={false} // 禁用浏览器默认拖拽
                  height={120}
                  radius="sm"
                  src={
                    item.orderProduct?.skuPicUrl || item.orderProduct?.picUrl
                  }
                  width={120}
                />
              </div>
            ))}
          </div>

          {/* 尺寸 */}
          <div className="flex flex-col justify-center p-2  text-gray-700 flex-[0_0_150px]  ">
            <span>
              尺寸: {order?.length}*{order?.width}*{order?.height} cm
            </span>
          </div>

          {/* 重量 */}
          <div className="flex flex-col justify-center p-2  text-gray-700 flex-[0_0_150px]">
            <span>重量: {order?.weight} g</span>
          </div>

          {/* 物流方式 */}
          <div className="flex flex-col justify-center p-2  text-gray-700 flex-[0_0_10px]">
            <span>{order?.shipping?.methodCode}</span>
          </div>

          {/* 服务费 & 总费用 */}
          <div className="flex flex-col justify-center p-2  flex-[0_0_150px]">
            <span className="text-gray-500">
              服务费: {order?.totalServiceFee}
            </span>
            <span className="font-semibold text-gray-800">
              总费用: {order?.totalFee}
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col gap-2 p-2 flex-[0_0_150px]">
            {order?.status === "待付款" ? (
              <>
                <Button
                  color="primary"
                  radius="none"
                  size="sm"
                  onPress={() => onPayOrderRedirect(order?.packingPackageCode)}
                >
                  支付
                </Button>
                <Button className="button-default" radius="none" size="sm">
                  取消
                </Button>
              </>
            ) : (
              <div className="text-[#f0700c] font-medium">{order?.status}</div>
            )}
          </div>
        </div>

        {/* 服务列表 */}
        <div className="flex flex-col gap-4 p-2">
          {order.serviceList.map((service: any) => (
            <div key={service.serviceId}>
              <div className="text-gray-400 text-sm mb-2">
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
