import { Button, Form } from "@heroui/react";
import React, { ReactNode } from "react";

import FormItemRenderer, { FieldConfig } from "./formItem-renderer";

interface CommonFormProps<T extends Record<string, any> = Record<string, any>> {
  fields: FieldConfig[];
  formData: T;
  onChange: (data: T) => void;
  onSubmit?: (data: T) => void;
  confirmText?: string;
  children?: ReactNode; // ✅ 新增 children
  isLoading?: boolean;
}

export default function CommonForm<T extends Record<string, any>>({
  fields,
  formData,
  onChange,
  onSubmit,
  confirmText = "保存",
  children,
  isLoading,
}: CommonFormProps<T>) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(formData); // ✅ 直接用状态
  };

  return (
    <Form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <FormItemRenderer
        fields={fields}
        formData={formData}
        onChange={onChange}
      />

      <div className="my-2 flex w-full flex-col gap-2">
        <Button color="primary" isLoading={isLoading} type="submit">
          {confirmText}
        </Button>
        {children}
      </div>
    </Form>
  );
}
