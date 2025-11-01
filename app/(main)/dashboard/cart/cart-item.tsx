import { Checkbox, Divider, Tooltip, Image } from "@heroui/react";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

import Stepper from "@/components/stepper";
import SourceIcon from "@/components/common/source-icon";
import { useGlobalStore } from "@/store";

type CartTexts = {
  remark: string;
  noRemark: string;
  unitPrice: string;
  postFee: string;
  delete: string;
};

type CartItemProps = {
  shop: any;
  selectedMap: { [productId: string]: boolean };
  onToggleItem: (productId: string, checked: boolean) => void;
  onToggleShop: (checked: boolean) => void;
  handleProductDelete: (productId: string) => void;
  handleProductQuantity: (productId: string, quantity: number) => void;
  handleProductRemark: (productId: string, remark: string) => void;
  texts: CartTexts;
};

export default function CartItem({
  texts,
  shop,
  selectedMap,
  onToggleItem,
  onToggleShop,
  handleProductDelete,
  handleProductQuantity,
  handleProductRemark,
}: CartItemProps) {
  const router = useRouter();
  const isAllSelected = shop.cartList.every((p: any) => selectedMap[p.id]);

  const ProductItem = ({
    product,
    isSelected,
    onToggle,
  }: {
    product: any;
    isSelected: boolean;
    onToggle: (checked: boolean) => void;
  }) => {
    const { currency } = useGlobalStore();

    return (
      <div className="flex justify-between gap-4">
        <div className="flex">
          <Checkbox
            isSelected={isSelected}
            size="sm"
            onChange={(e) => onToggle(e.target.checked)}
          />
          <button
            onClick={() =>
              router.push(
                `/goods/${product.source}/${product?.sourceProductId}`,
              )
            }
          >
            <Image
              alt="Product"
              height={90}
              src={product.skuPicUrl || product?.picUrl}
              width={90}
            />
          </button>
        </div>

        <div className="flex-[2] grow-0 shrink-0 basis-[350px]">
          <div className="line-clamp-2 font-bold">{product.productTitle}</div>
          <div className="line-clamp-1 text-gray-500">
            {product.sku.propName_valueName}
          </div>
          <div className="flex items-center gap-2">
            <Tooltip
              className="bg-[#262626] text-white p-2 max-w-screen-sm"
              content={product.remark || texts.noRemark}
              placement="bottom"
            >
              <p className="max-w-44 truncate">
                {texts.remark}:{product.remark}
              </p>
            </Tooltip>
            <button
              className="text-blue-500"
              onClick={() => handleProductRemark(product.id, product.remark)}
            >
              <FaEdit className="w-6 h-6 text-[#f0700c]" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="font-semibold text-red-500">
            {texts.unitPrice}:{currency.symbol}
            {product?.unitPrice}
          </div>
          {/* <div className="text-gray-500">
          {texts.postFee}: {product?.postFee}
        </div> */}
        </div>

        <div className="flex items-center">
          <Stepper
            value={product.quantity}
            onChange={(quantity) => handleProductQuantity(product.id, quantity)}
          />
        </div>

        <div className="flex justify-center gap-2 flex-1 items-center">
          <button
            className="text-[#f0700c]"
            onClick={() => handleProductDelete(product.id)}
          >
            {texts.delete}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="card-cart overflow-auto">
      <div className="p-2 flex items-center gap-1 bg-[#f8f8f8]">
        <Checkbox
          isSelected={isAllSelected}
          size="sm"
          onChange={(e) => onToggleShop(e.target.checked)}
        />
        <SourceIcon source={shop.cartList[0]?.source} />
        <div>{shop?.shopName}</div>
      </div>
      <Divider />
      <div className="flex flex-col gap-4 py-4 px-2">
        {shop.cartList.map((product: any) => (
          <ProductItem
            key={product.id}
            isSelected={selectedMap[product.id]}
            product={product}
            onToggle={(checked) => onToggleItem(product.id, checked)}
          />
        ))}
      </div>
    </div>
  );
}
