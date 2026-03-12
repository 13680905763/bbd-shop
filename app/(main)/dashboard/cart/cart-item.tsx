import { Checkbox } from "@heroui/react";
import { FaTrashAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";

import { SourceIcon } from "@/components/ui";
import ProductItem from "@/components/block/product-item";

export default function CartItem({
  cart,
  isSelected,
  toggle,
  isGroupAllSelected,
  toggleGroup,
  onQuantityChange,
  onRemark,
  onDelete,
}: any) {
  const t = useTranslations("dashboard.cart");

  return (
    <div className="border rounded-lg overflow-auto">
      <div className="p-2 flex items-center gap-1 bg-gray-50 font-semibold border-b">
        <Checkbox
          isSelected={isGroupAllSelected(cart.shopId)}
          size="sm"
          onChange={() => toggleGroup(cart.shopId)}
        />
        <SourceIcon source={cart.cartList[0]?.source} />
        <span>{cart?.shopName}</span>
      </div>
      <div className="space-y-5 py-4 px-2">
        {cart.cartList.map((p: any) => (
          <div key={p.id} className="relative group">
            <ProductItem
              isDisabled={p.status === 3}
              isOperated={true}
              isSelected={isSelected(p.id)}
              product={p}
              onRemark={onRemark}
              onToggle={() => toggle(p.id)}
              onUpdateQuantity={onQuantityChange}
            />
            {p.status === 3 && (
              <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10 rounded-lg backdrop-blur-[1px]">
                <div className="flex items-center gap-4 p-3 rounded-xl ">
                  <span className="text-gray-500 font-medium">
                    {t("itemExpired")}
                  </span>
                  <button
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title={t("delete")}
                    onClick={() => onDelete(p.id)}
                  >
                    <FaTrashAlt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
