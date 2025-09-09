"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import FormModal from "./form-modal";

export interface AddressModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  type: "add" | "edit";
  defaultData?: any;
}

const initAddress = {
  recipient: "",
  phone: "",
  countryId: "",
  stateId: "",
  city: "",
  addressType: "",
  postcode: "",
  defaultAddress: 0,
  doorNo: "",
  address: "",
};

export default function AddressModal({
  isOpen,
  onOpenChange,
  onSave,
  type,
  defaultData,
}: AddressModalProps) {
  const t = useTranslations("Components.Addressfields");

  const [formData, setFormData] = useState<any>(initAddress);

  useEffect(() => {
    if (type === "edit" && defaultData) {
      setFormData({ ...initAddress, ...defaultData });
    } else if (type === "add") {
      setFormData(initAddress);
    }
  }, [type, defaultData]);

  const handleSave = (data: any) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <FormModal
      cancelText="取消"
      confirmText={type === "add" ? "添加" : "保存"}
      fields={t.raw("fields")}
      formData={formData}
      isOpen={isOpen}
      title={type === "add" ? "添加地址" : "编辑地址"}
      onChange={setFormData}
      onOpenChange={onOpenChange}
      onSave={handleSave}
    />
  );
}
