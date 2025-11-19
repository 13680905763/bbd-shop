"use client";
import { Image } from "antd";
import { Checkbox } from "@heroui/react";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";
import SourceIcon from "@/components/common/source-icon";

type ProductItemProps = {
  product: any;
  warehouse: any;
  texts: {
    quantity: string;
    weight: string;
    dimensions: string;
    status: string;
    refundRequest: string;
  };
};

function ProductItem({ product, warehouse, texts }: ProductItemProps) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex-[0_0_90px]">
          <Image
            alt="Product"
            height={90}
            referrerPolicy="no-referrer"
            src={product?.skuPicUrl || product?.picUrl}
            width={90}
          />
        </div>

        <div className="flex-[0_0_250px]">
          <div className="line-clamp-2 font-bold">{product?.productTitle}</div>
          <div className="text-gray-500 text-sm">
            {product?.sku?.propName_valueName}
          </div>
          <div className="text-gray-500">{product?.remark}</div>
        </div>

        <div className="flex gap-4 flex-[0_0_120px]">
          <p>x{warehouse.quantity}</p>
        </div>
        <div className="flex gap-4 flex-[0_0_120px]">
          <p>{warehouse.weight}g</p>
        </div>
        <div className="flex-[0_0_120px]">
          <p>
            {warehouse.length}*{warehouse.width}*{warehouse.height}cm
          </p>
        </div>

        <div className="flex-[0_0_80px] text-[#f0700c] font-bold">
          {warehouse.status}
        </div>

        {/* <div className="flex-[0_0_80px] flex flex-col gap-2">
          <Button className="button-default" radius="lg" size="sm">
            <p>{texts.refundRequest}</p>
            <p>111:12:12</p>
          </Button>
        </div> */}
      </div>

      <div className="flex gap-2 justify-center flex-col py-2">
        {product?.orderServiceList?.map((service: any) => (
          <div key={service.id} className="mb-4 flex gap-2">
            <div className="text-[#acacac] text-sm mb-2">
              {service.serviceName}
            </div>
            <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
          </div>
        ))}
      </div>
    </div>
  );
}

type WarehouseItemProps = {
  warehouse: any;
  activeTab: string;
  onChange: (e: any) => void;
  selected: boolean;
  texts: any;
};

export default function WarehouseItem({
  warehouse,
  activeTab,
  onChange,
  selected,
  texts,
}: WarehouseItemProps) {
  return (
    <div className="card-cart mb-4  bg-white  ">
      <div className="p-4 flex items-center gap-1 ">
        {activeTab === "submit" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}

        <SourceIcon source={warehouse?.orderProduct?.source} />
        <div className="text-sm font-extrabold">
          {texts.orderNumber} {warehouse?.orderCode}
        </div>
        <div className="text-[#acacac] text-sm">
          {texts.createTime} {warehouse?.createTime}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4 pt-0">
        <ProductItem
          product={warehouse?.orderProduct}
          texts={texts}
          warehouse={warehouse}
        />
      </div>
    </div>
  );
}
