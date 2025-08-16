import { Image } from "@heroui/react";
import { useRouter } from "next/navigation";

type ProductItemProps = {
  product: any;
};

export default function ProductItem({ product }: ProductItemProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center gap-4 border-b-1 p-2 px-4">
        <div className="flex ">
          <div className=" grow-0 shrink-0 basis-[90px]">
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
          <div>
            <div className="line-clamp-2 text-sm">{product?.productTitle}</div>
          </div>
        </div>
      </div>
    </>
  );
}
