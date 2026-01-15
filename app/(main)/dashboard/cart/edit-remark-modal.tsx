import React, { useEffect, useState } from "react";
import { Textarea } from "@heroui/react";
import { useTranslations } from "next-intl";

import CommonModal from "@/components/modal/common-modal";

interface EditRemarkModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: string;
  onSubmit: (value: string) => Promise<void>;
  title?: string;
}

export default function EditRemarkModal({
  isOpen,
  onOpenChange,
  initialValue = "",
  onSubmit,
  title,
}: EditRemarkModalProps) {
  const t = useTranslations("dashboard.cart");
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onSubmit(value);
      onOpenChange(false);
    } catch (e) {
      // 错误处理交给外层或全局拦截
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      title={title || t("remarkTitle")}
      onConfirm={handleConfirm}
      onOpenChange={onOpenChange}
    >
      <Textarea
        placeholder={t("remarkPlaceholder")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </CommonModal>
  );
}
