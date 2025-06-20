import { Divider, Checkbox } from "@heroui/react";

import ProductItem from "./product-item";
import { Product, Shop } from "./page";

import SourceIcon from "@/components/common/source-icon";

type ShopCardProps = {
  shop: Shop;
  selectedMap: { [productId: string]: boolean };
  onToggleItem: (productId: string, checked: boolean) => void;
  onToggleShop: (checked: boolean) => void;
  mutate: any;
};

export default function ShopCard({
  shop,
  selectedMap,
  onToggleItem,
  onToggleShop,
  mutate,
}: ShopCardProps) {
  const isAllSelected = shop.cartList.every((p) => selectedMap[p.id]);

  return (
    <div className="card-cart">
      <div className="p-4 flex items-center gap-1 bg-[#f8f8f8]">
        <Checkbox
          isSelected={isAllSelected}
          size="sm"
          onChange={(e) => onToggleShop(e.target.checked)}
        />
        <SourceIcon source={shop.cartList[0]?.source} />
        <div>{shop?.shopName}</div>
      </div>

      <Divider />

      <div className="flex flex-col gap-4 p-4">
        {shop.cartList.map((product: Product) => (
          <ProductItem
            key={product.id}
            isSelected={selectedMap[product.id]}
            mutate={mutate}
            product={product}
            onToggle={(checked) => onToggleItem(product.id, checked)}
          />
        ))}
      </div>
    </div>
  );
}
