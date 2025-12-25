import { Card, CardBody, Checkbox, Image, Textarea } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";

export default function RefundModal({ order, onSubmit, onCancel }: any) {
  const t = useTranslations("Dashboard.OrderPage");
  const { currency } = useGlobalStore();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (order?.products) {
      setProducts(order.products);
    }
  }, [order]);

  const updateProduct = (index: number, patch: Partial<any>) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    );
  };

  return (
    <CommonModal
      isOpen={!!order}
      title={t("refundTitle")}
      onConfirm={() => onSubmit(products)}
      onOpenChange={onCancel}
    >
      <div className="space-y-3">
        {products.map((product: any, index: number) => (
          <Card
            key={index}
            className={`border rounded-lg shadow-sm transition-all duration-150 ${
              product.selected
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white"
            }`}
            isPressable={false}
          >
            <CardBody className="flex flex-col p-4 gap-3">
              {/* 第一行：商品选择 + 基本信息 + 数量/价格 */}
              <div className="flex gap-3">
                {/* 左：选择框 */}
                <Checkbox
                  className="mt-1"
                  isDisabled={product.isRefunded || product.canRefundQty === 0}
                  isSelected={product.selected || false}
                  size="sm"
                  onValueChange={(checked) =>
                    updateProduct(index, { selected: checked })
                  }
                />

                {/* 商品图片 */}
                <div className="w-[70px] h-[70px] flex-shrink-0">
                  <Image
                    alt={product.productTitle}
                    className="w-full h-full object-cover rounded-md"
                    height={70}
                    src={
                      product.skuPicUrl || product.picUrl || "/placeholder.png"
                    }
                    width={70}
                  />
                </div>

                {/* 商品基本信息 */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium text-gray-900 text-sm line-clamp-2">
                    {product.productTitle}
                  </span>
                  <span className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                    {product?.propAndValue?.propName_valueName || "-"}
                  </span>

                  {product.canRefundQty === 0 && (
                    <span className="text-red-400 text-xs mt-0.5">
                      {t("unrefundable")}
                    </span>
                  )}
                </div>

                {/* 价格 + 数量输入 */}
                <div className="flex flex-col items-end justify-center gap-1">
                  <span className="text-gray-900 font-semibold text-sm">
                    {currency.symbol}
                    {product.price}
                  </span>
                  <span className="text-gray-500 text-xs">
                    x{product.purchaseQuantity}
                  </span>

                  <div className="flex items-center gap-1 mt-1">
                    <input
                      className="w-16 px-2 py-1 border rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                      disabled={
                        !product.selected ||
                        product.isRefunded ||
                        product.canRefundQty === 0
                      }
                      max={product.canRefundQty}
                      min={1}
                      type="number"
                      value={product.refundQuantity}
                      onChange={(e) =>
                        updateProduct(index, {
                          refundQuantity: Number(e.target.value),
                        })
                      }
                    />
                    <span className="text-gray-400 text-xs">
                      {t("refundable")} {product.canRefundQty}
                    </span>
                  </div>
                </div>
              </div>

              {/* 第二行：备注输入框 */}
              <div className="">
                <Textarea
                  classNames={{
                    inputWrapper:
                      "bg-white border border-gray-300 rounded-md shadow-none " +
                      "focus-within:bg-white focus-within:border-primary " +
                      "focus-within:ring-1 focus-within:ring-primary transition-colors",
                    input: "text-sm text-gray-800 placeholder:text-gray-400",
                  }}
                  minRows={2}
                  placeholder={t("remarkPlaceholder")}
                  value={product.remark || ""}
                  onChange={(e) =>
                    updateProduct(index, { remark: e.target.value })
                  }
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </CommonModal>
  );
}
