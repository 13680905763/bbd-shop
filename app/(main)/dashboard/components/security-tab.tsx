"use client";

import { addToast, Button, Divider } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import FormModal from "@/components/modal/form-modal";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { updatePwd } from "@/services";

interface SecurityTabProps {
  texts: {
    title: string;
    description: string;
    button: string;
    modalTitle: string;
  };
  fields: FieldConfig[];
}

export function SecurityTab({ texts, fields }: SecurityTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleSave = async () => {
    // 校验两次密码一致性
    if (formData.newPassword !== formData.confirmPassword) {
      addToast({
        title: "两次输入的新密码不一致",
        timeout: 1000,
        color: "danger",
      });

      return false;
    }

    try {
      await updatePwd({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      // addToast({
      //   title: "密码修改成功，请重新登录",
      //   timeout: 1000,
      //   color: "danger",
      // });
      // 跳转登录页（可改成你的登录路由）
      setTimeout(() => {
        router.push("/login");
      }, 2000);

      return true;
    } catch {}
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-title">{texts.title}</p>
          <p className="text-sm my-1">{texts.description}</p>
        </div>
        <div>
          <Button color="primary" onPress={() => setIsOpen(true)}>
            {texts.button}
          </Button>
        </div>
      </div>
      <Divider className="my-4" />
      <FormModal
        fields={fields}
        formData={formData}
        isOpen={isOpen}
        title={texts.modalTitle}
        onChange={(data) => setFormData(data)} // ✅ 避免类型不匹配
        onOpenChange={setIsOpen}
        onSave={handleSave}
      />
    </>
  );
}
