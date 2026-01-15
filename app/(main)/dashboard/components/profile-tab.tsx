"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";

import CommonForm from "@/components/form/common-form";
import { updateUserInfo, uploadAvatar } from "@/services"; // 需要你实现 uploadAvatar API
import { FieldConfig } from "@/components/form/formItem-renderer";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useUserInfo } from "@/hook";

export function ProfileTab() {
  const t = useTranslations("dashboard.page.profile");
  const { data: user, isLoading, error } = useUserInfo();
  const profileFields: FieldConfig[] = [
    {
      type: "input",
      name: "nickName",
      label: t("fields.nickName.label"),
      errorMessage: t("fields.nickName.errorMessage"),
      placeholder: t("fields.nickName.placeholder"),
      required: true,
    },

    {
      type: "input",
      name: "mobile",
      label: t("fields.mobile.label"),
      errorMessage: t("fields.nickName.errorMessage"),
      placeholder: t("fields.nickName.placeholder"),
      required: true,
    },
  ];

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    nickName: "",
    mobile: "",
  });
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFormData({
      id: user.id,
      nickName: user.nickName ?? "",
      mobile: user.mobile ?? "",
    });
  }, [user]);
  const updateMutation = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
  });


  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      await uploadAvatar(file);
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <>
      <div className="text-xl font-semibold text-title mb-4">{t("title")}</div>
      <div className="my-2">
        <button className="relative cursor-pointer" onClick={handleAvatarClick}>
          {avatarLoading ? (
            <Spinner size="lg" />
          ) : (
            <>
              <Avatar
                className="w-16 h-16 text-large"
                src={user?.avatarUrl ?? ""}
              />
              <span className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-1 rounded">
                {t("edit")}
              </span>
            </>
          )}
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
          onChange={setFormData}
          onSubmit={updateMutation.mutateAsync}
          isLoading={updateMutation.isPending}
        />
      </div>
    </>
  );
}
