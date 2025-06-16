import { Button, Form } from "@heroui/react";
import React from "react";

import FormItemRenderer, { FieldConfig } from "./formItem-renderer";

interface CommonFormProps {
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSubmit?: (data: Record<string, any>) => void;
}

export default function CommonForm({
  fields,
  formData,
  onChange,
  onSubmit,
}: CommonFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    onSubmit?.(data);
  };

  return (
    <Form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <FormItemRenderer
        fields={fields}
        formData={formData}
        onChange={onChange}
      />

      <div className="flex gap-2">
        <Button className="flex-1" color="primary" type="submit">
          保存
        </Button>
        <Button className="flex-1 button-default" type="reset" variant="flat">
          重置
        </Button>
      </div>
    </Form>
  );
}
