export function StoragePeriod() {
  return (
    <div className="space-y-4 leading-relaxed text-gray-700">
      <h1 className="text-2xl font-bold text-gray-900">
        货物在 bbdbuy 仓库可以存放多久？
      </h1>

      <p>
        bbdbuy 仓库中商品最多可存储 <b>90 天</b>
        （标准存储期），从订单状态变为“已入库”当天开始计算。
      </p>

      <p>
        若存储期达到 <b>90–180 天</b> 之间，系统会自动提供 <b>28 天宽限期</b>{" "}
        用于延长存储。 如超出宽限期仍未处理，订单将被视为放弃。
      </p>

      <p>
        如果您在 <b>90 天内未提交发货</b> 或 <b>未支付延长存储费用</b>
        ，商品将视为放弃。
      </p>

      <p>
        <b>最长存储时限为 180 天。</b>
        <br />
        超过此期限 bbdbuy 将不再提供任何仓储或存储服务，商品将自动视为放弃处理。
      </p>

      <p className="text-red-500 font-medium">
        注意：bbdbuy 保留定期清理放弃商品的权利。
      </p>
    </div>
  );
} // src/content/after-sale/after-sale-policy.tsx

export function AfterSalePolicy() {
  return (
    <div className="space-y-4 leading-relaxed text-gray-700">
      <h1 className="text-2xl font-bold text-gray-900">售后政策说明</h1>

      <p>bbdbuy 为保障用户权益，提供标准售后处理流程，如下：</p>

      <p>这里有个表格</p>
    </div>
  );
}
// src/content/after-sale/insurance-compensation.tsx

export function InsuranceCompensation() {
  return (
    <div className="space-y-4 leading-relaxed text-gray-700">
      <h1 className="text-2xl font-bold text-gray-900">
        保价包裹 / 免费保险赔偿标准
      </h1>

      <p>
        购买 bbdbuy Care Service
        的保价包裹，以及未购买的免费保险，赔付标准如下：
      </p>

      <p>这里有个表格</p>

      <p className="text-gray-600 text-sm">
        * 最终赔偿以物流公司与 bbdbuy 的理赔标准为准。
      </p>
    </div>
  );
}
