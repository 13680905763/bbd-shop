import clsx from "clsx";
import { Image } from "@heroui/react";
import { useRouter } from "next/navigation";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";
import { WarehousePackageItem } from "@/types/warehouse";

type PackageProductItemProps = {
  packageItem: WarehousePackageItem;
  isBorder?: boolean;
};

export default function PackageProductItem({
  packageItem,
  isBorder = false,
}: PackageProductItemProps) {
  const router = useRouter();
  const product = packageItem?.orderProduct;

  return (
    <div
      className={clsx(
        "w-full",
        isBorder && "rounded-lg border border-gray-200 p-4",
      )}
    >
      <div
        className={clsx(
          "grid items-start gap-4",
          "grid-cols-[90px_1fr_80px_100px_140px_80px]",
        )}
      >
        <Image
          alt="Product"
          className="rounded-md object-cover"
          height={90}
          referrerPolicy="no-referrer"
          src={product?.skuPicUrl || product?.picUrl}
          width={90}
        />

        <div className="min-w-0">
          <button
            className={clsx(
              "line-clamp-2 text-left font-semibold",
              packageItem.source !== "BBD" && "hover:text-[#f0700c]",
            )}
            onClick={() => {
              if (packageItem.source === "BBD") return;
              router.push(
                `/goods/${packageItem.source}/${packageItem.sourceProductId}`,
              );
            }}
          >
            {product?.productTitle}
          </button>

          <div className="mt-1 text-sm text-gray-500">
            {product?.propAndValue?.propName_valueName}
          </div>

          {product?.remark && (
            <div className="mt-1 text-sm text-gray-400">{product.remark}</div>
          )}
        </div>

        {/* 数量 */}
        <div className="text-center text-gray-700 font-medium">
          ×{packageItem.quantity}
        </div>

        {/* 重量 */}
        <div className="text-center text-gray-700 font-medium">
          {packageItem.weight} <span className="text-gray-500 text-sm">g</span>
        </div>

        {/* 尺寸 */}
        <div className="text-center text-gray-700 font-medium">
          {packageItem.length}×{packageItem.width}×{packageItem.height}
          <span className="text-gray-500 text-sm ml-1">cm</span>
        </div>

        {/* 状态 */}
        {!isBorder && (
          <div className="text-center font-semibold text-[#f0700c]">
            {packageItem.status}
          </div>
        )}
      </div>

      {/* 增值服务 */}
      {!isBorder && product && product.orderServiceList.length > 0 && (
        <div className="mt-4 space-y-3 pl-[90px]">
          {product?.orderServiceList.map((service: any) => (
            <div key={service.id} className="flex items-start gap-3">
              <div className="w-[80px] text-sm text-gray-400">
                {service.serviceName}
              </div>

              <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
