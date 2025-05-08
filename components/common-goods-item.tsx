import { Button, Divider, Image } from "@heroui/react";

import { lightFont, priceFont } from "./primitives";

// 单个商品项类型
interface OrderItem {
  imageUrl: string;
  title: string;
  specs?: string;
  remark?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  domesticShipping: number;
}

// 组件 props 类型
interface OrderCardProps {
  orderId: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  onPay?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
}
const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  createdAt,
  status,
  items,
  onPay,
  onCancel,
}) => {
  return (
    <div className="bg-[#f5f5f5] rounded-xl p-4 my-4 w-full">
      <div className="text-sm text-gray-700">
        创建时间: {createdAt}　订单号: {orderId}
      </div>
      <Divider className="my-4" />
      {items.map((item, index) => (
        <div
          key={index}
          className="flex  items-center py-2 gap-4 justify-center"
        >
          <Image
            alt="Product"
            className=" object-cover rounded flex-1"
            height={100}
            src={item.imageUrl}
            width={100}
          />

          <div className="flex-[2]">
            <div className="line-clamp-2 text-base font-medium">
              {item.title}
            </div>
            <div className="text-sm text-gray-500">{item.specs}</div>
            {item.remark && (
              <div className="text-sm text-gray-400">{item.remark}</div>
            )}
          </div>

          <div className="text-sm text-gray-600 flex-1 text-center">
            x {item.quantity}
          </div>

          <div className="text-sm font-semibold text-[#f0700c] flex-1">
            {status}
          </div>

          <div className=" text-sm text-gray-700 flex-1">
            <div className={priceFont()}>总计: ${item.totalPrice}</div>
            <div
              className={priceFont({
                color: "black",
                size: "sm",
                weight: "normal",
              })}
            >
              单价: ${item.unitPrice}
            </div>
            <div className={lightFont({ size: "sm" })}>
              国内运费 {item.domesticShipping.toFixed(2)}
            </div>
          </div>

          <div className="flex  gap-2 flex-[2] justify-center">
            <Button className="bg-[#f0700c] text-white">支付</Button>
            <Button>取消</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderCard;
