import { Image } from "@heroui/react";
import { useRouter } from "next/navigation";

type ProductItemProps = {
  product: any;
  isLastProduct: boolean;
};

export default function ProductItem({
  product,
  isLastProduct,
}: ProductItemProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col gap-1 border-b p-2 px-4">
        {/* 商品主行 */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex grow-0 shrink-0 basis-[400px] gap-2">
            <div className="grow-0 shrink-0 basis-[90px]">
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
                  radius="none"
                  src={product.skuPicUrl || product?.picUrl}
                  width={90}
                />
              </button>
            </div>
            <div>
              <div className="line-clamp-2 font-bold">
                {product?.productTitle}
              </div>
              <div className="text-gray-500 text-sm">
                {product?.sku?.propName_valueName}
              </div>
              <div className="text-gray-500">{product?.remark}</div>
            </div>
          </div>

          <div>
            <p className="text-gray-700 text-sm font-medium">
              ${product.price}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">x{product.quantity}</p>
          </div>
        </div>

        {product?.orderServiceList?.length > 0 && (
          <div className="p-3 bg-[#f8f8f8] rounded-lg mt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-800">
                增值服务
              </span>
              {product.orderServiceList.map((item: any) => (
                <span
                  key={item.serviceId}
                  className="px-2 py-0.5 text-xs rounded-md bg-white text-gray-700 border border-gray-200"
                >
                  {item.serviceName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
