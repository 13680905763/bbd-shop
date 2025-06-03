import { Divider, Checkbox } from "@heroui/react";
import { AiFillTaobaoSquare } from "react-icons/ai";

import ProductItem from "./product-item";
import { Product, Shop } from "./page";

import { Icon1688 } from "@/components/icons";

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
    <div className="bg-white rounded-md w-full border border-gray-300">
      <div className="p-4 flex items-center gap-1">
        <Checkbox
          isSelected={isAllSelected}
          size="sm"
          onChange={(e) => onToggleShop(e.target.checked)}
        />
        {shop.cartList[0]?.source === "TAOBAO" ? (
          <AiFillTaobaoSquare className="text-[#ff5000] w-[22px] h-[22px]" />
        ) : shop.cartList[0]?.source === "1688" ? (
          <Icon1688 className="text-orange-500" size={22} />
        ) : null}
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
