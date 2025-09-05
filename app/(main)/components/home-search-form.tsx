// /components/home/SearchForm.tsx
"use client";

import { Button, Input, Form, addToast } from "@heroui/react";
import { FaRegImage, FaCircle } from "react-icons/fa";
import { AiOutlineAlibaba } from "react-icons/ai";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

import { getGoodsId, getGoodsImageId } from "@/services";

export default function HomeSearchForm({ isLoading, setIsLoading }: any) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsLoading(true);
    try {
      const res: any = await getGoodsImageId(file);

      if (res && res.length > 0) {
        const taobaoImageId = res.find(
          (item: any) => item.source === "TAOBAO",
        )?.imageId;
        const alibabaImageId = res.find(
          (item: any) => item.source === "1688",
        )?.imageId;

        if (taobaoImageId && alibabaImageId) {
          router.push(`/search?TAOBAO=${taobaoImageId}&1688=${alibabaImageId}`);
        }
      }
    } catch (error) {
      console.error("上传图片失败", error);
      addToast({
        title: "上传失败，请重试",
        timeout: 1000,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerUpload = () => {
    if (!isLoading) fileInputRef.current?.click();
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    let url: URL;

    try {
      url = new URL(data.url);
    } catch {
      addToast({
        title: "请输入有效的 URL",
        timeout: 1000,
        color: "danger",
      });

      return;
    }

    const res: any = await getGoodsId({ url });

    router.push(`/goods/${res.source}/${res.sourceProductId}`);
  };

  return (
    <>
      <Form className="w-full" onSubmit={handleSearch}>
        <Input
          endContent={
            <div className="flex gap-4 items-center">
              <FaRegImage
                className="w-[30px] h-[30px] text-gray-400 cursor-pointer"
                onClick={triggerUpload}
              />
              <Button className="bg-[#f0700c] text-[#fff]" type="submit">
                Search
              </Button>
            </div>
          }
          label={
            <div className="flex gap-2">
              Enter product name / link
              <div className="relative w-[30px] h-[30px]">
                <FaCircle className="text-gray-400 w-full h-full" />
                <span className="text-white absolute inset-0 flex items-center justify-center font-bold">
                  淘
                </span>
              </div>
              <AiOutlineAlibaba className="w-[30px] h-[30px] rounded-full bg-gray-400 text-white" />
              <div className="relative w-[30px] h-[30px]">
                <FaCircle className="text-gray-400 w-full h-full" />
                <span className="text-white absolute inset-0 flex items-center justify-center font-bold">
                  店
                </span>
              </div>
            </div>
          }
          name="url"
          radius="full"
          size="lg"
        />
        <input
          ref={fileInputRef}
          hidden
          accept="image/*"
          type="file"
          onChange={handleImageUpload}
        />
      </Form>
    </>
  );
}
