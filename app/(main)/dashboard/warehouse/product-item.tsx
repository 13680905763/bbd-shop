import { useRouter } from "next/navigation";
import { Image } from "antd";
import { Button } from "@heroui/react";

export default function ProductItem({ product, warehouse }: any) {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between gap-4  p-2 px-4">
        <div className="grow-0 shrink-0 basis-[90px]">
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
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="grow-0 shrink-0 basis-[250px]">
              <div className="line-clamp-2 font-bold">
                {product?.productTitle}
              </div>
              <div className="text-gray-500 text-sm">
                {product?.sku?.propName_valueName}
              </div>
              <div className="text-gray-500">{product?.remark}</div>
            </div>
            <div className="flex gap-4 grow-0 shrink-0 basis-[120px]">
              <p>x{warehouse.quantity}</p>
            </div>
            <div className="flex gap-4 grow-0 shrink-0 basis-[120px]">
              <p>{warehouse.weight}g</p>
            </div>
            <div className="grow-0 shrink-0 basis-[120px]">
              <p>
                {warehouse.length}*{warehouse.width}*{warehouse.height}cm
              </p>
            </div>

            <div className="grow-0 shrink-0 basis-[80px] text-[#f0700c] font-bold">
              {warehouse.status}
            </div>
            <div className="grow-0 shrink-0 basis-[80px] flex flex-col  gap-2 ">
              <Button className="button-default " radius="lg" size="sm">
                <p>申请退款</p>
                <p>111:12:12</p>
              </Button>
            </div>
          </div>
          <div className="flex  gap-2  justify-center flex-col py-2">
            {product?.orderServiceList?.map((service: any) => (
              <div key={service?.serviceId} className="flex gap-2">
                <div className="text-[#acacac] text-sm">
                  {service?.serviceName}
                </div>
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
                          height={40}
                          src={item?.fileUrl}
                          width={40}
                        />
                      );
                    })}
                  </Image.PreviewGroup>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
