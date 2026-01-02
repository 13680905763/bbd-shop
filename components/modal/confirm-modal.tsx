"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useTranslations } from "next-intl";

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: React.ReactNode;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  footer?: React.ReactNode; // 可自定义 footer
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  footer,
}) => {
  const t = useTranslations("components.modal"); // Common 是语言包的 namespace

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(); // 调用外部传入的逻辑
      onOpenChange(false); // 成功后自动关闭
    } catch (err) {
      console.error("ConfirmModal error:", err);
      // 可加 toast 提示
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>{title ?? t("confirmModalTitle")}</ModalHeader>
        <ModalBody>{content}</ModalBody>
        <ModalFooter className="flex gap-2">
          {footer || (
            <>
              <Button
                className="flex-1 button-default"
                isDisabled={isLoading}
                variant="light"
                onPress={() => onOpenChange(false)}
              >
                {cancelText ?? t("cancel")}
              </Button>
              <Button
                className="flex-1"
                color="primary"
                isLoading={isLoading}
                onPress={handleConfirm}
              >
                {confirmText ?? t("confirm")}
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
