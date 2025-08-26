"use client";
import { Button, Image } from "@heroui/react";

export default function ProductItem({ product, openServiceModal }: any) {
  return (
    <>
      <div className="flex ">
        <div className="flex flex-1">
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

        <div className="flex justify-center flex-[0_0_200px] ">
          <p className=" max-w-44   truncate ">
            备注：
            <span className="text-gray-500 ">
              {product?.remark ?? "暂无备注"}
            </span>
          </p>
        </div>
        <div className="flex justify-center  flex-[0_0_130px] ">
          <p>{product.price}</p>
        </div>
        <div className="flex justify-center flex-[0_0_150px] ">
          <p>x{product.quantity}</p>
        </div>
        <div className="flex justify-center flex-[0_0_150px] ">
          <p>{product.price * product.quantity}</p>
        </div>
      </div>
      <div className="p-3 bg-[#f8f8f8] rounded-lg">
        {/* 标题行 */}
        <div className="flex justify-between items-center ">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-800">增值服务</span>
            {product?.orderServiceList?.length > 0 ? (
              product?.orderServiceList.map((item: any) => (
                <span
                  key={item.serviceCode}
                  className="px-2 py-0.5 text-xs rounded-md bg-white text-gray-700 border border-gray-200"
                >
                  {item.serviceName}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">暂无服务</span>
            )}
          </div>

          <Button
            className="button-white"
            size="sm"
            onPress={() => {
              openServiceModal(product?.cartId || 1);
            }}
          >
            添加
          </Button>
        </div>
      </div>
    </>
  );
}
