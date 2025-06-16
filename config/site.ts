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
      src: "/images/page/icon01.png",
    },
    {
      title: "Delivery to Our Warehouse",
      describe:
        "Shop from a variety of sellers through our service, and well efficiently consolidate your purchases. All items will be shipped to the BBDbuy warehouse in China, streamlining the process for your convenience.",
      src: "/images/page/icon02.png",
    },
    {
      title: "Quality Assurance Process",
      describe:
        "Once your products arrive at the BBDbuy warehouse, they are subjected to a thorough Quality Check. Our team meticulously examines each item for any defects, ensuring accuracy in size, color, and more. With BBDbuy, you can enjoy peace of mind, knowing that our dedicated after-sales service is committed to your satisfaction.",
      src: "/images/page/icon03.png",
    },
    {
      title: "Global Shipping Made Easy",
      describe:
        "Select products from your warehouse inventory and consolidate them effortlessly into one parcel. With BBDbuy s reliable global shipping services, you can have your purchases delivered straight to your doorstep. Enjoy the convenience of world-class shipping at your fingertips.",
      src: "/images/page/icon04.png",
    },
  ],
  menuItem: [
    {
      key: "",
      title: "我的账户",
    },
    {
      key: "wallet?tab=balance",
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
      title: "Quick  Links",
      itemLabel: [
        {
          label: "Home",
          href: "",
        },
        {
          label: "Fill & Buy",
          href: "",
        },
        {
          label: "Forwarding",
          href: "",
        },
        {
          label: "Estimation",
          href: "",
        },
      ],
    },
    {
      title: "Help",
      itemLabel: [
        {
          label: "Help Center",
          href: "",
        },
        {
          label: "Trust And Safety",
          href: "",
        },
        {
          label: "Privacy Settings",
          href: "",
        },
      ],
    },

    {
      title: "Working Hours",
      itemLabel: [
        {
          label: "Monday - Friday : 9:00AM - 4:00PM",
          describe: "9:00AM - 4:00PM",
          href: "",
        },
        {
          label: "Saturday : 10:00AM - 2:00PM",
          describe: "10:00AM - 2:00PM",
          href: "",
        },
        {
          label: "Sunday : Closed",
          describe: "Closed",
          href: "",
        },
      ],
    },
  ],
};
