"use client";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import React from "react";

import FormModal from "@/components/modal/form-modal";
import ConfirmModal from "@/components/modal/confirm-modal";
import { addAddress, deleteAddress, updateAddress } from "@/services";
import { useBillingAddressStore } from "@/store";
import { AddressItem } from "@/types";
import { queryClient } from "@/lib/react-query";
import { FieldConfig } from "@/components/form/formItem-renderer";

type ModalType = "add" | "edit" | "delete" | null;
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
};

interface BillingAddressTabProps {
  texts: {
    addButton: string;
    editButton: string;
    deleteButton: string;
    deleteConfirm: string;
    modalAddTitle: string;
    modalEditTitle: string;
    noAddress: string;
  };
  fields: FieldConfig[];
}

export default function BillingAddressTab({
  texts,
  fields,
}: BillingAddressTabProps) {
  const billingAddress = useBillingAddressStore(
    (state) => state.billingAddress,
  );

  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentRowData, setCurrentRowData] = useState<any>(initAddress);

  const handleAdd = () => {
    setCurrentRowData(initAddress);
    setModalType("add");
  };

  const handleEdit = () => {
    setModalType("edit");
  };

  const handleDelete = () => {
    setModalType("delete");
  };

  // 地址保存时处理
  const handleSave = async () => {
    const { createTime, updateTime, customerId, ...filteredData } =
      currentRowData;

    try {
      if (modalType === "add") {
        await addAddress({ ...currentRowData, addressType: 2 }); // 新增接口
      } else if (modalType === "edit") {
        await updateAddress({
          ...filteredData,
          city: filteredData?.city || filteredData?.state,
        }); // 编辑接口
      } else if (modalType === "delete") {
        await deleteAddress({ id: currentRowData.id });
      }
      setModalType(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] }); // 手动刷新
    }
  };

  useEffect(() => {
    setCurrentRowData(billingAddress);
  }, [billingAddress]);

  return (
    <>
      {Object.keys(billingAddress as AddressItem).length ? (
        <div>
          <div className="p-4 border-2 border-dashed border-[#5e5e5e]">
            <div className="flex justify-between ">
              <div className="flex gap-8">
                <div className="text-title">{billingAddress?.recipient}</div>
                <div>{billingAddress?.phone}</div>
              </div>
              <div>{billingAddress?.postcode}</div>
            </div>
            <div className="text-gray-base">
              {billingAddress?.address},{billingAddress?.city},
              {billingAddress?.state},{billingAddress?.country}
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <Button
              className="button-default"
              radius="sm"
              onPress={handleDelete}
            >
              {texts.deleteButton}
            </Button>
            <Button color="primary" radius="sm" onPress={handleEdit}>
              {texts.editButton}
            </Button>
          </div>
        </div>
      ) : (
        <button
          className="p-6 border-2 border-dashed border-[#5e5e5e] w-full"
          onClick={handleAdd}
        >
          <p className="flex items-center gap-2 justify-center">
            <span>+</span>
            <span>{texts.addButton}</span>
          </p>
        </button>
      )}

      <FormModal
        fields={fields}
        formData={currentRowData}
        isOpen={modalType === "add" || modalType === "edit"}
        title={modalType === "add" ? texts.modalAddTitle : texts.modalEditTitle}
        onChange={setCurrentRowData}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
        onSave={handleSave}
      />

      <ConfirmModal
        content={texts.deleteConfirm}
        isOpen={modalType === "delete"}
        onConfirm={async () => {
          await handleSave();
        }}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />
    </>
  );
}
