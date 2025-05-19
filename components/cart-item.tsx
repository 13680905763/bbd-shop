import { Button, Checkbox, Divider, Image } from "@heroui/react";
import React from "react";

import { priceFont } from "./primitives";
import Stepper from "./stepper";

type product = {
  id?: string;
  imageUrl?: string;
  productTitle?: string;
  specs?: string;
  remark?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  skuPicUrl?: string;
  pavList?: any;
  price?: string;
  domesticShipping?: number;
  postFee?: number;
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
  console.log("items", items);

  return (
    <div className="bg-[#fff] rounded-md  w-full border border-[#ccc] ">
      <div className="p-4">
        <Checkbox />
        {shopName}
      </div>

      <Divider />
      <div className="flex flex-col gap-4 p-4">
        {items?.map((item) => (
          <div
            key={item?.id}
            className="flex justify-between items-center  gap-4 "
          >
            <div className=" flex ">
              <Checkbox />
              <Image
                alt="Product"
                height={90}
                src={item?.skuPicUrl}
                width={90}
              />
            </div>
            <div className="flex-[2] ">
              <div className="line-clamp-2 text-base font-bold">
                {item.productTitle}
              </div>
              <div className="text-light-gray line-clamp-1">
                {item?.pavList
                  ?.map((item: any) => `${item.propName}:${item.valueName}`)
                  .join(";")}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-money-lg">总计: ${item.totalPrice}</div>
              <div
                className={priceFont({
                  color: "black",
                  size: "sm",
                  weight: "normal",
                })}
              >
                单价: ${item.price}
              </div>
              <div className="text-light-gray">国内运费 {item.postFee}</div>
            </div>

            <div>
              <Stepper />
            </div>

            <div className="flex justify-center gap-2 flex-1">
              <Button className="button-default " size="sm">
                删除
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartItemCard;
