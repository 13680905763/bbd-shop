"use client";

import { addToast, Button, Divider } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import FormModal from "@/components/modal/form-modal";
import { updatePwd } from "@/services";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

export function SecurityTab() {
  const t = useTranslations("dashboard.page.security");

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const securityFields: FieldConfig[] = [
    {
      type: "input",
      name: "oldPassword",
      label: t("fields.oldPassword.label"),
      errorMessage: t("fields.oldPassword.errorMessage"),
      placeholder: t("fields.oldPassword.placeholder"),
      required: true,
    },
    {
      type: "input",
      name: "newPassword",
      label: t("fields.newPassword.label"),
      errorMessage: t("fields.newPassword.errorMessage"),
      placeholder: t("fields.newPassword.placeholder"),
      required: true,
    },
    {
      type: "input",
      name: "confirmPassword",
      label: t("fields.confirmPassword.label"),
      errorMessage: t("fields.confirmPassword.errorMessage"),
      placeholder: t("fields.confirmPassword.placeholder"),
      required: true,
    },
  ];

  // ✅ 使用 useMutation 封装请求
  const mutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => updatePwd(data),
    onSuccess: () => {
      queryClient.clear();
      setIsOpen(false);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
  });
  const handleSubmit = () => {
    // 校验两次密码一致性
    if (formData.newPassword !== formData.confirmPassword) {
      addToast({
        title: t("toast"),
        timeout: 1000,
        color: "danger",
      });
      return;
    }
    // 调用 mutation
    mutation.mutateAsync({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-title">{t("title")}</p>
          <p className="text-sm my-1">{t("description")}</p>
        </div>
        <div>
          <Button color="primary" radius="lg" onPress={() => setIsOpen(true)}>
            {t("button")}
          </Button>
        </div>
      </div>
      <Divider className="my-4" />
      <FormModal
        fields={securityFields}
        formData={formData}
        isOpen={isOpen}
        title={t("modalTitle")}
        onChange={setFormData}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
      />
    </>
  );
}
