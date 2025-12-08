// File: src/content/delivery/shipping-restrictions.tsx
export function ShippingRestrictions() {
  return (
    <div className="space-y-3 leading-7 text-gray-600">
      <h1 className="text-2xl font-bold text-gray-900">邮寄限制</h1>

      <h2 className="text-lg font-semibold text-gray-800">
        一、提交包裹寄送时，为什么配送方式里有的线路无法选择？
      </h2>
      <p>
        国际物流运输中，对相关物品类型有严格限制，当您订购的货品状态到达【仓库】之后，有邮寄限制的货品或部分地区无法到达的情况，我们会用【禁用原因】加以说明。
      </p>
      <p className="italic text-gray-500">
        温馨提示：了解商品特性及运输的邮寄限制后，可联系在线客服核实是否可以解除邮限，但解除邮限后需自行承担海关风险。
      </p>

      <h2 className="text-lg font-semibold text-gray-800">
        二、为什么已入库的商品不能一起提交寄送？
      </h2>
      <p>
        如果仓库中的部分商品涉及邮限，在提交全部商品的包裹运单时也会一并被限制。
      </p>

      <h2 className="text-lg font-semibold text-gray-800">
        三、小容量液体、药品等要与其它商品混寄才好，限定几件呢？
      </h2>
      <p>此类商品建议尽量不要占包裹所有商品的10%以上。</p>

      <h2 className="text-lg font-semibold text-gray-800">
        四、为什么有的物品需要单独寄送？
      </h2>
      <p>
        出于合理包装或减少包裹体积重量的考虑，如果单边长度大于或等于70CM，则需要单独打包。各物流路线尺寸限制详情，请点击链接查看。
      </p>

      <h2 className="text-lg font-semibold text-gray-800">
        五、集中包裹运送有哪些好处？
      </h2>
      <p>
        如果将代购的多件商品合并邮寄，我们提供专业包装支持，相比单独邮寄可节省国际运费。
      </p>
      <p>以 EMS 特快专递邮寄新加坡为例：</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>首重500g：115元，续重33元/500g，报关费8元</li>
        <li>3个包裹重量分别为：700g、1100g、1600g</li>
      </ul>
      <p>单独寄送运费总计：568元</p>
      <p>集中寄送运费总计：321元</p>
      <p>可节省：247元（568-321）</p>
      <p>以转运方式使用【费用估算】计算运费更直观。</p>

      <h2 className="text-lg font-semibold text-gray-800">
        六、对仿牌、违禁品、液体、膏体、食品、DVD光碟、药品寄送有什么限定？
      </h2>
      <p>根据常规运输经验，以下货物受限制：</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>烟、酒、药、违禁品不承运</li>
        <li>食品、液体、颗粒、膏状货物需提供非危品鉴定</li>
        <li>
          少量敏感货物可夹杂普通商品，例如化妆品单瓶≤100ml，单个包裹≤200ml
        </li>
      </ul>
      <p>
        查看包裹寄送具体限制条件，请访问：
        <a
          className="text-blue-600 underline"
          href="https://bbdbuy.com/estimation"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://bbdbuy.com/estimation
        </a>
      </p>
      <p>如有疑问，请及时联系在线客服。</p>
    </div>
  );
}

// File: src/content/delivery/customs-taxes.tsx
export function CustomsAndTaxes() {
  return (
    <div className="space-y-3 leading-7 text-gray-600">
      <h1 className="text-2xl font-bold text-gray-900">海关与税收</h1>

      <p>
        一般来说（除欧盟国家外），当您的包裹申报价值低于该国关税起征点时，一般不会被征税（但欺诈申报情况另当别论）。如果包裹被征税，您需要及时缴税并协助清关。
      </p>

      <h2 className="text-lg font-semibold text-gray-800">
        各国关税起征点参考
      </h2>
      <p>提示：</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          瑞士：关税起征点 100 瑞士法郎，VAT（增值税）起征点 65 瑞士法郎。
        </li>
        <li>
          加拿大、欧洲海关对包裹检查严格，商业快递如 DHL、UPS、FedEx
          更容易被征收关税。
        </li>
      </ul>

      <h2 className="text-lg font-semibold text-gray-800">包裹提交提示</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          包裹重量是判断民用包裹还是商业包裹的重要依据，10
          公斤及以上的包裹更可能被视为商业包裹。
        </li>
        <li>
          同种产品数量过多也可能被判定为商业包裹，建议避免在一个包裹中寄送大量相同产品。
        </li>
        <li>寄送药品请谨慎考虑，遵守海关政策。</li>
      </ul>

      <p className="italic text-gray-500">
        以上信息来源于互联网收集整理，仅供参考，不作为标准指导。
      </p>

      <h2 className="text-lg font-semibold text-gray-800">报关须知</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>非免税/不支持 IOSS 代理服务航线的清关费用由用户承担。</li>
        <li>
          海关对包裹基本抽查。如果包裹特殊（尺寸大、重量重或含敏感物品），海关一般会联系收件人提供发票或清关文件，清关费用由收件人承担。未能联系收件人或收件人不配合清关导致退回或销毁的费用由收件人承担。
        </li>
        <li>如需清关发票，可自行在 bbdbuy 下载或联系在线客服索取。</li>
      </ul>
    </div>
  );
}
