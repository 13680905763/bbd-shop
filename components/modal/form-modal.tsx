import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from "@heroui/react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import FormItemRenderer, { FieldConfig } from "../form/formItem-renderer";

interface FormModalProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  // ✅ onSave 可以返回 boolean（true 表示关闭）
  onSubmit: (
    data: Record<string, any>,
  ) => Promise<boolean | void> | boolean | void;
  confirmText?: string;
  cancelText?: string;
}

const FormModal = ({
  title,
  isOpen,
  onOpenChange,
  fields,
  formData,
  onChange,
  onSubmit,
  confirmText,
  cancelText,
}: FormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations("components.modal");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onSubmit?.(formData);
      //  onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <>
          <Form onSubmit={handleSubmit}>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody className="w-full">
              <FormItemRenderer
                fields={fields}
                formData={formData}
                onChange={onChange}
              />
            </ModalBody>
            <ModalFooter className="w-full">
              <Button
                isDisabled={isLoading}
                variant="flat"
                onPress={() => onOpenChange(false)}
              >
                {cancelText ?? t("cancel")}
              </Button>
              <Button color="primary" isLoading={isLoading} type="submit">
                {confirmText ?? t("confirm")}
              </Button>
            </ModalFooter>
          </Form>
        </>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
