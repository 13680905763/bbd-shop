import { useTranslations } from "next-intl";

export function BeginnerGuide() {
  const t = useTranslations("help.daigouGuide.beginnerGuide");

  return (
    <div className="space-y-6 text-gray-700 leading-relaxed">
      {/* 标题 */}
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>

      {/* 9 个步骤自动渲染 */}
      {Array.from({ length: 9 }).map((_, index) => {
        const stepKey = `${index + 1}`; // "1"~"9"
        const title = t(`steps.${stepKey}.title`);
        const contents = t.raw(`steps.${stepKey}.content`) as string[];

        return (
          <div key={stepKey} className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

            {contents.map((line, i) => (
              <p
                key={i}
                className={
                  line.startsWith("提示") ? "text-sm text-gray-500" : ""
                }
              >
                {line}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function ServiceFee() {
  const t = useTranslations("help.daigouGuide.serviceFee");

  return (
    <div className="space-y-4 text-gray-700 leading-relaxed">
      {/* 标题 */}
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>

      {/* section 1 */}
      <p className="font-semibold">🛒 {t("sections.0.title")}</p>

      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>✅</strong> {t("sections.0.list.0")}
        </li>
        <li>
          <strong>💼</strong> {t("sections.0.list.1")}
        </li>
      </ul>

      {/* section 2 */}
      <p className="font-semibold">💰 {t("sections.1.title")}</p>

      <p>{t("sections.1.content")}</p>

      <ul className="list-disc pl-6 space-y-2">
        <li>📦 {t("sections.1.details.0")}</li>
        <li>✈️ {t("sections.1.details.1")}</li>
      </ul>
    </div>
  );
}

export function ReturnRefund() {
  return (
    <div className="space-y-4 text-gray-700 leading-relaxed">
      <h1 className="text-2xl font-bold text-gray-900">
        bbdbuy「5天退/换货」服务说明
      </h1>

      <h2 className="text-xl font-semibold mt-4">
        一、什么是 5 天退/换货保证？
      </h2>
      <p>
        5 天退/换货服务是部分第三方平台卖家提供的售后保障。用户在产品签收 7
        天内（即产品入库后 5 天内）可根据规则申请退货或换货。
      </p>

      <h2 className="text-xl font-semibold mt-4">
        二、产品是否符合退/换货保证？
      </h2>
      <p>✅ 符合条件的商品：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>卖家支持退货服务</li>
        <li>商品处于可销售状态</li>
        <li>商品入库不超过 5 天</li>
        <li>退货运费由用户承担（即使原订单包邮）</li>
      </ul>

      <p>❌ 不符合条件的商品示例：</p>
      <table className="table-auto border border-gray-300 text-sm w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">类型</th>
            <th className="border px-2 py-1">说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">定制商品</td>
            <td className="border px-2 py-1">如定制衣物，须与卖家协商</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">去除标签/配件</td>
            <td className="border px-2 py-1">如已剪吊牌衣物、缺少原包装</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">二手商品</td>
            <td className="border px-2 py-1">全部不支持退换</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">海外商品</td>
            <td className="border px-2 py-1">非中国大陆采购商品不支持</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">内衣类</td>
            <td className="border px-2 py-1">包含内衣、袜子、打底裤</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">成人用品</td>
            <td className="border px-2 py-1">不可退换</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">食品与大宗书籍</td>
            <td className="border px-2 py-1">如饼干、糖果、15 本以上书籍等</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">打开包装的商品</td>
            <td className="border px-2 py-1">须满足“特殊标准”要求</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-4">三、如何申请退/换货？</h2>
      <p>
        在订单状态变为“已入库”后 5 天（120
        小时）内，通过页面申请。超过期限将无法受理。
      </p>

      <h2 className="text-xl font-semibold mt-4">四、退/换货费用说明</h2>
      <table className="table-auto border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">服务类型</th>
            <th className="border px-2 py-1">收费组成</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">无条件退货</td>
            <td className="border px-2 py-1">
              卖家首次发货运费 + 仓库退货运费 + 5 元服务费
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-1">无条件换货</td>
            <td className="border px-2 py-1">
              卖家首次发货运费 + 仓库退货运费 + 卖家重新发货运费 + 5 元服务费
            </td>
          </tr>
        </tbody>
      </table>
      <p>📌 即使商品原订单包邮，退货仍需补回首次发货运费。</p>

      <h2 className="text-xl font-semibold mt-4">五、责任方与费用承担</h2>
      <table className="table-auto border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">责任方</th>
            <th className="border px-2 py-1">示例</th>
            <th className="border px-2 py-1">谁承担费用</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">顾客</td>
            <td className="border px-2 py-1">不想要/买错/预算问题</td>
            <td className="border px-2 py-1">顾客承担来回运费 + 服务费</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">卖家</td>
            <td className="border px-2 py-1">发错货、产品有质量问题</td>
            <td className="border px-2 py-1">卖家承担费用（特殊情况除外）</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">其他</td>
            <td className="border px-2 py-1">国内运输破损等</td>
            <td className="border px-2 py-1">视具体情况协商处理</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-4">六、注意事项和常见问题解答</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>退/换货总金额以您实际支付的产品价格为准。</li>
        <li>只有在卖家同意的情况下，我们才能为您办理退/换货。</li>
        <li>申请后，请确保账户余额充足，支付退货运费及服务费。</li>
        <li>部分商品有特殊退货包装要求（见上表），不符合将无法退换。</li>
      </ul>
    </div>
  );
}
