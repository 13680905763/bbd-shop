"use client";
import { Checkbox, CheckboxGroup, Image, Tooltip } from "@heroui/react";

import { useServicesStore } from "@/store";

export default function ProductItem({
  product,
  updateServiceList,
  checkboxGroupData,
  setCheckboxGroupData,
}: any) {
  const services = useServicesStore((state) => state.services);

  console.log("services", services);

  return (
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

      <div className="flex grow-0 shrink-0 basis-[200px] ">
        <p className=" max-w-44   truncate ">
          备注：
          <span className="text-gray-500 ">
            {product?.remark ?? "暂无备注"}
          </span>
        </p>
      </div>
      <div className="flex  gap-2   flex-col  grow-0 shrink-0 basis-[150px]">
        <CheckboxGroup
          defaultValue={checkboxGroupData}
          onChange={(v) => {
            setCheckboxGroupData(v);
            updateServiceList(
              product.cartId,
              v.map((id) => {
                return {
                  serviceId: id,
                  remark: "",
                };
              }),
            );
          }}
        >
          {services?.map((service: any) => (
            <Tooltip
              key={service?.id}
              className="bg-[#262626] text-white p-2 max-w-screen-sm"
              content={service?.introduction}
              placement="right"
            >
              <Checkbox isDisabled={service?.id == 1} value={service?.id}>
                {service?.serviceName}￥{service?.price}
              </Checkbox>
            </Tooltip>
          ))}
        </CheckboxGroup>
      </div>
      <div className="flex grow-0 shrink-0 basis-[100px]">
        <p>{product.price}</p>
      </div>
      <div className="flex grow-0 shrink-0 basis-[100px]">
        <p>x{product.quantity}</p>
      </div>
    </div>
  );
}
