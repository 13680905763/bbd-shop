"use client";
import { useRef } from "react";
import { Button, Checkbox, Image } from "@heroui/react";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";

export default function PackageItem({
  order,
  onPayOrderRedirect,
  activeTab,
  selected,
  onChange,
  texts, // texts 从 props 传入
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
    const walk = (x - startX.current) * 1.5;
    const newScrollLeft = scrollLeft.current - walk;

    velocity.current = newScrollLeft - (scrollRef.current.scrollLeft || 0);
    scrollRef.current.scrollLeft = newScrollLeft;
  };

  const handleMouseUpOrLeave = () => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.cursor = "grab";

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
        {texts.packageNumberLabel}:
        <span className="font-semibold">{order?.packingPackageCode}</span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center border-gray-200 p-2 text-center text-sm">
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
                  alt={texts.productImageAlt}
                  className="object-cover border border-gray-200 rounded-sm"
                  draggable={false}
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

          <div className="flex flex-col justify-center p-2 text-gray-700 flex-[0_0_150px]">
            <span>
              {texts.sizeLabel}: {order?.length}*{order?.width}*{order?.height}{" "}
              cm
            </span>
          </div>

          <div className="flex flex-col justify-center p-2 text-gray-700 flex-[0_0_150px]">
            <span>
              {texts.weightLabel}: {order?.weight} g
            </span>
          </div>

          <div className="flex flex-col justify-center p-2 text-gray-700 flex-[0_0_10px]">
            <span>{order?.shipping?.methodCode}</span>
          </div>

          <div className="flex flex-col justify-center p-2 flex-[0_0_150px]">
            <span className="text-gray-500">
              {texts.serviceFeeLabel}: {order?.totalServiceFee}
            </span>
            <span className="font-semibold text-gray-800">
              {texts.totalFeeLabel}: {order?.totalFee}
            </span>
          </div>

          <div className="flex flex-col gap-2 p-2 flex-[0_0_150px]">
            {order?.status === texts.pendingPaymentStatus ? (
              <>
                <Button
                  color="primary"
                  radius="none"
                  size="sm"
                  onPress={() => onPayOrderRedirect(order?.packingPackageCode)}
                >
                  {texts.payButton}
                </Button>
                <Button className="button-default" radius="none" size="sm">
                  {texts.cancelButton}
                </Button>
              </>
            ) : (
              <div className="text-[#f0700c] font-medium">{order?.status}</div>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-center flex-col py-2">
          {order.serviceList.map((service: any) => (
            <div key={service.serviceId} className="mb-4 flex gap-2">
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
