"use client";
import { useRef } from "react";
import { Checkbox, Image } from "@heroui/react";
import { FiSearch } from "react-icons/fi";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";
import { useGlobalStore } from "@/store";

export default function PackageItem({
  order,
  onPayOrderRedirect,
  handlePackageSubmitItem,
  activeTab,
  selected,
  onChange,
  onRequestRefund,
  onRequestWithdraw,
  texts, // texts 从 props 传入
}: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currency } = useGlobalStore();

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
                  referrerPolicy="no-referrer"
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
              {texts.serviceFeeLabel}: {currency.symbol}
              {order?.totalServiceFee || 0}
            </span>
            <span className="font-semibold text-gray-800">
              {texts.totalFeeLabel}: {currency.symbol}
              {order?.totalFee}
            </span>
          </div>

          <div className="flex flex-col gap-2 p-2 flex-[0_0_150px]">
            {/* {order?.status === texts.pendingPaymentStatus ? (
              <>
                <Button
                  color="primary"
                  radius="none"
                  size="sm"
                  onPress={() => onPayOrderRedirect(order?.packingPackageCode)}
                >
                  {texts.payButton}123
                </Button>
                <Button className="button-default" radius="none" size="sm">
                  {texts.cancelButton}321
                </Button>
              </>
            ) : */}
            {/* ( */}
            <div className="space-y-2 flex flex-col">
              {/* 状态展示 */}
              <div className="text-[#f0700c] font-medium">{order?.status}</div>

              {/* 状态：待支付 */}
              {order?.statusCode == 203 && (
                <button
                  className="px-3 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
                  onClick={() =>
                    handlePackageSubmitItem(order?.packingPackageCode)
                  }
                >
                  {texts.payButton}
                </button>
              )}

              {/* 状态：支付取消手续费 */}
              {order?.statusCode == 209 && (
                <button
                  className="px-3 py-1 rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
                  onClick={() =>
                    handlePackageSubmitItem(order?.packingPackageCode)
                  }
                >
                  {texts.payCancelFee}
                </button>
              )}

              {/* 状态：申请取消 */}
              {order?.cancelFlag && (
                <button
                  className="px-3 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
                  onClick={onRequestRefund}
                >
                  {texts.requestRefund}
                </button>
              )}

              {/* 状态：撤回申请 */}
              {order?.withdrawFlag && (
                <button
                  className="px-3 py-1 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-colors text-sm font-medium shadow-sm"
                  onClick={onRequestWithdraw}
                >
                  {texts.withdrawRequest}
                </button>
              )}

              {/* 物流信息 */}
              {order?.shipping?.shippingCode && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                  <div className="flex flex-col flex-1">
                    <span className="text-gray-500">
                      <FiSearch
                        className="inline-block text-gray-500 mr-1"
                        size={14}
                      />
                      {texts.shippingCode || "运单号"}
                    </span>
                    <span className="font-medium text-gray-900 break-all">
                      {order.shipping.shippingCode}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* )} */}
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
