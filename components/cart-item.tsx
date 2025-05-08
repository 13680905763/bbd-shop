import { Button, Checkbox, Divider, Image } from "@heroui/react";
import React from "react";

import { lightFont, priceFont } from "./primitives";
type product = {
  imageUrl: string;
  title: string;
  specs: string;
  remark?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  domesticShipping: number;
};
type CartItemCardProps = {
  shopName: string;
  items: product[];

  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  onMoveToFavorites?: () => void;
};

const CartItemCard: React.FC<CartItemCardProps> = ({ shopName, items }) => {
  return (
    <div className="bg-[#fff] rounded-md p-4 my-4 w-full">
      <div>
        <Checkbox />
        {shopName}
      </div>

      <Divider className="my-4" />
      {items.map((item, index) => (
        <div
          key={item.title}
          className="flex justify-between items-center gap-8 mb-4"
        >
          <div className="flex-1 flex ">
            <Checkbox />
            <Image
              alt="Product"
              className="h-[100px]"
              height={100}
              src={item.imageUrl}
              width={100}
            />
          </div>
          <div className="flex-[2]">
            <div className="line-clamp-2 text-base font-bold">{item.title}</div>
            <div className="text-[#acacac] text-sm line-clamp-1">
              {item.specs}
            </div>
            <div>{item.remark}</div>
            <div>备注</div>
          </div>

          <div className="flex-[1]">
            <div className={priceFont()}>总计: ${item.totalPrice}</div>
            <div
              className={priceFont({
                color: "black",
                size: "sm",
                weight: "normal",
              })}
            >
              单价: ${item.unitPrice}
            </div>
            <div className={lightFont({ size: "sm" })}>
              国内运费 {item.domesticShipping.toFixed(2)}
            </div>
          </div>

          <div className="flex flex-1 items-center  border border-gray-200">
            <Button
              isIconOnly
              className="bg-[#f5f7fa] border-r border-gray-200"
              radius="none"
              size="sm"
            >
              -
            </Button>
            <span className="w-8 text-center flex-1">{item.quantity}</span>
            <Button
              isIconOnly
              className="bg-[#f5f7fa] border-l border-gray-200 "
              radius="none"
              size="sm"
            >
              +
            </Button>
          </div>

          <div className="flex justify-center gap-2 flex-[2]">
            <Button radius="none" size="sm">
              移入收藏夹
            </Button>
            <Button radius="none" size="sm">
              删除
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItemCard;
