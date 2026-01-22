"use client";
import { useRef, useState } from "react";
import { Button, Checkbox, Image } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { useTranslations } from "next-intl";
import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";
import { useGlobalStore } from "@/store";

export default function PackageItem({
  pack, //运单信息
  showCheckbox, //是否展示勾选框
  isSelected, //是否选中
  onChange, //选中状态改变回调
  onPay, //支付
  onChangeLine, //更换路线
  onCancel, //取消
  onRevoke, //撤销
  onTrack, //跟踪
  onReceipt, //确认收货
}: any) {
  const t = useTranslations("dashboard.package.packageItem");

  const scrollRef = useRef<HTMLDivElement>(null);
  const { currency } = useGlobalStore();
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const [isLineLoading, setIsLineLoading] = useState(false);
  const [isTrackLoading, setIsTrackLoading] = useState(false);



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
      <div className="flex items-center  p-2 text-sm">
        {showCheckbox ? (
          <Checkbox isSelected={isSelected(pack.packingPackageCode)} onChange={() => onChange(pack.packingPackageCode)} />
        ) : null}
        {t("packageNumberLabel")}:
        <span className="font-semibold">{pack?.packingPackageCode}</span>
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
            {pack?.packageItemList?.map((item: any) => (
              <div key={item.id} className="flex-shrink-0">
                <Image
                  alt={t("productImageAlt")}
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

          <div className="flex flex-col justify-center p-2 text-gray-700 flex-[0_0_180px]">
            <span>
              {t("sizeLabel")}: {pack?.length}*{pack?.width}*{pack?.height} cm
            </span>
          </div>

          <div className="flex flex-col justify-center p-2 text-gray-700 flex-[0_0_150px]">
            <span>
              {t("weightLabel")}: {pack?.weight} g
            </span>
          </div>

          <div className="space-y-2 flex-[0_0_200px]">
            <p>{pack?.shipping?.methodCode}</p>
            <p>{pack?.shipping?.templateName}</p>
            {/* 物流信息 */}
            {pack?.shipping?.shippingCode && (
              <Button
                className="button-default"
                size="sm"
                isLoading={isTrackLoading}
                onPress={async () => {
                  setIsTrackLoading(true);
                  await onTrack(pack);
                  setIsTrackLoading(false);
                }}
              >
                <FiSearch
                  size={14}
                />
                {pack.shipping.shippingCode}
              </Button>
            )}
          </div>

          <div className="flex flex-col justify-center p-2 flex-[0_0_150px]">
            <span className="text-gray-500">
              {t("serviceFeeLabel")}: {currency.symbol}
              {pack?.totalServiceFee || 0}
            </span>
            <span className="font-semibold text-gray-800">
              {t("totalFeeLabel")}: {currency.symbol}
              {pack?.totalFee}
            </span>
          </div>

          <div className="space-y-2 p-2 flex-[0_0_150px]">
            <div className="text-[#f0700c] font-medium">{pack?.status}</div>
            {(pack?.statusCode == 203 || pack?.statusCode == 209) && (
              <Button
                color="primary"
                radius="sm"
                size="sm"
                isLoading={isPayLoading}
                onPress={async () => {
                  setIsPayLoading(true);
                  await onPay([pack.packingPackageCode])
                  setIsPayLoading(false);
                }
                }
              >
                {pack?.statusCode == 203 ? t("payButton") : t("payCancelFee")}
              </Button>
            )}
            {pack?.changeFlag && (
              <Button
                // color="primary"
                className="button-default"
                radius="sm"
                size="sm"
                isLoading={isLineLoading}
                onPress={async () => {
                  setIsLineLoading(true);
                  await onChangeLine(pack);
                  setIsLineLoading(false);
                }}
              >
                {t("changeBtn")}
              </Button>
            )}
            {pack?.cancelFlag && (
              <Button
                radius="sm"
                size="sm"
                variant="flat"
                isLoading={isCancelLoading}
                onPress={async () => {
                  setIsCancelLoading(true);
                  await onCancel(pack);
                  setIsCancelLoading(false);
                }}
              >
                {t("requestRefund")}
              </Button>
            )}
            {pack?.withdrawFlag && (
              <Button
                radius="sm"
                size="sm"
                variant="flat"
                onPress={() => onRevoke(pack?.id)}
              >
                {t("withdrawRequest")}
              </Button>
            )}

            {pack?.signFlag && (
              <Button
                color="primary"
                radius="sm"
                size="sm"
                onPress={() => onReceipt(pack?.id)}
              >
                {t("receipt")}
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-center flex-col py-2">
          {pack.serviceList.map((service: any) => (
            <div key={service.serviceId} className="mb-4 flex gap-2">
              <div className="text-gray-400 text-sm mb-2">
                {service.serviceName}*{service.quantity}
              </div>
              <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
