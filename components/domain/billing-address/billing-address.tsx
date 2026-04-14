"use client";
import { Divider } from "@heroui/react";
import { useMemo, useState } from "react";
import React from "react";
import { useTranslations } from "next-intl";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

import BillingAddressModal from "./billing-address-modal";

import { useBillingAddress, useDeleteAddress } from "@/hook/business";
import { formatFullCity, formatFullAddress } from "@/utils/address";
import { useConfirm } from "@/components/common/modal/confirm-provider";
import { AddAddress } from "@/components/block";

type ModalType = "add" | "edit" | null;

export function BillingAddress() {
  const t = useTranslations("dashboard.page.billingAddress");
  const { confirm } = useConfirm();
  const { data: billingAddress } = useBillingAddress();
  const [modalType, setModalType] = useState<ModalType>(null);
  const { mutateAsync: deleteMutation } = useDeleteAddress();

  const fullCity = useMemo(
    () => formatFullCity(billingAddress),
    [billingAddress],
  );
  const fullAddress = useMemo(
    () => formatFullAddress(billingAddress),
    [billingAddress],
  );

  console.log('useBillingAddress', billingAddress);


  const handleDelete = async () => {
    if (!billingAddress) return;

    await confirm({
      content: t("deleteConfirm"),
      onConfirm: async () => {
        await deleteMutation({ id: billingAddress.id });
      },
    });
  };

  return (
    <>
      {Object.keys(billingAddress)?.length ? (
        <div className="p-4 border-2 border-dashed border-gray-300 min-h-[120px] flex items-center justify-center">
          <div className="w-full">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-800">{billingAddress.recipient}</span>
              <span className="text-gray-600">{billingAddress.phone}</span>
            </div>
            <p className="text-gray-700">{fullCity}</p>
            <p className="text-gray-700">{fullAddress}</p>
            <Divider className="my-4" />
            <div className="flex justify-end gap-4">
              <button aria-label={t("deleteButton")} onClick={handleDelete}>
                <FaTrashAlt className="h-4 w-4" />
              </button>
              <button
                aria-label={t("editButton")}
                onClick={() => {
                  setModalType("edit");
                }}
              >
                <FaEdit className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <AddAddress
          type="billingAddress"
          onAdd={() => {
            setModalType("add");
          }}
        />
      )}

      {modalType && (
        <BillingAddressModal
          isOpen
          onOpenChange={(open) => {
            if (!open) setModalType(null);
          }}
        />
      )}
    </>
  );
}
