"use client";

import { addToast, Button, Card } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";

import FormModal from "@/components/modal/form-modal";
import { updatePwd } from "@/services";
import { FieldConfig } from "@/components/form/formItem-renderer";
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
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      updatePwd(data),
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
      <Card className="p-6 border-2 border-gray-300" shadow="none">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <IoShieldCheckmarkOutline size={24} />
            </div>
            <div>
              <p className="text-lg font-semibold">{t("title")}</p>
              <p className="text-sm text-gray-500 mt-1">{t("description")}</p>
            </div>
          </div>
          <div>
            <Button color="primary" radius="lg" onPress={() => setIsOpen(true)}>
              {t("button")}
            </Button>
          </div>
        </div>
      </Card>
      <FormModal
        fields={securityFields}
        formData={formData}
        isLoading={mutation.isPending}
        isOpen={isOpen}
        title={t("modalTitle")}
        onChange={setFormData}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}
