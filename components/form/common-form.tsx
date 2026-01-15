import { Button, Form } from "@heroui/react";
import React, { ReactNode, useState, useMemo } from "react";
import { useTranslations } from "next-intl";

import FormItemRenderer, { FieldConfig } from "./formItem-renderer";

interface CommonFormProps<T extends Record<string, any> = Record<string, any>> {
  fields: FieldConfig[];
  formData: T;
  onChange: (data: T) => void;
  onSubmit?: (data: T) => Promise<any> | void;
  confirmText?: string;
  children?: ReactNode;
  isLoading?: boolean; // 👈 外部 loading（优先）
}

export default function CommonForm<T extends Record<string, any>>({
  fields,
  formData,
  onChange,
  onSubmit,
  confirmText,
  children,
  isLoading: externalLoading,
}: CommonFormProps<T>) {
  const t = useTranslations("components.form");
  // 👇 仅作为兜底
  const [internalLoading, setInternalLoading] = useState(false);

  // 👇 实际生效的 loading（外部优先）
  const loading = useMemo(
    () => externalLoading ?? internalLoading,
    [externalLoading, internalLoading]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    // 外部有 loading → 说明由外部管理
    if (externalLoading !== undefined) {
      await onSubmit?.(formData);
      return;
    }
    // 否则使用内部兜底
    try {
      setInternalLoading(true);
      await onSubmit?.(formData);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <Form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <FormItemRenderer
        fields={fields}
        formData={formData}
        onChange={onChange}
      />
      <div className="my-2 flex w-full flex-col gap-2">
        <Button color="primary" isLoading={loading} type="submit">
          {confirmText ?? t("save")}
        </Button>
        {children}
      </div>
    </Form>
  );
}
