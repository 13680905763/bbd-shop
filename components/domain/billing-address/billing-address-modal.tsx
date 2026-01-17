"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";

import { addAddress, updateAddress } from "@/services/address";
import { FieldConfig } from "@/components/form/formItem-renderer";
import FormModal from "@/components/modal/form-modal";
import { useBillingAddress } from "@/hook";
import { queryClient } from "@/lib/react-query";

interface AddressModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function AddressModal({
  isOpen,
  onOpenChange,
}: AddressModalProps) {
  console.log("渲染账单地址弹窗~~~~");
  const t = useTranslations("components.modal.billingAddress");
  const { data } = useBillingAddress();
  /** 是否编辑态（由 domain 数据决定） */
  const isEdit = !!data;
  /** 表单字段配置 */
  const billingAddressField: FieldConfig[] = useMemo(
    () => [
      {
        type: "input",
        name: "familyName",
        label: t("fields.familyName.label"),
        placeholder: t("fields.familyName.placeholder"),
        required: true,
        errorMessage: t("fields.familyName.errorMessage"),
      },
      {
        type: "input",
        name: "givenName",
        label: t("fields.givenName.label"),
        placeholder: t("fields.givenName.placeholder"),
        required: true,
        errorMessage: t("fields.givenName.errorMessage"),
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
    ],
    [t],
  );

  const [formData, setFormData] = useState<any>({
    familyName: "",
    givenName: "",
    phone: "",
    countryId: "",
    stateId: "",
    city: "",
    addressType: "",
    postcode: "",
    doorNo: "",
  });

  useEffect(() => {
    if (isEdit && data) {
      setFormData(data);
    }
  }, [isEdit, data]);

  /** 统一清洗表单数据（与 UI 解耦） */
  const normalizeFormData = (data: any) => {
    const { createTime, updateTime, customerId, ...rest } = data;

    return rest;
  };
  const addMutation = useMutation({
    mutationFn: async (formData: any) => {
      const normalizedData = normalizeFormData(formData);

      return addAddress({
        ...normalizedData,
        addressType: 2,
        defaultAddress: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: any) => {
      const normalized = normalizeFormData(formData);

      return updateAddress(normalized);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] });
    },
  });

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (currentFormData: any) => {
    if (isEdit) {
      await updateMutation.mutateAsync(currentFormData);
    } else {
      await addMutation.mutateAsync(currentFormData);
    }
    onOpenChange(false);
  };

  return (
    <FormModal
      fields={billingAddressField}
      formData={formData}
      isLoading={isSubmitting}
      isOpen={isOpen}
      title={isEdit ? t("editTitle") : t("addTitle")}
      onChange={setFormData}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    />
  );
}
