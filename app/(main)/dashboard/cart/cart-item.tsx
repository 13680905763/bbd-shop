import { Checkbox } from "@heroui/react";

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
}: any) {
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
          <ProductItem
            key={p.id}
            isOperated={true}
            isSelected={isSelected(p.id)}
            product={p}
            onRemark={onRemark}
            onToggle={() => toggle(p.id)}
            onUpdateQuantity={onQuantityChange}
          />
        ))}
      </div>
    </div>
  );
}
