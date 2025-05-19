import { Button, Divider, Image } from "@heroui/react";

import { priceFont } from "./primitives";

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
    <div className=" bg-[#fff] rounded-md  w-full border border-[#ccc] ">
      <div className="p-2">
        创建时间: {createdAt}　订单号: {orderId}
      </div>
      <Divider />
      <div className="flex flex-col gap-4 p-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center  gap-4 justify-center">
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
            </div>

            <div className="text-sm text-gray-600 flex-1 text-center">
              x {item.quantity}
            </div>
            <div className="flex  gap-2 flex-1 justify-center flex-col">
              <Button className="button-white" size="sm">
                留言
              </Button>
              <Button className="button-white" size="sm">
                精细拍照
              </Button>
            </div>
            <div className=" flex-1 text-center">
              <div>{status}</div>
            </div>

            <div className="flex-1">
              <div className="text-money-lg">总计: ${item.totalPrice}</div>
              <div
                className={priceFont({
                  color: "black",
                  size: "sm",
                  weight: "normal",
                })}
              >
                单价: $ 99
              </div>
              <div className="text-light-gray">国内运费 66</div>
            </div>

            <div className="flex  gap-2 flex-1 justify-center flex-col">
              <Button className="button-default">取消</Button>
              <Button color="primary">支付</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCard;
