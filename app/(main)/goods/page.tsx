"use client";
import React from "react";
import { Image } from "@heroui/react";

import { subtitle } from "@/components/primitives";
export default function GoodsPage() {
  return (
    <div className="flex  max-w-[1300px] mx-auto max-h-[1000px] ">
      <div className="flex-1 p-10 bg-[#f5f5f5] overflow-auto scrollbar-hide">
        <Image
          alt="123"
          className=" object-fill "
          radius="sm"
          shadow="sm"
          src="https://cbu01.alicdn.com/img/ibank/O1CN01C7FPHu1gteQ6ZVrtL_!!1678344200-0-cib.jpg"
          width="100%"
        />
        <div className="flex mt-5 gap-5">
          <Image
            alt="123"
            className=" object-fill "
            radius="none"
            shadow="sm"
            src="https://cbu01.alicdn.com/img/ibank/O1CN01C7FPHu1gteQ6ZVrtL_!!1678344200-0-cib.jpg"
            width="100%"
          />
          <Image
            alt="123"
            className=" object-fill "
            radius="none"
            shadow="sm"
            src="https://cbu01.alicdn.com/img/ibank/O1CN01C7FPHu1gteQ6ZVrtL_!!1678344200-0-cib.jpg"
            width="100%"
          />
          <Image
            alt="123"
            className=" object-fill "
            radius="none"
            shadow="sm"
            src="https://cbu01.alicdn.com/img/ibank/O1CN01C7FPHu1gteQ6ZVrtL_!!1678344200-0-cib.jpg"
            width="100%"
          />
          <Image
            alt="123"
            className=" object-fill "
            radius="none"
            shadow="sm"
            src="https://cbu01.alicdn.com/img/ibank/O1CN01C7FPHu1gteQ6ZVrtL_!!1678344200-0-cib.jpg"
            width="100%"
          />
          <Image
            alt="123"
            className=" object-fill "
            radius="none"
            shadow="sm"
            src="https://cbu01.alicdn.com/img/ibank/O1CN01C7FPHu1gteQ6ZVrtL_!!1678344200-0-cib.jpg"
            width="100%"
          />
        </div>
        <div className={subtitle()}>商品詳情</div>
      </div>
      <div className="flex-1">右</div>
    </div>
  );
}
