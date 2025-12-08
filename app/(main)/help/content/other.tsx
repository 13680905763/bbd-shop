export function AboutBBDBuy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 font-sans text-gray-700 bg-white">
      {/* 头部标题 */}
      <header className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          关于 bbdbuy 及服务介绍
        </h1>
        <p className="text-lg text-gray-500">
          您的全球代购专家，助您无忧购买中国商品。
        </p>
        {/* 主色调应用 1: 标题装饰线 (使用 orange-600 替代 blue-500) */}
        <div className="w-16 h-1 bg-orange-600 mx-auto mt-6 rounded-full" />
      </header>

      {/* 第一部分：关于 bbdbuy (公司简介) */}
      <section className="mb-12 border-b pb-8 border-gray-100">
        {/* 主色调应用 2: 章节编号 (使用 text-orange-600 替代 text-blue-500) */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
          <span className="text-orange-600">一.</span> 关于 bbdbuy
        </h2>
        {/* 主色调应用 3: 背景和边框 (使用 orange-50/200 替代 blue-50/200) */}
        <div className="bg-orange-50 p-6 rounded-lg text-sm md:text-base leading-relaxed border border-orange-200">
          {/* 主色调应用 4: 强调文字颜色 (使用 text-orange-800 替代 text-blue-800) */}
          <p className="text-orange-800 font-medium">
            bbdbuy 是一家帮助海外用户在中国购买商品的跨境代购公司；
            我们为全球用户提供中国商品的采购、履单、质检、国际物流
            （国际寄送服务由第三方服务公司提供）到售后的一站式全流程电商服务；
            帮助全球用户无忧购买中国商品。
          </p>
        </div>
      </section>

      {/* 第二部分：bbdbuy 的好处 (核心优势卡片) - 保持区分色，但可调整色系饱和度 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-orange-600">二.</span> 使用 bbdbuy 的好处
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 优势 1: 工厂源头好物 - 保持绿色系以代表“优质/源头” */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-green-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              工厂源头好物
            </h3>
            <p className="text-sm text-gray-600">
              bbdbuy 为您推荐极具性价比的工厂源头好物；
            </p>
          </div>

          {/* 优势 2: 免费仓库保管 - 保持黄色系以代表“时间/储存” */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-amber-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              90 天免费仓储
            </h3>
            <p className="text-sm text-gray-600">
              bbdbuy 为您提供 90 天的免费仓库保管；
            </p>
          </div>

          {/* 优势 3: 质量问题无忧退 - 保持红色系以代表“保障/警示” */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-red-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c.045 4.148 1.481 8.033 4.016 11.056A11.955 11.955 0 0112 21.056c4.148 0 8.033-1.481 11.056-4.016 2.535-3.023 4.016-6.908 4.016-11.056 0-3.184-1.127-6.22-3.04-8.618z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">质量无忧退</h3>
            <p className="text-sm text-gray-600">
              bbdbuy 对商品质量全面护航，质量问题，无忧退；
            </p>
          </div>
        </div>
      </section>

      {/* 第三部分：如何找到想购买的商品 (流程步骤) */}
      <section className="mb-12 border-t pt-8 border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-orange-600">三.</span> 如何找到想购买的商品
        </h2>

        <ol className="list-none space-y-4 pl-0">
          <li className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* 主色调应用 5: 步骤编号背景 (使用 bg-orange-600 替代 bg-blue-500) */}
            <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
              1
            </span>
            <div>
              <p className="font-semibold text-gray-900">中国电商平台：</p>
              <p className="text-gray-600">
                中国的电商平台，例如淘宝、天猫、1688、京东、拼多多、唯品会等；
              </p>
            </div>
          </li>
          <li className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
              2
            </span>
            <div>
              <p className="font-semibold text-gray-900">社交媒体获取：</p>
              <p className="text-gray-600">通过社交媒体了解中国商家或商品；</p>
            </div>
          </li>
          <li className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
              3
            </span>
            <div>
              <p className="font-semibold text-gray-900">委托 bbdbuy 寻找：</p>
              <p className="text-gray-600">委托 bbdbuy 寻找优质商家；</p>
            </div>
          </li>
        </ol>
      </section>

      {/* 第四部分：支付问题 (问答框) */}
      <section className="mb-12 border-t pt-8 border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-orange-600">四.</span>{" "}
          我无法在中国电商平台支付怎么办？
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200">
          <div className="flex items-center mb-3">
            <svg
              className="h-6 w-6 text-red-500 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3 .895-3 2 .1 2 3-2v4a3 3 0 003-3v-4c0-1.105-.343-2-2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 14c1.657 0 3 .895 3 2s-1.343 2-3 2-3 .895-3 2 .1 2 3-2v4a3 3 0 003-3v-4c0-1.105-.343-2-2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-lg font-semibold text-gray-900">解决方案：</p>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            您可以通过 bbdbuy
            下单，我们将代采您的商品并在您指定的商家购买，过程全程透明。
          </p>
        </div>
      </section>

      {/* 第五部分：国际寄送 (流程步骤) */}
      <section className="mb-12 border-t pt-8 border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-orange-600">五.</span> 如何寄送到我所在的国家？
        </h2>

        <ol className="list-none space-y-6">
          <li className="flex items-start gap-4 p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            {/* 步骤数字使用主色调 (保持 orange-500，与主色系一致) */}
            <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
              1
            </span>
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                采购、质检与保留
              </p>
              <p className="text-gray-600 text-sm">
                bbdbuy 采购后，商品将送至 bbdbuy
                仓库，并为您检查商品质量。根据您的反馈，我们会为您进行商品保留或退货，避免直邮带来的售后困难。
              </p>
            </div>
          </li>
          <li className="flex items-start gap-4 p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </span>
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                免费仓储与国际寄送
              </p>
              <p className="text-gray-600 text-sm">
                您可以在仓库免费存放 90
                天，并随时申请寄送服务，我们可寄送至任何国家。
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* 底部 CTA */}
      <footer className="text-center pt-8 mt-8 border-t border-gray-200">
        <p className="text-lg font-medium text-gray-800">
          立即开始您的中国商品采购之旅！
        </p>
        {/* 主色调应用 6: CTA 按钮 (使用 bg-orange-600/700 替代 blue-600/700) */}
        <a
          className="mt-4 inline-block px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-orange-600 hover:bg-orange-700 transition duration-150 ease-in-out shadow-lg"
          href="/register"
        >
          立即注册 bbdbuy
        </a>
      </footer>
    </div>
  );
}

