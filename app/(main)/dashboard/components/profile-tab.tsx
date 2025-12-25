"use client";

import { useRef, useState } from "react";
import { Avatar, Spinner } from "@heroui/react";

import CommonForm from "@/components/form/common-form";
import { getUserInfo, updateUserInfo, uploadAvatar } from "@/services"; // 需要你实现 uploadAvatar API
import { useUserStore } from "@/store";

export default function ProfileTab({
  defaultformData,
  texts,
  profileFields,
}: any) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(defaultformData?.avatarUrl);
  const [formData, setFormData] = useState({
    id: defaultformData?.id,
    nickName: defaultformData?.nickName || "",
    // familyName: defaultformData?.familyName || "",
    // givenName: defaultformData?.givenName || "",
    mobile: defaultformData?.mobile || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await updateUserInfo(data);
    } finally {
      setIsLoading(false);
      const user = await getUserInfo();

      useUserStore.getState().setUser(user);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarLoading(true);
    try {
      // 这里需要你实现 uploadAvatar 接口：把 file 上传到后端并返回新的头像地址
      const url = await uploadAvatar(file);

      setAvatarUrl(url);

      // 更新用户信息
      await updateUserInfo({ ...formData, avatarUrl: url });
      const user = await getUserInfo();

      useUserStore.getState().setUser(user);
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <>
      <div className="text-xl font-semibold text-title mb-4">{texts.title}</div>

      <div className="my-2">
        <button className="relative cursor-pointer" onClick={handleAvatarClick}>
          {avatarLoading ? (
            <Spinner size="lg" />
          ) : (
            <Avatar className="w-16 h-16 text-large" src={avatarUrl ?? ""} />
          )}
          <span className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-1 rounded">
            {texts.edit}
          </span>
        </button>
        <input
          ref={fileInputRef}
          hidden
          accept="image/*"
          type="file"
          onChange={handleAvatarChange}
        />
      </div>

      <div className="flex justify-center">
        <CommonForm
          fields={profileFields}
          formData={formData}
          isLoading={isLoading}
          onChange={setFormData}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
