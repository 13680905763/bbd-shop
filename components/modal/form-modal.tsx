import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import FormItemRenderer, { FieldConfig } from "../form/formItem-renderer";

interface FormModalProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  isLoading?: boolean;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
}
export default function FormModal({
  title,
  isOpen,
  onOpenChange,
  fields,
  formData,
  onChange,
  onSubmit,
  isLoading = false,
  confirmText,
  cancelText,
}: FormModalProps) {
  const t = useTranslations("components.modal");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSend = { ...formData };

    if (!dataToSend.stateId) {
      delete dataToSend.stateId;
    }
    if (!dataToSend.state) {
      delete dataToSend.state;
    }
    onSubmit(dataToSend);
  };

  return (
    <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
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
      </ModalContent>
    </Modal>
  );
}
