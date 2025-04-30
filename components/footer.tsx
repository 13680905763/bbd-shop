import React from "react";

import { siteConfig } from "@/config/site";
export default function Footer() {
  return (
    <footer className="h-[400px] bg-[#131926] text-[#adb8cc] w-full">
      <div className="container mx-auto">
        <div className="flex justify-between py-8">
          {siteConfig.footerItems.map((item) => {
            return (
              <div key={item.title}>
                <p>{item.title}</p>
                {item.itemLabel.map((label) => {
                  return (
                    <p key={label.label} className="text-[14px] leading-[36px]">
                      {label.label}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="border-t border-t-[hsla(0,0%,100%,0.1)] flex justify-between pt-8 text-[#7d8fb3]">
          <div>
            <p className="text-[16px] leading-[36px]">
              Copyright© 2020-2024 Hoobuy.com All Rights Reserved{" "}
            </p>
            <p className="text-[16px] leading-[36px]">
              厦门呼呼算数字科技有限公司
            </p>
            <p className="text-[16px] leading-[36px]">
              中国（福建）自由贸易试验区厦门片区象兴一路15号自贸法务大楼601室H
            </p>
          </div>
          <div className="flex justify-evenly items-center min-w-[60%]">
            <p>About Hoobuy</p>
            <p>Service Terms and User Management</p>
            <p>Privacy Policy</p>
            <p>Contact Us</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
