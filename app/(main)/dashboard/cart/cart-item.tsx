import { Checkbox, Divider, Tooltip, Image } from "@heroui/react";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import Stepper from "@/components/stepper";
import SourceIcon from "@/components/common/source-icon";
import { useGlobalStore } from "@/store";

function ProductItem({
  product,
  isSelected,
  toggle,
  handleProductRemark,
  handleProductQuantity,
  handleProductDelete,
}: any) {
  const t = useTranslations("Dashboard.cart.productItem"); // ✅ 命名空间 cart
  const { currency } = useGlobalStore();
  const router = useRouter();

  return (
    <div className="flex justify-between gap-4">
      <div className="flex">
        <Checkbox isSelected={isSelected} size="sm" onChange={toggle} />
        <button
          onClick={() =>
            router.push(`/goods/${product.source}/${product?.sourceProductId}`)
          }
        >
          <Image
            alt="Product"
            height={90}
            referrerPolicy="no-referrer"
            src={product.skuPicUrl || product?.picUrl}
            width={90}
          />
        </button>
      </div>

      <div className="flex-[2] grow-0 shrink-0 basis-[350px]">
        <div className="line-clamp-2 font-bold">{product.productTitle}</div>
        <div className="line-clamp-1 text-gray-500">
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
            onClick={() => handleProductRemark(product.id, product.remark)}
          >
            <FaEdit className="w-6 h-6 text-[#f0700c]" />
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
          onChange={(quantity) => handleProductQuantity(product.id, quantity)}
        />
      </div>

      <div className="flex justify-center gap-2 flex-1 items-center">
        <button
          className="text-[#f0700c]"
          onClick={() => handleProductDelete(product.id)}
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
}

export default function CartItem({
  cart,
  isSelected,
  toggle,
  isGroupAllSelected,
  toggleGroup,
  handleProductDelete,
  handleProductQuantity,
  handleProductRemark,
}: any) {
  return (
    <div className="card-cart overflow-auto">
      <div className="p-2 flex items-center gap-1 bg-[#f8f8f8]">
        <Checkbox
          isSelected={isGroupAllSelected}
          size="sm"
          onChange={toggleGroup}
        />
        <SourceIcon source={cart.cartList[0]?.source} />
        <div>{cart?.shopName}</div>
      </div>
      <Divider />
      <div className="flex flex-col gap-4 py-4 px-2">
        {cart.cartList.map((p: any) => (
          <ProductItem
            key={p.id}
            handleProductDelete={handleProductDelete}
            handleProductQuantity={handleProductQuantity}
            handleProductRemark={handleProductRemark}
            isSelected={isSelected(p.id)}
            product={p}
            toggle={() => toggle(p.id)}
          />
        ))}
      </div>
    </div>
  );
}
