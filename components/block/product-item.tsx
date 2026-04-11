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
  isDisabled?: boolean;
}

export default function ProductItem({
  product,
  isOperated = false,
  isSelected,
  onToggle,
  onRemark,
  onUpdateQuantity,
  isDisabled = false,
}: ProductItemProps) {
  const t = useTranslations("components.block.productItem");
  const { currency } = useGlobalStore();
  const router = useRouter();

  return (
    <div
      className={`grid grid-cols-12 items-center gap-4 ${isDisabled ? "opacity-50" : ""}`}
    >
      <div className="col-span-6 flex gap-4 items-start">
        {/* 选择框 + 图片 */}
        <div className="flex items-center shrink-0">
          {isOperated && (
            <Checkbox
              isDisabled={isDisabled}
              isSelected={isSelected}
              size="sm"
              onChange={onToggle}
            />
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
              !isDisabled &&
              router.push(
                `/goods/${product.source}/${product?.sourceProductId}`,
              )
            }
          >
            {product.productTitle}
          </button>
          <div className="line-clamp-1 text-gray-500 text-sm">
            {product?.propAndValue?.propName_valueName}
          </div>
          {!product?.withdrawRefundFlag && product?.abnormalInfo && (
            <div className="my-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-red-500">
                {product?.abnormalInfo}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-2 flex justify-center items-center text-sm px-2">
        <div className="flex items-center gap-2 w-full min-w-0">
          {product.remark ? (
            <div className="flex-1 min-w-0">
              <Tooltip
                className="bg-[#262626] text-white p-2 max-w-xs break-all whitespace-pre-wrap"
                content={product.remark}
                placement="bottom"
              >
                <p className="text-gray-600 text-left truncate">
                  {product.remark}
                </p>
              </Tooltip>
            </div>
          ) : (
            <p className="text-gray-400 text-left italic flex-1 min-w-0 truncate">
              {t("noRemark")}
            </p>
          )}
          {isOperated && (
            <button
              className="text-blue-500 shrink-0"
              disabled={isDisabled}
              onClick={() => onRemark!(product.id, product.remark)}
            >
              <FaEdit
                className={`w-5 h-5 ${isDisabled ? "text-gray-400" : "text-[#f0700c]"}`}
              />
            </button>
          )}
        </div>
      </div>

      {product?.price && (
        <div className="col-span-2 text-center font-semibold">
          {currency.symbol}
          {product?.price}
        </div>
      )}

      {product.quantity && (
        <div className="col-span-2 flex justify-center">
          {isOperated ? (
            <div className={isDisabled ? "pointer-events-none" : ""}>
              <Stepper
                min={1}
                value={product.quantity}
                onChange={(value) => onUpdateQuantity!(product.id, value)}
              />
            </div>
          ) : (
            <div className="font-semibold text-base">
              {product.quantity ? `x${product.quantity}` : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
