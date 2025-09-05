"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "@heroui/input";
import { Form, Image, Spinner, addToast } from "@heroui/react";
import { FaRegImage } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";

import { SearchIcon } from "@/components/icons";
import { getGoodsId, getGoodsImageId } from "@/services";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  className,
}) => {
  const router = useRouter();
  const pathname = usePathname(); // 获取当前路径
  const prevPathRef = useRef(pathname);
  const [inputValue, setInputValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ------------------ 图片上传 ------------------
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
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

        const reader = new FileReader();

        reader.onload = (e) => setUploadedImage(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("上传图片失败", error);
      addToast({ title: "上传失败，请重试", timeout: 1000, color: "danger" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerUpload = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  // ------------------ 搜索 ------------------
  const handleSearch = async (e: any) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    let url: URL;

    try {
      url = new URL(data.url);
    } catch {
      addToast({ title: "请输入有效的 URL", timeout: 1000, color: "danger" });

      return;
    }

    const res: any = await getGoodsId({ url });

    router.push(`/goods/${res.source}/${res.sourceProductId}`);
    setInputValue("");
  };

  useEffect(() => {
    const prevPath = prevPathRef.current;

    console.log(
      666,
      prevPath,
      pathname,
      prevPath.startsWith("/search"),
      !pathname.startsWith("/search"),
    );

    // 如果之前在 /search，且现在不是 /search，则重置上传状态
    if (prevPath.startsWith("/search") && !pathname.startsWith("/search")) {
      console.log(666);

      setUploadedImage(null);
      setUploading(false);
    }

    prevPathRef.current = pathname;
  }, [pathname]);

  return (
    <Form
      className={`w-full max-w-xs ${className || ""}`}
      onSubmit={handleSearch}
    >
      <Input
        aria-label="Search"
        classNames={{ inputWrapper: "bg-default-100", input: "text-sm" }}
        endContent={
          <div className="flex items-center">
            {uploading ? (
              <Spinner color="primary" size="sm" />
            ) : uploadedImage ? (
              <Image
                alt="Uploaded"
                className="w-[30px] h-[30px] cursor-pointer min-w-[30px]"
                radius="none"
                src={uploadedImage}
                onClick={triggerUpload}
              />
            ) : (
              <FaRegImage
                className="w-[30px] h-[30px] text-gray-400 cursor-pointer"
                onClick={triggerUpload}
              />
            )}
          </div>
        }
        name="url"
        placeholder={placeholder}
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <input
        ref={fileInputRef}
        hidden
        accept="image/*"
        type="file"
        onChange={handleImageUpload}
      />
    </Form>
  );
};
