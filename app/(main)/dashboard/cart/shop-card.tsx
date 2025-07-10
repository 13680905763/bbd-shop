import { Checkbox, Divider } from "@heroui/react";

import ProductItem from "./product-item";

import SourceIcon from "@/components/common/source-icon";

type ShopCardProps = {
  shop: any;
  selectedMap: { [productId: string]: boolean };
  onToggleItem: (productId: string, checked: boolean) => void;
  onToggleShop: (checked: boolean) => void;
  handleProductDelete: (productId: string) => void;
  handleProductQuantity: (productId: string, quantity: number) => void;
  handleProductRemark: (productId: string, remark: string) => void;
};

export default function ShopCard({
  shop,
  selectedMap,
  onToggleItem,
  onToggleShop,
  handleProductDelete,
  handleProductQuantity,
  handleProductRemark,
}: ShopCardProps) {
  const isAllSelected = shop.cartList.every((p: any) => selectedMap[p.id]);

  return (
    <div className=" card-cart overflow-auto">
      <div className="p-4 flex items-center gap-1 bg-[#f8f8f8] ">
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
        {shop.cartList.map((product: any) => (
          <ProductItem
            key={product.id}
            handleProductDelete={handleProductDelete}
            handleProductQuantity={handleProductQuantity}
            handleProductRemark={handleProductRemark}
            isSelected={selectedMap[product.id]}
            product={product}
            onToggle={(checked) => onToggleItem(product.id, checked)}
          />
        ))}
      </div>
    </div>
  );
}