export function ContactUs() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 font-sans text-gray-700">
      {/* 头部标题 */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          联系我们
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          有任何问题或合作意向？我们随时为您提供帮助。
        </p>
        {/* 主色调应用 1: 标题装饰线 (bg-blue-600 -> bg-orange-600) */}
        <div className="w-16 h-1 bg-orange-600 mx-auto mt-6 rounded-full" />
      </div>

      {/* 核心联系方式 - 三栏卡片布局 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* 商务合作 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
          {/* 主色调应用 2: 图标背景和颜色 (bg-blue-50/text-blue-600 -> bg-orange-50/text-orange-600) */}
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">商务合作</h3>
          <p className="text-sm text-gray-500 mb-4">业务拓展与战略伙伴关系</p>
          {/* 主色调应用 3: 链接颜色 (text-blue-600/hover:text-blue-800 -> text-orange-600/hover:text-orange-800) */}
          <a
            className="text-orange-600 font-medium hover:text-orange-800 hover:underline transition-colors"
            href="mailto:business@bbdbuy.com"
          >
            business@bbdbuy.com
          </a>
        </div>

        {/* 市场合作 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
          {/* 市场图标保持紫色系，用作区分，但可以调成更暖的紫色（如 rose/fuchsia）或保持原样 */}
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">市场合作</h3>
          <p className="text-sm text-gray-500 mb-4">品牌推广与媒体联络</p>
          {/* 链接颜色跟随主色调 (text-blue-600 -> text-orange-600) */}
          <a
            className="text-orange-600 font-medium hover:text-orange-800 hover:underline transition-colors"
            href="mailto:Markting@bbdbuy.com"
          >
            Markting@bbdbuy.com
          </a>
        </div>

        {/* 客户服务 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
          {/* 客服图标保持绿色系，用作区分 */}
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">客户服务</h3>
          <p className="text-sm text-gray-500 mb-4">订单咨询与技术支持</p>
          {/* 链接颜色跟随主色调 (text-blue-600 -> text-orange-600) */}
          <a
            className="text-orange-600 font-medium hover:text-orange-800 hover:underline transition-colors"
            href="mailto:support@bbdbuy.com"
          >
            support@bbdbuy.com
          </a>
        </div>
      </div>

      {/* 底部公司信息 - 名片风格 */}
      <div className="bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* 左侧：公司基本信息 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              公司信息
            </h3>

            <div className="grid gap-y-2 text-sm md:text-base">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-semibold text-gray-500 w-36">
                  Company Name:
                </span>
                <span className="text-gray-900">bbdbuy technology limited</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <span className="font-semibold text-gray-500 w-36">
                  Company Number:
                </span>
                <span className="text-gray-900">20241522761</span>
              </div>
            </div>
          </div>

          {/* 右侧：地址信息 */}
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm w-full md:w-auto md:min-w-[320px]">
            <div className="flex items-start gap-3">
              {/* 地址图标保持红色系，因为它代表“地图/位置”的经典颜色 */}
              <svg
                className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Company Address
                </h4>
                <address className="not-italic text-gray-600 text-sm leading-relaxed">
                  737N Washington St Unit 306,
                  <br />
                  Denver, CO 80203,
                  <br />
                  United States
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden my-8 border border-gray-100">
      <article className="px-8 py-10 md:px-12 md:py-12 text-gray-700 leading-relaxed">
        {/* 头部信息 */}
        <header className="text-center mb-10 border-b border-gray-100 pb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            bbdbuy用户隐私政策
          </h1>
          <p className="text-sm text-gray-500 font-medium bg-gray-50 inline-block px-3 py-1 rounded-full">
            （修订版）
          </p>
          <p className="text-gray-500 mt-4">生效日期：2024年11月30日</p>
        </header>

        {/* 引言 */}
        <section className="mb-8 text-justify">
          <p className="mb-4">
            为切实保护bbdbuy用户隐私权，优化用户体验，我们根据现行法规及政策，更新本《bbdbuy用户隐私政策（修订版）》，详细说明bbdbuy在获取、管理及保护用户个人信息方面的政策及措施。本隐私政策适用于bbdbuy向您提供的所有服务，无论您是通过计算机设备、移动终端或其他设备获得的bbdbuy服务。
          </p>
          <p>
            对于本隐私政策或相关事宜有任何问题，您可随时通过访问bbdbuy在线客服系统、bbdbuy官方服务账号或拨打我们的客服热线等多种方式与我们联系。
          </p>
        </section>

        {/* 目录卡片 */}
        <div className="bg-orange-50 p-6 rounded-lg mb-10 border border-orange-200">
          <h3 className="font-bold text-orange-900 mb-4 text-lg">
            本用户隐私政策将帮助您了解以下内容：
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-orange-800 font-medium">
            <li>我们会收集您的什么信息？</li>
            <li>我们如何使用您的信息？</li>
            <li>我们与谁共享您的信息？</li>
            <li>我们如何保护您的信息？</li>
            <li>我们会保留您的信息多长时间？</li>
            <li>您如何行使关于您的信息的权利？</li>
            <li>争议解决/如何与我们联系?</li>
            <li>我们会如何通知您有关政策的变更？</li>
          </ol>
        </div>

        {/* 正文内容 */}
        <div className="space-y-10">
          {/* 第1节 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm flex-shrink-0">
                1
              </span>
              我们会收集您的什么信息？
            </h2>
            <p className="mb-4">
              通常情况下，您可以在因特网上访问我公司而无需告诉我们您是谁，也无需提供有关您的任何个人信息。不过，为方便您享用我们的服务，您可以选择在各种情形下向我们提供以下相关信息。
            </p>

            <div className="pl-4 space-y-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">
                  1) 您为我们提供的信息。
                </h3>
                <p>
                  当您注册bbdbuy账户时，我们会保存您提供的基本信息：电子邮件地址和密码。如果您愿意，当您使用我们的服务时，您可以在个人资料中提供更多信息，包括：姓名、性别、照片、生日、联系电话、国家/地区、教育程度和工作经验。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">
                  2) 您执行的操作。
                </h3>
                <p className="mb-2">
                  当您使用我们的服务时，我们会自动收集一些数据以使这些服务能够更好地满足您的需求。此类数据包括：
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 bg-gray-50 p-4 rounded">
                  <li>您搜索的内容</li>
                  <li>您访问的商品/店铺</li>
                  <li>日期、时间标识以及您与客服的通信</li>
                  <li>您观看的视频</li>
                  <li>您点击或点按的广告</li>
                  <li>您的位置信息</li>
                  <li>设备信息</li>
                  <li>IP 地址和 Cookie 数据</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 第2节 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm flex-shrink-0">
                2
              </span>
              我们如何使用您的信息？
            </h2>
            <p className="mb-4">
              我们或我们的合作伙伴使用您的信息来提供和改善服务，向您提供个性化体验的网站或移动端应用程序，其中包括：
            </p>

            <div className="pl-4 space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">
                  1) 就您的帐户联络您
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>
                    与您达成合约，并向您提供我们的服务，遵守我们的法律义务，保护您的重要利益，或按公共利益需要使用，使我们为您服务的范围更为广泛。
                  </li>
                  <li>
                    提供付款处理及帐户管理，营运、量度和改善我们的服务，维持我们服务安全、稳健和可操作。
                  </li>
                  <li>
                    通过电邮、电话、SMS／文字短讯、邮件及流动装置的推送通知联络您，解决帐户问题、处理纠纷、收取费用或欠款，或其他为向您提供客户服务的必要动作。
                  </li>
                  <li>
                    侦测、防止、减少和调查欺诈、安全性漏洞或潜在的禁止或违法活动。
                  </li>
                  <li>
                    执行我们的会员合约、此私隐权通知或其他政策，并为根据我们收集资料时您所要求以所述方式提供其他服务。
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">
                  2)
                  在维持您的权益和自由的同时，我们会使用您的个人资料来追求我们的合法利益。
                </h3>
                <p className="mb-2">
                  我们已推行平衡我们的利益与你的权益之措施，其中包括：
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>
                    改进我们的服务，例如检视与会员遇到的停顿或冲突页面相关的资料，以便我们识别和解决问题并为您提供更好的体验。
                  </li>
                  <li>根据您的广告定制偏好，定制、评估并改善站内广告。</li>
                  <li>
                    根据你的通讯偏好设定提供针对性的行销推广、服务更新和推广优惠。
                  </li>
                  <li>
                    根据适用法律授权，通过电邮或邮件与联络您，以向您提供优惠券、折扣和特别推广活动；通过调查或问卷收取您的意见，并通知您有关我们的服务。
                  </li>
                  <li>
                    通过电邮、电话、SMS／文字短讯、邮件及流动装置的推送通知邀请您成为我们的合作者，参与我公司的项目。
                  </li>
                  <li>
                    就有关您使用我们服务的能力之公共政策事宜或其他时事联络你，当中可能包括邀请您参加请愿、写信、打电话或其他类型的公共政策相关活动。
                  </li>
                  <li>接受您给我们提出的宝贵意见或建议。</li>
                  <li>
                    透过GA/Baidu
                    API量度我们网站和移动端应用程序各级页面的访问量和点击率，或其他推广成效。
                  </li>
                  <li>
                    量度卖家表现（例如使用卖家及运送服务商发出或经bbdbuy提供的运送追踪资料）。
                  </li>
                  <li>监控并提升我们网站和移动端应用程序的资料安全。</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">
                  3) 在您同意的情况下，我们可能使用您的个人资料作以下用途：
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>
                    通过电话、邮件、SMS 或文字讯息向你提供行销推广,
                    包括为您提供优惠券、折扣和特价促销、提供使用我们平台的服务项目的机会、您可能喜欢的物品和服务的网站内容、跟踪观察您的购物车、您的追踪清单、您的收藏集，以及您选择关注的收藏集和卖家等。
                  </li>
                  <li>向您提供来自其他bbdbuy企业成员的行销推广。</li>
                  <li>
                    向您提供来自第三方的行销推广,
                    包括为您提供优惠券、折扣和特价促销、提供使用自第三方的服务项目的机会、您可能喜欢的物品和服务的网站内容等。
                  </li>
                  <li>使用您的敏感个人资料以促进某些类别的交易。</li>
                  <li>您有权随时取消同意。</li>
                  <li>
                    我们可能会使用被视为自动决策或分析的技术。我们不会使用自动决策技术来作出会对您有重大影响的决定，除非该决定是我们和您之间合约的必要部分、我们已取得您的同意、或法律规定我们必须使用该等技术。
                  </li>
                  <li>
                    请注意，除非已获得您的同意，否则我们不会将您的个人资料与任何广告商分享。我们不会在监护人许可之外、不知情和不在场的情况下，向儿童或其他没有自我行为负责能力的人征求个人信息，也不会向他们发出索取个人信息的请求。
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 第3节 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm flex-shrink-0">
                3
              </span>
              我们与谁共享您的信息？
            </h2>
            <p className="mb-4">
              在未取得您同意的情况下，我们不会出售、出租或以其他方式将您的个人资料透露给第三方作其行销推广和广告目的。为保证向您提供运营服务、遵守我们的法律义务、执行会员合约、促进我们的行销和广告活动，防止、侦测、减少和调查与我们服务有关的欺诈或违法活动，我们可能会将您的信息共享给下列各方作以下目的：
            </p>

            <div className="pl-4 space-y-4">
              <div>
                <h3 className="font-bold text-gray-800">
                  1) bbdbuy相关集团公司
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  可能会用这些资料来提供联合内容和服务、协助侦测欺诈、提供个性化广告、改进产品等。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">
                  2) 服务供应商和金融机构合作伙伴
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  包括协助我们提供服务的第三方、支付处理、物流公司（如DHL、SAL、FBA等）。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">
                  3) 执法机构、公安当局或其他司法机构和组织
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  为遵守法律义务、程序或要求；为履行服务条款；为解决安全、欺诈问题等。
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">4) 所有权变更</h3>
                <p className="text-sm text-gray-500 mb-2">
                  如果我们受到其他公司的合并或收购，我们可能会根据我们的私隐政策与他们分享资料。
                </p>
              </div>
            </div>
          </section>

          {/* 第4节 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm flex-shrink-0">
                4
              </span>
              我们如何保护您的信息？
            </h2>
            <p className="mb-4">
              从我们的服务器将能够访问您的个人信息，并且您的个人信息将会在我们的服务器上进行处理。无论个人信息在哪里储存，我们都致力于保护您的个人信息的隐私性和完整性。您的个人信息将受我们的技术和组织控制，并且受到我们的政策与程序（包括本隐私政策）的约束。
            </p>
            <p className="mb-4">
              我公司保障您以实物、电子等方式提供给我们的信息数据的安全和质量。
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-800">
                <strong>注意：</strong>
                一些国家、地区或组织可能未颁布严格的法律、规章来保护您的信息。在这些地区或组织内，我公司将仍然按照本隐私政策所描述的方式处理您的信息。
              </p>
            </div>
          </section>

          {/* 第5节 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm flex-shrink-0">
                5
              </span>
              我们会保留您的信息多长时间？
            </h2>
            <p>
              一旦您成功注册bbdbuy账户，我们将永久保存您的个人信息。如果您有要求，我们也会提前删除您的信息。我们将根据我们的法律义务保留所需的数据。
            </p>
          </section>

          {/* 第6节 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm flex-shrink-0">
                6
              </span>
              您如何行使关于您的信息的权利？
            </h2>
            <p className="mb-4">
              对于我们所持有的关于您的个人信息，您有权访问、修改或删除您的数据，或限制或拒绝让我们处理您的数据：
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold text-gray-800 mb-1">1) 访问和更正</h3>
                <p className="text-sm text-gray-600">
                  您可以登入帐户，即可查看、检视并更新您的大部分个人资料。
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold text-gray-800 mb-1">2) 查询</h3>
                <p className="text-sm text-gray-600">
                  要请求查询是否涉及收费，如适用的国家法律容许，请联络我们。
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold text-gray-800 mb-1">3) 限制和异议</h3>
                <p className="text-sm text-gray-600">
                  在特定情况下，除了储存目的以外，您有权要求我们停止处理我们持有的您的相关个人信息。
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold text-gray-800 mb-1">4) 清除</h3>
                <p className="text-sm text-gray-600">
                  当您提出请求，我们会于合理情况下尽快结束您的帐户并移除其他人可检视您的个人资料。
                </p>
              </div>
            </div>
          </section>

          {/* 第7节 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm flex-shrink-0">
                7
              </span>
              争议解决/如何与我们联系
            </h2>
            <div className="bg-orange-50 p-4 rounded border border-orange-100 inline-block">
              <p className="font-bold text-orange-900">电子邮箱：</p>
              <a
                className="text-orange-600 underline hover:text-orange-800"
                href="mailto:care@bbdbuy.com"
              >
                care@bbdbuy.com
              </a>
            </div>
          </section>

          {/* 第8节 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm flex-shrink-0">
                8
              </span>
              我们会如何通知您有关政策的变更？
            </h2>
            <p>
              如果我们对本政策作出任何重大变更，我们将在此发布经更新的政策，并在bbdbuy网站或移动端应用程序中通知我们的用户。请经常查看此页面，以了解本政策的任何更新或变更。
            </p>
          </section>
        </div>

        <hr className="my-12 border-gray-200" />

        {/* 底部说明 */}
        <footer className="bg-gray-50 p-6 rounded-lg text-sm text-gray-600 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-2 text-base">说明</h3>
          <p className="mb-4">
            您使用bbdbuy网站及移动端应用程序，即表示您接受我们有关您个人信息的规则和政策，并且您明确同意我们按照本政策收集、处理和使用以及存储您的个人信息。
          </p>
          <p className="font-medium text-gray-800">
            您承认您已经阅读并了解本隐私政策。
          </p>
          <p className="mt-2">
            如果您不同意本隐私政策，则您将无法使用本服务。如果您将来改变主意，您可以根据此政策撤回您对使用个人信息的同意。
          </p>
        </footer>
      </article>
    </div>
  );
}

