import { Checkbox } from "@heroui/react";

import { SourceIcon } from "@/components/ui";
import ProductItem from "./product-item";

export default function CartItem({
  cart,
  isSelected,
  toggle,
  isGroupAllSelected,
  toggleGroup,
  onDeleteProduct,
  onQuantityChange,
  onRemark,
}: any) {
  return (
    <div className="border rounded-lg overflow-auto">
      <div className="p-2 flex items-center gap-1 bg-[#f8f8f8] font-semibold border-b">
        <Checkbox
          isSelected={isGroupAllSelected}
          size="sm"
          onChange={toggleGroup}
        />
        <SourceIcon source={cart.cartList[0]?.source} />
        <span>{cart?.shopName}</span>
      </div>
      <div className="space-y-4 py-4 px-2">
        {cart.cartList.map((p: any) => (
          <ProductItem
            key={p.id}
            isSelected={isSelected(p.id)}
            product={p}
            onDelete={onDeleteProduct}
            onUpdateQuantity={onQuantityChange}
            onRemark={onRemark}
            onToggle={() => toggle(p.id)}
          />
        ))}
      </div>
    </div>
  );
}
