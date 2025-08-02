import ProductItem from "./product-item";

import SourceIcon from "@/components/common/source-icon";

export default function WarehouseItem({ warehouse }: any) {
  return (
    <div className="card-cart ">
      <div className="p-4 flex items-center gap-1 ">
        <SourceIcon source={warehouse?.orderProduct?.source} />
        <div className=" text-sm font-extrabold">
          订单号：{warehouse?.orderCode}
        </div>
        <div className="text-[#acacac] text-sm">
          创建时间：{warehouse?.createTime}
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col   flex-[4]">
          <ProductItem
            product={warehouse?.orderProduct}
            warehouse={warehouse}
          />
        </div>

        {/* <div className="grow-0 shrink-0 basis-[180px] flex flex-col pt-4 gap-2 px-10">
          <Button className="button-default" radius="none" size="sm">
            申请退款
          </Button>
          <Button
            color="primary"
            isDisabled={warehouse?.status !== "可出库"}
            radius="none"
            size="sm"
          >
            提交包裹
          </Button>
        </div> */}
      </div>
    </div>
  );
}
