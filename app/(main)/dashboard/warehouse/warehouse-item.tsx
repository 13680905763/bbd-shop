import { Checkbox } from "@heroui/react";

import ProductItem from "./product-item";

import SourceIcon from "@/components/common/source-icon";

export default function WarehouseItem({
  warehouse,
  activeTab,
  onChange,
  selected,
}: any) {
  return (
    <div className="card-cart ">
      <div className="p-4 flex items-center gap-1 ">
        {activeTab === "submit" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}

        <SourceIcon source={warehouse?.orderProduct?.source} />
        <div className=" text-sm font-extrabold">
          订单号：{warehouse?.orderCode}
        </div>
        <div className="text-[#acacac] text-sm">
          创建时间：{warehouse?.createTime}
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col flex-[4]">
          <ProductItem
            product={warehouse?.orderProduct}
            warehouse={warehouse}
          />
        </div>
      </div>
    </div>
  );
}
