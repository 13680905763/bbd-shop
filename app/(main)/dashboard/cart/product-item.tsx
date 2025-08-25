import { Button, Checkbox, Image, Tooltip } from "@heroui/react";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

import Stepper from "@/components/stepper";
type ProductItemProps = {
  product: any;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
  handleProductDelete: (productId: string) => void;
  handleProductQuantity: (productId: string, quantity: number) => void;
  handleProductRemark: (productId: string, remark: string) => void;
};

export default function ProductItem({
  product,
  isSelected,
  onToggle,
  handleProductDelete,
  handleProductQuantity,
  handleProductRemark,
}: ProductItemProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between  gap-4">
      <div className="flex ">
        <Checkbox
          isSelected={isSelected}
          size="sm"
          onChange={(e) => onToggle(e.target.checked)}
        />
        <button
          onClick={() =>
            router.push(`/goods/${product.source}/${product?.sourceProductId}`)
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
        <div className="text-gray-500">{product.sku.propName_valueName}</div>
        <div className="flex">
          <Tooltip
            className="bg-[#262626] text-white p-2 max-w-screen-sm"
            content={product.remark || "暂无备注"}
            placement="right"
          >
            <p className=" max-w-44  truncate">备注：{product.remark}</p>
          </Tooltip>
          <button
            className="text-blue-500 underline"
            onClick={() => handleProductRemark(product.id, product.remark)}
          >
            <FaEdit className="w-6 h-6 text-[#f0700c]" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* <div className="text-lg font-semibold text-red-500">
          总计: ${product.totalPrice}
        </div> */}
        <div className="font-semibold text-red-500">
          单价: {product?.unitPrice}
        </div>
        <div className="text-gray-500">国内运费: {product?.postFee}</div>
      </div>
      <div className="flex items-center">
        <Stepper
          value={product.quantity}
          onChange={(quantity) => {
            handleProductQuantity(product.id, quantity);
          }}
        />
      </div>
      <div className="flex justify-end gap-2 flex-1 items-center">
        <Button
          className="button-default"
          size="sm"
          onPress={() => handleProductDelete(product.id)}
        >
          删除
        </Button>
      </div>
    </div>
  );
}
