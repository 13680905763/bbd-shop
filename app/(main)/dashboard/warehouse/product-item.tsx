import { useRouter } from "next/navigation";
import { Image } from "antd";
import { Button } from "@heroui/react";

export default function ProductItem({ product, warehouse }: any) {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between gap-4  p-2 px-4">
        <div className="flex ">
          <div className="flex grow-0 shrink-0 basis-[400px] gap-2">
            <div className=" grow-0 shrink-0 basis-[90px]">
              <button
              // onClick={() =>
              //   router.push(
              //     `/goods/${product.source}/${product?.sourceProductId}`,
              //   )
              // }
              >
                <Image
                  alt="Product"
                  height={90}
                  src={product?.skuPicUrl || product?.picUrl}
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
        </div>

        <div className="flex gap-8">
          <p>x{product.quantity}</p>
          <p>{product.price}</p>
        </div>
        <div className="">
          <p>
            {warehouse.length}*{warehouse.width}*{warehouse.height}
          </p>
        </div>
        <div className="grow-0 shrink-0 basis-[180px] flex flex-col  gap-2 px-10">
          <Button className="button-default" radius="none" size="sm">
            申请退款
          </Button>
          <Button
            color="primary"
            // isDisabled={warehouse?.status !== "可出库"}
            radius="none"
            size="sm"
          >
            提交包裹
          </Button>
        </div>
      </div>
      <div className="flex  gap-2  justify-center flex-col p-2">
        {product?.orderServiceList?.map((service: any) => (
          <div key={service?.serviceId} className="flex gap-2">
            <div className="text-[#acacac] text-sm">{service?.serviceName}</div>
            <div className="flex gap-2">
              <Image.PreviewGroup
                preview={{
                  onChange: (current, prev) =>
                    console.log(
                      `current index: ${current}, prev index: ${prev}`,
                    ),
                }}
              >
                {service?.fileList?.map((item: any) => {
                  return (
                    <Image
                      key={item.id}
                      height={30}
                      src={item?.fileUrl}
                      width={30}
                    />
                  );
                })}
              </Image.PreviewGroup>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
