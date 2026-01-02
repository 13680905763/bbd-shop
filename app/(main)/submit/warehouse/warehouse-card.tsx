"use client";
import { Image } from "@heroui/react";

import { useGlobalStore } from "@/store";

export default function WarehouseCard({ warehouse }: any) {
  const { currency } = useGlobalStore();

  const { orderProduct: product } = warehouse;

  return (
    <div className="card-cart overflow-auto ">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between  gap-4">
          <div className="flex ">
            <div className="flex grow-0 shrink-0 basis-[400px] gap-2">
              <div className=" grow-0 shrink-0 basis-[90px]">
                <div>
                  <Image
                    alt="Product"
                    height={90}
                    src={product?.skuPicUrl || product?.picUrl}
                    width={90}
                  />
                </div>
              </div>
              <div>
                <div className="line-clamp-2 font-bold">
                  {product?.productTitle}
                </div>
                <div className="text-gray-500 text-sm">
                  {product?.sku?.propName_valueName}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 grow-0 shrink-0 basis-[100px]">
            <p>x{product.quantity}</p>
            <p>
              {currency.symbol}
              {product.price}
            </p>
          </div>
          <div className="flex grow-0 shrink-0 basis-[100px]">
            <p>
              {warehouse.length}*{warehouse.width}*{warehouse.height}
            </p>
          </div>
          <div className="flex grow-0 shrink-0 basis-[100px]">
            <p>{warehouse.weight}g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
