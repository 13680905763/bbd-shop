import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useState } from "react";

import FormItemRenderer, { FieldConfig } from "../form/formItem-renderer";

interface FormModalProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  // ✅ onSave 可以返回 boolean（true 表示关闭）
  onSave: (
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
  onSave,
  confirmText = "保存",
  cancelText = "取消",
}: FormModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await onSave(formData);

      // 只有返回 true 时才关闭
      if (result === true) {
        onOpenChange(false);
      }
    } catch (e) {
      console.error("保存失败:", e);
    } finally {
      setLoading(false);
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
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <FormItemRenderer
              fields={fields}
              formData={formData}
              onChange={onChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={loading}
              variant="flat"
              onPress={() => onOpenChange(false)}
            >
              {cancelText}
            </Button>
            <Button color="primary" isLoading={loading} onPress={handleSave}>
              {confirmText}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
