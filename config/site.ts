export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "BBD-Shop",
  description:
    "BBD is the best shopping agent in China.We provide a low-cost international freight for purchasing on chinese shopping site including Taobao.com,360buy.com.",
  navItems: [
    {
      label: "首页",
      href: "/",
    },
    {
      label: "转运",
      href: "/forwarding",
    },
    {
      label: "运费估算",
      href: "/estimation",
    },
    {
      label: "推广联盟",
      href: "/dashboard/promotion",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  describeItems: [
    {
      title: "Placing Your Order",
      describe:
        " Experience hassle-free shopping for any product from China, available both online and offline. To place your order, simply paste the link of the product you desire. Enjoy our seamless, end-to-end service that takes you from browsing to buying with ease.",
      src: "/page/icon01.png",
    },
    {
      title: "Delivery to Our Warehouse",
      describe:
        "Shop from a variety of sellers through our service, and well efficiently consolidate your purchases. All items will be shipped to the Hoobuy warehouse in China, streamlining the process for your convenience.",
      src: "/page/icon02.png",
    },
    {
      title: "Quality Assurance Process",
      describe:
        "Once your products arrive at the Hoobuy warehouse, they are subjected to a thorough Quality Check. Our team meticulously examines each item for any defects, ensuring accuracy in size, color, and more. With Hoobuy, you can enjoy peace of mind, knowing that our dedicated after-sales service is committed to your satisfaction.",
      src: "/page/icon03.png",
    },
    {
      title: "Global Shipping Made Easy",
      describe:
        "Select products from your warehouse inventory and consolidate them effortlessly into one parcel. With Hoobuy s reliable global shipping services, you can have your purchases delivered straight to your doorstep. Enjoy the convenience of world-class shipping at your fingertips.",
      src: "/page/icon04.png",
    },
  ],
  menuItem: [
    {
      key: "",
      title: "我的账户",
    },
    {
      key: "wallet",
      title: "我的资产",
    },
    {
      key: "message",
      title: "站内信",
    },

    {
      type: "divider",
    },
    {
      key: "cart",
      title: "购物车",
    },

    {
      key: "order",
      title: "订单",
    },
    {
      key: "warehouse",
      title: "仓库",
    },
    {
      key: "package",
      title: "包裹",
    },
    {
      key: "favorites",
      title: "收藏夹",
    },
    {
      key: "history",
      title: "浏览记录",
    },
    // {
    //   key: "sub12",
    //   title: "特权",
    // },
    {
      key: "promotion",
      title: "联盟",
    },
  ],
  footerItems: [
    {
      title: "Customer Service",
      itemLabel: [
        {
          label: "Help Center",
          href: "",
        },
        {
          label: "Contact Us",
          href: "",
        },
      ],
    },
    {
      title: "Shopping Agent Guide",
      itemLabel: [
        {
          label: "Beginner's Guide",
          href: "",
        },
        {
          label: "Service & Fees",
          href: "",
        },
        {
          label: "Returns and Refunds",
          href: "",
        },
      ],
    },
    {
      title: "Payment",
      itemLabel: [
        {
          label: "Top up",
          href: "",
        },
        {
          label: "International Credit Card",
          href: "",
        },
      ],
    },
    {
      title: "Delivery",
      itemLabel: [
        {
          label: "Charges",
          href: "",
        },
        {
          label: "Packaging",
          href: "",
        },
        {
          label: "Customs and Taxation",
          href: "",
        },
        {
          label: "Receipt Information",
          href: "",
        },
      ],
    },
    {
      title: "Warehouse & After-sale",
      itemLabel: [
        {
          label: "Storage",
          href: "",
        },
        {
          label: "Inspection Information",
          href: "",
        },
        {
          label: "Insurance and Compensation",
          href: "",
        },
      ],
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
