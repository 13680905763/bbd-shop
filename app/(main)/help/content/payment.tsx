// ========================================
// File: recharge.tsx
// ========================================
export function Recharge() {
  return (
    <div className="space-y-3 leading-7 text-gray-600">
      <h1 className="text-2xl font-bold text-gray-900">
        bbdbuy 支持哪些充值方式？
      </h1>

      <p>登录账户，点击【个人中心】 – 【充值】，如下图所示：</p>

      <p className="italic text-gray-500">（此处可放充值页面截图）</p>

      <h2 className="text-xl font-semibold text-gray-900">
        充值及国际信用卡充值
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          信用卡充值支持全球范围多种国际卡（VISA、Master、Discover）及部分国家信用卡；
        </li>
        <li>全球范围内的用户均可使用信用卡充值，方便跨国用户交易和消费；</li>
        <li>
          使用信用卡支付安全可靠，平台采用先进加密技术保障支付信息和资金安全；
        </li>
        <li>正常情况下，实时到账；特殊情况下，需要 1–5 个工作日到账。</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900">本地支付</h2>
      <p>
        我们的平台还支持多种本地支付方式，包括 Apple Pay、Google
        Pay、iDEAL、PayU、BLiK、
        Skrill、Trustly、Bancomatpay、Bancontact、EPS、Pix 等。
      </p>
    </div>
  );
}

// ========================================
// File: international-credit-card.tsx
// ========================================
export function InternationalCreditCard() {
  return (
    <div className="space-y-3 leading-7 text-gray-600">
      <h1 className="text-2xl font-bold text-gray-900">国际信用卡充值</h1>

      <p>登录账户，点击【个人中心】 – 【充值】，选择“国际信用卡”支付方式。</p>

      <ul className="list-disc pl-6 space-y-2">
        <li>输入信用卡信息：卡号、有效期、安全码及持卡人信息。</li>
        <li>确认充值金额并提交支付。</li>
      </ul>

      <p>充值到账时间通常为实时，但特殊情况需要 1–5 个工作日。</p>
      <p>如遇到账问题，请联系客服协助处理。</p>
    </div>
  );
}

// ========================================
// File: wire-transfer.tsx
// ========================================
export function WireTransfer() {
  return (
    <div className="space-y-3 leading-7 text-gray-600">
      <h1 className="text-2xl font-bold text-gray-900">电汇充值</h1>

      <p>操作步骤：</p>

      <ol className="list-decimal pl-6 space-y-2">
        <li>登录账户，点击【个人中心】 – 【充值】。</li>
        <li>输入要充值的金额并点击【确认】（充值金额需大于商品金额）。</li>
        <li>选择电汇渠道并点击【下单结算】。</li>
      </ol>

      <p>
        银行处理通常需要一定时间，正常情况下 3 个工作日内，充值金额会到账至
        bbdbuy 余额。
      </p>

      <p>
        如需提现，请在【个人中心】找到充值源渠道，输入支付密码，财务将在 1–5
        个工作日内处理。 若未到账，请联系在线客服核实。
      </p>
    </div>
  );
}
