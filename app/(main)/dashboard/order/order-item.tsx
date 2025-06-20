import { Divider } from "@heroui/react";

import { Product, Shop } from "./page";
import ProductItem from "./product-item";

type ShopCardProps = {
  shop: Shop;
};

export default function OrderItem({ shop }: ShopCardProps) {
  return (
    <div className="card-cart">
      <div className="p-4 flex items-center gap-1 bg-[#f8f8f8]">
        <div>{shop?.shopName}</div>
      </div>

      <Divider />

      <div className="flex flex-col gap-4 p-4">
        {shop.cartList.map((product: Product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
      <Divider />

      <div className="p-4 text-right">
        <div>运费到仓库: ¥ 0.00</div>
        <div className="font-bold">店铺总计: ¥ 260.00</div>
      </div>
    </div>
  );
}