export function Terms() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 font-sans text-gray-700 bg-white">
      {/* 标题区域 */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          bbdbuy用户注册协议
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto rounded" />
      </header>

      {/* 特别提醒区域 - 警示风格 */}
      <section className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 mb-8 rounded-r-lg shadow-sm">
        <h2 className="text-lg font-bold text-amber-800 mb-2">【特别提醒】</h2>
        <p className="text-sm sm:text-base text-amber-900 leading-relaxed">
          请仔细阅读bbdbuy用户注册协议，以确保您了解我们处理您个人信息的规则。如果您对本协议有任何疑问，请联系我们的客服人员。如果您不同意本协议的任何条款，您可以立即停止访问和使用bbdbuy。bbdbuy可能会不时更新本bbdbuy用户注册协议。本协议的更新条款和条件一经发布即取代原始条款和条件。用户可以在bbdbuy平台上查看更新后的条款和条件。本协议条款修改后，如果您不接受修改后的条款，请立即停止使用bbdbuy提供的服务。用户继续使用服务将被视为已接受修改后的协议。
        </p>
      </section>

      {/* 重要提示区域 */}
      <section className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6 mb-10 rounded-r-lg shadow-sm">
        <h2 className="text-lg font-bold text-blue-800 mb-2">【重要】</h2>
        <p className="mb-2 text-blue-900">
          您在点击【同意】注册前，应仔细阅读以下协议。请您仔细阅读并充分理解本协议的条款，包括但不限于：
        </p>
        <ol className="list-decimal list-inside space-y-1 text-blue-900 font-medium">
          <li>责任的例外或限制；</li>
          <li>适用法律和管辖权；</li>
          <li>与业务相关的重要说明和规定。</li>
        </ol>
        <p className="mt-4 text-sm text-blue-800">
          <strong>【特别提醒】</strong>{" "}
          bbdbuy用户注册协议由bbdbuy服务协议、bbdbuy服务条款和bbdbuy用户隐私政策组成。您完成全部注册程序并同意本协议，即表示您已充分阅读、理解并接受本协议的全部条款。如果您与bbdbuy之间因bbdbuy平台服务产生任何争议，该等争议应按照bbdbuy服务协议解决。如果您不同意本协议或其任何条款，您应立即停止注册程序。
        </p>
      </section>

      {/* 目录概览 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-12 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3">
          bbdbuy用户注册协议包括：
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>bbdbuy服务协议</li>
          <li>一、用户的确认和接受</li>
          <li>二、国际物流限制说明</li>
          <li>三、协议更新及用户的维护义务</li>
        </ul>
      </div>

      <div className="border-t border-gray-200 my-8" />

      {/* bbdbuy服务协议正文 */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">bbdbuy服务协议</h2>

      {/* 第一部分 */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          一、用户的确认和接受
        </h3>
        <p className="leading-relaxed mb-4 text-justify">
          本协议项下的电子服务（指www.bbdbuy.com及其移动软件和应用程序提供的服务）的所有权和运营权属于bbdbuy。用户（以下简称“您”）同意所有注册条款并完成全部注册程序后，方可成为bbdbuy的正式用户。您点击“同意本协议”即视为您确认您有能力享受bbdbuy提供的包括但不限于代购服务在内的服务并独立承担由此产生的法律责任。除非您和bbdbuy另有约定，本协议对您和bbdbuy具有约束力并永久有效。
        </p>
      </section>

      {/* 第二部分 */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          二、bbdbuy为企业提供的服务
        </h3>

        <div className="space-y-8">
          {/* 1. 包裹转运及代购服务政策 */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              1. 包裹转运及代购服务政策
            </h4>

            <div className="pl-0 sm:pl-4 space-y-6">
              <div>
                <h5 className="font-bold text-gray-800 mb-2">
                  （1）bbdbuy产品搜索与展示服务
                </h5>
                <p className="text-justify text-sm sm:text-base">
                  为了方便您与淘宝、1688等平台卖家沟通购买商品，bbdbuy会展示淘宝、1688等平台卖家的销售及购物链接，以便您可以直接通过链接完成对商品的搜索前往对应的商品详情页或网站，进一步了解商品信息或与卖家沟通。
                  bbdbuy不具备实际的销售功能，不具备实际的销售主体或销售平台。
                  bbdbuy不具备实际销售商品的功能，并非实际销售主体或销售平台。
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">
                  （2）代购及包裹转运服务
                </h5>
                <div className="bg-gray-50 p-4 rounded text-sm text-justify">
                  <p className="mb-2">
                    <span className="font-semibold">代购服务：</span>
                    本协议项下的所有代购服务均由第三方采购商独立向您提供，目前第三方采购商正在为您提供免费服务，但您需要的代购商品的费用需由您提前支付。但如果您委托代购商为您提供第三方商家代购服务，您需要向bbdbuy支付代购所需商品费用。具体为您选择代购的商品购买价格和物流价格（考虑汇率波动和结算时间，实际计算可能存在细微差异）。您同意bbdbuy可以在您确认代购商品付款时直接添加必要的服务费。未能同时支付平台服务费将导致您的代购订单无法生成和验证。
                  </p>
                  <p>
                    <span className="font-semibold">包裹转运：</span>
                    如果您的代购订单中的商品涉及跨境运输，bbdbuy会为您推荐第三方物流商。您有责任自主选择物流商，物流商将独立为您服务。您需要向物流商支付运费，向bbdbuy支付平台服务费。具体平台服务费按运费的8%计算（考虑汇率波动和结算时间，实际计算可能存在细微差异）。您同意bbdbuy可以在您确认支付运费时直接添加平台服务费。未能同时支付平台服务费将导致无法生成和验证您的运输标签。对于国际包裹运输过程中发生的海关处罚、递送延误、损坏或丢失，bbdbuy不承担任何责任，所有风险需您自行评估和承担。如果包裹出现问题，您可以授权bbdbuy作为沟通代理与第三方物流商协商索赔。用户与第三方物流商之间的纠纷和争议与bbdbuy无关，所有赔偿相关事宜均以第三方物流商的标准为准。bbdbuy对这些事项不承担任何责任，也不承担连带责任。
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">
                  （3）产品购买及包裹转运免责声明
                </h5>
                <p className="text-justify text-sm sm:text-base">
                  为了您所购买的商品顺利到达，bbdbuy可能会对已到达的商品进行适当的处理。部分采购平台上的部分商家可能会进行非法商业活动，bbdbuy无法一一审核采购平台/商家/产品和/或服务的信息，也无法审核，敬请您谨慎购买。对交易涉及的采购平台/商户/产品和/或服务的质量、安全性、合法性、真实性、准确性一一进行核实。bbdbuy对此不做任何保证，也不对采购平台或其商户的任何违法行为承担责任。您在特殊条件下即视为同意并执行后续操作（访问以下网站），或者您可以在提交订单时向客服人员核实任何疑问（如有）。
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">
                  （4）5天内无理由退换货规则
                </h5>
                <p className="text-justify text-sm sm:text-base">
                  您必须了解bbdbuy提供委托采购服务，并非网络商品卖家。
                  <span className="font-bold text-red-600">
                    不适用《网购商品7天无理由退货暂行办法》。
                  </span>
                  bbdbuy代您购买的产品可在5天内无理由退换货（视具体情况而定）。您必须了解并确认，此类退换货服务在30天内只能免费享受一次，否则后续的退换货可能会收取一定的费用，甚至部分订单可能不予退换货。退货和/或换货。
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">
                  （5）包裹转运协议及查验规则
                </h5>
                <p className="text-justify text-sm sm:text-base">
                  您有责任了解国际违禁物品以及相关法律法规。bbdbuy可以按照包裹转发及回执规则对您的包裹进行签收和检查，接收符合要求的包裹并进行后续相关操作。
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">
                  （6）国内回程和国际回程
                </h5>
                <p className="text-justify text-sm sm:text-base">
                  由于国际物流的特殊性，部分包裹可能会在寄出国海关被标注为“未通过国内安检”，对此，bbdbuy可以在您的包裹寄出后免费安排再次派送。包裹被退回。若您的包裹已寄往海外，因未通过国际安检、无收件人、地址错误或不完整、投递失败等原因被退回，重寄费用需由您承担。本协议中境内退货仅适用于中国大陆地区。
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">
                  （7）交货延误保险及赔偿
                </h5>
                <p className="text-justify text-sm sm:text-base">
                  包裹自寄往第三方承运商起，如超过平台公布的保价配送路线时间，则视为包裹延误。对于延误递送的赔偿，可由收件人申请赔偿后，由bbdbuy与相关第三方物流服务商协商，赔偿金可退回至该国际包裹的客户账户，但前提是：由于海关、天气、交通管制、罢工、法规政策修改等政府和司法机关的行为、决定或命令、恐怖事件、抢劫、抢夺等暴力犯罪、战争、及其他不可抗力因素等，不予赔偿。
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">
                  （8）包裹保险和赔偿
                </h5>
                <p className="text-justify text-sm sm:text-base">
                  若您的包裹丢失，且您在提交订单时已购买包裹保险，保险公司可根据您的保险价值提供相应的赔偿。您应了解，如果包裹内含有国际禁运物品，或由于某些因素导致包裹丢失（具体请参阅保险单），您须承担包裹丢失的全部责任。
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">（9）收到包裹</h5>
                <p className="text-justify text-sm sm:text-base">
                  正常确认收到包裹即表示整个运输流程结束。您在签收时应仔细检查外包装箱，签收后如有相关问题可立即回复客服人员。
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">（10）售后服务</h5>
                <p className="text-justify text-sm sm:text-base">
                  建议您收到包裹后在网站上确认收货。如有需要，您可以在售后服务有效期内申请售后服务，否则，超过该有效期后，将不再提供售后服务。有效售后期限以交货天数和收到产品确认为准计算。
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">
                  （11）无忧补偿政策
                </h5>
                <p className="text-justify text-sm sm:text-base">
                  您在使用本协议项下的服务前，应了解bbdbuy提供的所有业务和服务的相关规则，充分理解并确认您在本协议项下的所有权利和义务。
                </p>
              </div>

              {/* 赔偿免责声明 - 复杂嵌套结构 */}
              <div>
                <h5 className="font-bold text-gray-800 mb-4">
                  （12）赔偿免责声明
                </h5>

                <div className="pl-2 sm:pl-4 space-y-6 text-sm sm:text-base">
                  {/* (一) */}
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      （一）bbdbuy致力于为您提供国际网购服务。出现以下特殊情况的，即视为您同意并认可bbdbuy进行后续操作。
                    </p>
                    <ul className="list-none space-y-3 pl-2 sm:pl-4 text-gray-600">
                      <li>
                        <strong className="text-gray-700">a) 敏感商品：</strong>
                        为了您的包裹顺利投递，包括精油、护理液、润滑油、电池、胶水在内的敏感商品可能会被bbdbuy取出。
                      </li>
                      <li>
                        <strong className="text-gray-700">b) 海关政策：</strong>
                        假冒商品、含有大量液体或粉末的商品、或装有电池的商品、食品或药品等，由于海关政策的影响，可能存在一定的投递风险。由于上述风险而产生的后果，bbdbuy不承担清关及相关法律责任。
                      </li>
                      <li>
                        <strong className="text-gray-700">
                          c) 无法进行专业检查：
                        </strong>
                        bbdbuy可能无法对某些商品（如电器、假冒商品、门票、卡片、模型等）提供专业检验（质量、真伪、完整性等方面），对此，我们的检验员可能仅检查外观是否完好以及配件是否完好。是否齐全，bbdbuy无法打开商品检查质量。因此，bbdbuy不对我们的产品质量做出任何承诺或承担任何责任。
                      </li>
                      <li>
                        <strong className="text-gray-700">d) 易碎商品：</strong>
                        由于陶瓷、玻璃等商品以及不规则形状的商品（雨刮器、减震器）在多次运输过程中可能会磨损或破裂，bbdbuy建议您谨慎购买。bbdbuy可以保证该商品在发货前是完整的，但如果该商品被物流服务商判断为易碎商品，且在运输过程中发生损坏，由此产生的任何损失和责任均由您自行承担。
                      </li>
                      <li>
                        <strong className="text-gray-700">e) 定制商品：</strong>
                        如果您订购的是定制商品，建议您直接与商家协商。您可以根据您的想法和创意购买此类商品。洽谈成功后，您应向我们提供与商家的联系方式。由于bbdbuy无法对该商品提供专业检验，因此产生的任何损失和责任均由您自行承担。
                      </li>
                      <li>
                        <strong className="text-gray-700">f) 定金下单：</strong>
                        由于淘宝卖家规定，已付定金的订单不可取消，买家需主动按照卖家发布的信息付清余款，方可发货。如果逾期支付余款，押金将不予退还。
                      </li>
                      <li>
                        <strong className="text-gray-700">
                          g) 信誉不佳的卖家：
                        </strong>
                        我们建议您选择信誉三星以上且已支付淘宝定金的店铺购买商品。信誉较低且未缴纳定金的店铺可能会出现卖家不发货、虚假发货、售后、合法维权等纠纷，由此造成的损失需要您自行承担。
                      </li>
                      <li>
                        <strong className="text-gray-700">
                          h) CD类商品及模型：
                        </strong>
                        由于CD类商品及人物模型具有较高的收藏价值，且此类商品无法通过打开塑料包装袋来检查，因此bbdbuy仅检查外观是否完好无损，而不会检查内部情况，由此产生的一切风险和责任均由您自行承担。
                      </li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-500 italic">
                      如果您的订单存在前款规定的风险，则视为您已阅读并接受上述条款。请务必仔细阅读。
                      bbdbuy保留最终解释权。
                    </p>
                  </div>

                  {/* (二) */}
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      （二）对于非因bbdbuy原因造成的邮件在投递过程中发生的丢失、短少、损坏或延误等情况，bbdbuy不承担任何责任，具体如下：
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                      <li>
                        a)
                        因不可抗力事件的发生而造成的同样情况（保价邮件除外）；
                      </li>
                      <li>
                        b)
                        邮寄的商品违反限制、限制规定，已被主管机关按照规定没收或者以其他方式处置的；
                      </li>
                      <li>
                        c)
                        邮件投递时包装完好，无拆解、无重量损失，但内装商品短少、损坏的；
                      </li>
                      <li>d) 收据单由收件人签名；</li>
                      <li>
                        e) 由于用户或其中所含商品的任何原因造成邮件丢失或延误；
                      </li>
                      <li>
                        f)
                        自邮件送达之日起至查询期限届满期间，用户未提出查询、索赔的；
                      </li>
                      <li>
                        g)
                        国际邮件被该邮件投递国或该邮件中转国的主管当局根据其国家法律扣留、没收或销毁；
                      </li>
                      <li>h) 其他不可归咎于bbdbuy的原因。</li>
                    </ul>
                  </div>

                  {/* (三) */}
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      （三）违禁物品说明 - 禁止邮寄的物品包括：
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                      <li>a) 国家法律、法规禁止流通、寄递的商品；</li>
                      <li>b) 爆炸性、易燃性、腐蚀性、放射性、有毒危险品；</li>
                      <li>c) 反动报纸、书籍、窗户或淫秽物品；</li>
                      <li>d) 各种货币；</li>
                      <li>e) 可能损害公众健康的物品；</li>
                      <li>f) 易腐烂的物品；</li>
                      <li>
                        g)
                        任何活体动物（不包括蜜蜂、蚕和水蛭，其包装可以确保运输安全和工人的安全）；
                      </li>
                      <li>
                        h)
                        此类物品包装不正确，可能危及人身安全，或者可能污染或损坏邮件或其他邮件设备；
                      </li>
                      <li>i) 所有其他不适合邮寄条件的物品。</li>
                    </ul>
                  </div>

                  {/* (四) */}
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      （四）邮政惯例禁止在下列情况下投递：
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                      <li>
                        a)
                        根据其性质或包裹，可能或疑似会伤害邮政服务人员或损坏邮件或邮政设备；
                      </li>
                      <li>
                        b)
                        用具有锋利边缘的金属纽扣密封的物品，可能会妨碍邮件处理设备；
                      </li>
                      <li>
                        c)
                        各类枪械、弹药、爆炸物、易燃物品、腐蚀性物品、放射性元素及容器、烈性毒药、麻醉药品、生化制品、传染性物品；
                      </li>
                      <li>
                        d)
                        危害社会安全稳定或者淫秽的各类出版物、宣传品、印刷品等；
                      </li>
                      <li>e) 各种可能危害公众健康的物品；</li>
                      <li>f) 对方禁止进境或者流通的文件或者商品；</li>
                      <li>
                        g) 除上述物品外，海关主管部门规定禁止携带的其他物品；
                      </li>
                      <li>h) 台湾地区邮寄规定禁止邮寄的物品。</li>
                    </ul>
                  </div>

                  {/* (五) */}
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">
                      （五）根据其性质或包裹，可能或疑似会伤害邮政服务人员或损坏邮件或邮政设备：
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                      <li>
                        a)
                        用具有锋利边缘的金属纽扣密封的物品，可能会妨碍邮件处理设备；
                      </li>
                      <li>
                        b)
                        从一个注册实体包装并发往另一注册实体并经主管机关许可的易燃、易爆或除脆性生物材料以外的其他危险物品；
                      </li>
                      <li>
                        c)
                        从一个注册实体发送到另一注册实体的活体动物（蜜蜂、蚕、水蛭或寄生虫除外）或用于消灭害虫的昆虫；
                      </li>
                      <li>d) 放射性物品；</li>
                      <li>
                        e)
                        鸦片、吗啡及除运输单据以外的其他麻醉物品，已由主管机关出具或经主管司法机关或警察机关证明可用于证据用途，并已投保或申报价值，或已经主管机关许可，投保并用于医药或科学研究；
                      </li>
                      <li>
                        f)
                        通过挂号邮件或包裹投递的淫秽或不雅文件或物品，但经主管司法机关或警察机关证明用于证据用途的除外；
                      </li>
                      <li>g) 邮件送达国主管当局禁止入境的文件或物品；</li>
                      <li>
                        h)
                        台湾地区主管机关禁止出售或制造之文件或物品，但经主管司法机关或警察机关证明可作证据之用且以挂号邮件或包裹寄送之文件或物品除外；
                      </li>
                      <li>
                        i)
                        彩票及其传单，但经主管司法机关或警察机关证明可用于证据目的并通过挂号邮件或包裹投递的除外；
                      </li>
                      <li>j) 其他法律、法规规定的违禁品。</li>
                    </ul>
                    <p className="mt-4 font-bold text-gray-800">
                      在任何情况下，bbdbuy
                      均不对间接损失或未实现的利益承担责任。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 1688代购服务规则 */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              2. 1688代购服务规则
            </h4>
            <p className="text-justify text-sm sm:text-base">
              本协议项下的代购服务是由第三方采购公司提供，旨在协助您从1688卖家处购买您指定的商品。
              bbdbuy不保证1688产品的质量，也不提供准确的库存服务，仅提供有限的样品服务和有限的售后服务。请您谨慎选择商品并自行承担风险。如果您需要有保证的购买，您可以使用bbdbuy的专家采购服务。
            </p>
          </div>
        </div>
      </section>

      {/* 第三部分 */}
      <section className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          三、国际物流限制说明
        </h3>
        <p className="leading-relaxed mb-4 text-justify">
          在中国境内购买的商品必须符合中华人民共和国（以下简称“中华人民共和国”）法律法规并允许出口。您理解并承认，基于各国海关政策的不同，部分国家或地区对特殊商品较为敏感，此类商品在进入当地海关时被没收的概率稍大。因上述原因导致商品被收货地当地海关没收、销毁或扣留的，bbdbuy不承担责任。
        </p>
        <p className="leading-relaxed mb-4 text-justify">
          海关对包裹的检查基本上都是抽查的形式。如果海关认为您的包裹比较特殊（例如尺寸过大、重量过重、或者含有敏感商品等），海关会主动联系收件人索取发票或清关文件。请受委托采购人配合履行海关信息公开义务。
          bbdbuy 对清关不做任何承诺或保证。
        </p>
        <p className="font-semibold mb-2">请务必详细阅读：</p>
        <ol className="list-decimal pl-5 space-y-1 text-blue-600 cursor-pointer">
          <li>中华人民共和国限制进出境物品</li>
          <li>邮寄限制-代购、代运货物范围</li>
          <li>邮寄限制-代购及中转检验范围</li>
          <li>海关查验</li>
        </ol>
      </section>

      {/* 第四部分 */}
      <section className="mb-12">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          四、协议更新及用户的维护义务
        </h3>
        <ol className="list-decimal pl-5 space-y-3 text-justify text-sm sm:text-base">
          <li>
            随着bbdbuy业务的发展，本服务协议可能会不时更新，以便为您提供更好的服务；但未经您明确同意，bbdbuy不得减少您在本协议项下的权利。
            bbdbuy将在bbdbuy网站和移动端发布更新版本，并在相关内容更新生效前通过网站公告或其他适当方式通知您。请访问bbdbuy以了解最新的服务协议。
          </li>
          <li>
            bbdbuy将对其任何重大变更进行显着通知（为此，bbdbuy将通过包括但不限于电子邮件、短信或浏览页面上的特别提示等方式说明我们隐私政策的具体变更）。
          </li>
          <li>
            您有义务不时关注并阅读最新版本的协议及bbdbuy公告。如果您不同意更新后的协议，您应立即停止接受bbdbuy依据本协议提供的服务；如果您继续使用bbdbuy提供的服务，即视为您已同意更新后的协议。如果本协议的任何条款因任何原因被废除、无效或不可执行，则该条款应被视为可分割的，并且不影响任何其余条款的有效性和可执行性。
          </li>
          <li>
            本协议的订立、执行、解释及争议解决均适用香港法律。如双方就本协议的内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成的，应向协议签订地有管辖权的人民法院提起诉讼。
          </li>
        </ol>
      </section>

      {/* 法律声明和隐私政策 */}
      <section className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          法律声明和隐私政策
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-justify">
          bbdbuy
          非常重视用户的隐私和个人信息的保护。当您使用我们的产品或服务时，我们还可能收集和使用有关您的信息。我们愿意通过本隐私政策来说明您在使用我们的产品或服务时如何收集、使用、保存、共享和传输这些信息，以及我们为您提供的访问、更新、删除和保护这些信息的方式，包括但不限于以便我们将您的平台账户ID、bbdbuy网站操作行为同步传输给淘宝、1688等购物平台合作伙伴。隐私政策的具体条款以
          bbdbuy《bbdbuy用户隐私政策》为准。
        </p>
      </section>

      {/* 底部公司信息 */}
      <footer className="text-center text-gray-500 text-xs sm:text-sm mt-12 border-t pt-8">
        <p className="font-semibold text-gray-700 mb-1">
          Company Name: UK ALLCHINABUY CO., LIMITED
        </p>
        <p className="mb-1">Company Number: 15707576</p>
        <p>
          Company Address: 7 Copperfield Road, Coventry, West Midlands, CV2 4AQ
        </p>
      </footer>
    </article>
  );
}
