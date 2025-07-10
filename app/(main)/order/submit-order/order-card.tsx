import { Divider } from "@heroui/react";

import ProductItem from "./product-item";

import SourceIcon from "@/components/common/source-icon";

export default function OrderCard({ order }: any) {
  console.log(order);

  return (
    <div className="card-cart overflow-auto">
      <div className="p-4 flex items-center gap-1 bg-[#f8f8f8]">
        <SourceIcon source={order?.source} />
        <div>{order?.shopName}</div>
      </div>

      <Divider />

      <div className="flex flex-col gap-4 p-4">
        {order.products.map((product: any) => (
          <ProductItem
            key={product?.sku?.propName_valueName}
            product={product}
          />
        ))}
      </div>
      <Divider />

      <div className="p-4 text-right">
        <div>运费到仓库: {order?.postFee}</div>
        <div>附加服务: {order?.serviceFee}</div>
        <div>商品费用: {order?.productFee}</div>
        <div className="font-bold">店铺总计: {order?.totalFee}</div>
      </div>
    </div>
  );
}
