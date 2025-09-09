"use client";

import { Button, Divider } from "@heroui/react";
import { useState } from "react";

import FormModal from "@/components/modal/form-modal";
import { FieldConfig } from "@/components/form/formItem-renderer";

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
  const [formData, setFormData] = useState({});

  const handleSave = async () => {
    // 保存逻辑
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
        onChange={setFormData}
        onOpenChange={setIsOpen}
        onSave={handleSave}
      />
    </>
  );
}
