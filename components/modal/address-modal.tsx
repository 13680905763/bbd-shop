"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FieldConfig } from "../form/formItem-renderer";

import FormModal from "./form-modal";

import { addAddress, updateAddress } from "@/services/address";

export interface AddressModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  type,
  defaultData,
}: AddressModalProps) {
  const t = useTranslations("components.modal.address");
  const queryClient = useQueryClient();

  const addressFields: FieldConfig[] = [
    {
      type: "input",
      name: "recipient",
      label: t("fields.recipient.label"),
      placeholder: t("fields.recipient.placeholder"),
      required: true,
      errorMessage: t("fields.recipient.errorMessage"),
    },
    {
      type: "input",
      name: "phone",
      label: t("fields.phone.label"),
      placeholder: t("fields.phone.placeholder"),
      required: true,
      errorMessage: t("fields.phone.errorMessage"),
    },
    {
      type: "area",
      name: "area",
      label: t("fields.area.label"),
      placeholder: t("fields.area.placeholder"),
    },
    {
      type: "input",
      name: "address",
      label: t("fields.address.label"),
      placeholder: t("fields.address.placeholder"),
      required: true,
      errorMessage: t("fields.address.errorMessage"),
    },
    {
      type: "input",
      name: "doorNo",
      label: t("fields.doorNo.label"),
      placeholder: t("fields.doorNo.placeholder"),
      required: true,
      errorMessage: t("fields.doorNo.errorMessage"),
    },
    {
      type: "input",
      name: "postcode",
      label: t("fields.postcode.label"),
      placeholder: t("fields.postcode.placeholder"),
      required: true,
      errorMessage: t("fields.postcode.errorMessage"),
    },
    {
      type: "checkbox",
      name: "defaultAddress",
      label: t("fields.defaultAddress.label"),
    },
  ];
  const [formData, setFormData] = useState<any>(initAddress);

  useEffect(() => {
    if (type === "edit" && defaultData) {
      setFormData({ ...initAddress, ...defaultData });
    } else if (type === "add") {
      setFormData(initAddress);
    }
  }, [type, defaultData, isOpen]);

  const normalizeFormData = (data: any) => {
    const { createTime, updateTime, customerId, ...rest } = data;

    return rest;
  };
  const addMutation = useMutation({
    mutationFn: async (formData: any) => {
      const normalizedData = normalizeFormData(formData);

      return addAddress({
        ...normalizedData,
        addressType: 1,
        defaultAddress: normalizedData.defaultAddress ? 1 : 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: any) => {
      const normalized = normalizeFormData(formData);

      return updateAddress({
        ...normalized,
        defaultAddress: normalized.defaultAddress ? 1 : 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    },
  });
  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (currentFormData: any) => {
    if (type === "edit") {
      await updateMutation.mutateAsync(currentFormData);
    } else {
      await addMutation.mutateAsync(currentFormData);
    }
    onOpenChange(false);
  };

  return (
    <FormModal
      fields={addressFields}
      formData={formData}
      isLoading={isSubmitting}
      isOpen={isOpen}
      title={type === "add" ? t("addTitle") : t("editTitle")}
      onChange={setFormData}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    />
  );
}
