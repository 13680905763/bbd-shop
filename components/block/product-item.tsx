import React from "react";
import { Checkbox, Image, Tooltip } from "@heroui/react";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Stepper from "./stepper";

import { useGlobalStore } from "@/store";

interface ProductItemProps {
  product: any;
  isOperated?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
  onRemark?: (id: string, remark: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
}

export default function ProductItem({
  product,
  isOperated = false,
  isSelected,
  onToggle,
  onRemark,
  onUpdateQuantity,
}: ProductItemProps) {
  const t = useTranslations("components.block.productItem");
  const { currency } = useGlobalStore();
  const router = useRouter();

  return (
    <div className="grid grid-cols-12 items-center gap-4  ">
      <div className="col-span-6 flex gap-4 items-start">
        {/* 选择框 + 图片 */}
        <div className="flex items-center shrink-0">
          {isOperated && (
            <Checkbox isSelected={isSelected} size="sm" onChange={onToggle} />
          )}
          <Image
            alt="Product"
            height={90}
            radius="md"
            referrerPolicy="no-referrer"
            src={product.skuPicUrl || product?.picUrl}
            width={90}
          />
        </div>

        {/* 商品信息 - 占满剩余宽度 */}
        <div className="flex-1 min-w-0 space-y-2">
          <button
            className="hover:text-[#f0700c] line-clamp-2 font-medium text-left w-full text-base"
            onClick={() =>
              router.push(
                `/goods/${product.source}/${product?.sourceProductId}`,
              )
            }
          >
            {product.productTitle}
          </button>
          <div className="line-clamp-1 text-gray-500 text-sm">
            {product?.propAndValue?.propName_valueName ??
              product?.sku?.propName_valueName}
          </div>
        </div>
      </div>

      <div className="col-span-2 flex justify-center items-center text-sm">
        <div className="flex  gap-2">
          {product.remark ? (
            <Tooltip
              className="bg-[#262626] text-white p-2 max-w-xs "
              content={product.remark}
              placement="bottom"
            >
              <p className=" text-gray-600 line-clamp-4 text-left">
                {product.remark}
              </p>
            </Tooltip>
          ) : (
            <p className="line-clamp-4 text-gray-600 text-left">
              {t("noRemark")}
            </p>
          )}
          {isOperated && (
            <button
              className="text-blue-500"
              onClick={() => onRemark!(product.id, product.remark)}
            >
              <FaEdit className="w-5 h-5 text-[#f0700c]" />
            </button>
          )}
        </div>
      </div>

      <div className="col-span-2 text-center font-semibold">
        {currency.symbol}
        {product?.price}
      </div>

      <div className="col-span-2 flex justify-center">
        {isOperated ? (
          <Stepper
            min={1}
            value={product.quantity}
            onChange={(value) => onUpdateQuantity!(product.id, value)}
          />
        ) : (
          <div className="font-semibold text-base">{product.quantity}</div>
        )}
      </div>
    </div>
  );
}
