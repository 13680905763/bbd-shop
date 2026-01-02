"use client";
import { useRef } from "react";
import { Button, Checkbox, Image } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { useTranslations } from "next-intl";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";
import { useGlobalStore } from "@/store";

export default function PackageItem({
  pack,
  onPayPackageRedirect,
  activeTab,
  selected,
  onChange,
  onRevokePackage,
  onCancelPackage,
  onChangePackageLine,
  onLine,
  onReceiptPackage,
}: any) {
  const t = useTranslations("dashboard.package.packageItem");

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

          <div className="flex flex-col justify-center p-2 text-gray-700 flex-[0_0_200px]">
            <p>{pack?.shipping?.methodCode}</p>
            <p>{pack?.shipping?.templateName}</p>
            {/* 物流信息 */}
            {pack?.shipping?.shippingCode && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                <div className="flex flex-col flex-1">
                  <span
                    className="text-gray-500"
                    role="button"
                    onClick={onLine}
                  >
                    <FiSearch
                      className="inline-block text-gray-500 mr-1"
                      size={14}
                    />
                    {t("shippingCode")}
                  </span>
                  <span className="font-medium text-gray-900 break-all">
                    {pack.shipping.shippingCode}
                  </span>
                </div>
              </div>
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

          <div className="flex flex-col gap-2 p-2 flex-[0_0_150px]">
            <div className="space-y-2 flex flex-col">
              {/* 状态展示 */}
              <div className="text-[#f0700c] font-medium">{pack?.status}</div>
              {/* 状态：更换路线 */}
              {pack?.changeFlag && (
                <Button
                  color="success"
                  radius="sm"
                  size="sm"
                  variant="flat"
                  onPress={onChangePackageLine}
                >
                  {t("changeBtn")}
                </Button>
              )}
              {/* 状态：申请取消 */}
              {pack?.cancelFlag && (
                <Button
                  radius="sm"
                  size="sm"
                  variant="flat"
                  onPress={onCancelPackage}
                >
                  {t("requestRefund")}
                </Button>
              )}

              {pack?.withdrawFlag && (
                <Button
                  color="danger"
                  radius="sm"
                  size="sm"
                  variant="flat"
                  onPress={onRevokePackage}
                >
                  {t("withdrawRequest")}
                </Button>
              )}

              {/* 状态：待付款 */}
              {(pack?.statusCode == 203 || pack?.statusCode == 209) && (
                <Button
                  color="primary"
                  radius="sm"
                  size="sm"
                  onPress={onPayPackageRedirect}
                >
                  {pack?.statusCode == 203 ? t("payButton") : t("payCancelFee")}
                </Button>
              )}
              {/* 状态：确认签收 */}
              {pack?.signFlag && (
                <Button
                  color="primary"
                  radius="sm"
                  size="sm"
                  onPress={onReceiptPackage}
                >
                  receipt
                </Button>
              )}
            </div>
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
