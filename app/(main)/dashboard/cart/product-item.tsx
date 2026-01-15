import React from "react";
import { Checkbox, Image, Tooltip } from "@heroui/react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Stepper from "@/components/stepper";
import { useGlobalStore } from "@/store";

interface ProductItemProps {
  product: any;
  isSelected: boolean;
  onToggle: () => void;
  onRemark: (id: string, remark: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
}

export default function ProductItem({
  product,
  isSelected,
  onToggle,
  onRemark,
  onUpdateQuantity,
  onDelete,
}: ProductItemProps) {
  const t = useTranslations("dashboard.cart.productItem");
  const { currency } = useGlobalStore();
  const router = useRouter();

  return (
    <div className="flex justify-between gap-4 text-sm">
      <div className="flex">
        <Checkbox isSelected={isSelected} size="sm" onChange={onToggle} />
        <Image
          alt="Product"
          height={90}
          radius="md"
          referrerPolicy="no-referrer"
          src={product.skuPicUrl || product?.picUrl}
          width={90}
        />
      </div>

      <div className="flex-[2] grow-0 shrink-0 basis-[350px] space-y-1">
        <button
          className="hover:text-[#f0700c] line-clamp-2 font-medium text-left"
          onClick={() =>
            router.push(`/goods/${product.source}/${product?.sourceProductId}`)
          }
        >
          {product.productTitle}
        </button>
        <div className="line-clamp-1 text-gray-500 ">
          {product.sku.propName_valueName}
        </div>
        <div className="flex items-center gap-2">
          <Tooltip
            className="bg-[#262626] text-white p-2 max-w-screen-sm"
            content={product.remark || t("noRemark")}
            placement="bottom"
          >
            <p className="max-w-44 truncate">
              {t("remark")}:{product.remark}
            </p>
          </Tooltip>
          <button
            className="text-blue-500"
            onClick={() => onRemark(product.id, product.remark)}
          >
            <FaEdit className="w-5 h-5 text-[#f0700c]" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="font-semibold text-red-500">
          {t("unitPrice")}:{currency.symbol}
          {product?.unitPrice}
        </div>
      </div>

      <div className="flex items-center">
        <Stepper
          value={product.quantity}
          onChange={(quantity) => onUpdateQuantity(product.id, quantity)}
        />
      </div>

      <div className="flex justify-center gap-2 flex-1 items-center">
        <button onClick={() => onDelete(product.id)}>
          <FaTrashAlt className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
