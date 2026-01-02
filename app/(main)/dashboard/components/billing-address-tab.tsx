"use client";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import React from "react";
import { useTranslations } from "next-intl";

import ConfirmModal from "@/components/modal/confirm-modal";
import { deleteAddress } from "@/services";
import { useBillingAddressStore } from "@/store";
import { AddressItem } from "@/types";
import { queryClient } from "@/lib/react-query";
import BillingAddressModal from "@/components/modal/billing-address-modal";

type ModalType = "add" | "edit" | "delete" | null;

export function BillingAddressTab() {
  const t = useTranslations("dashboard.page.billingAddress");

  const billingAddress = useBillingAddressStore(
    (state) => state.billingAddress,
  );

  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentRowData, setCurrentRowData] = useState<any>(null);

  const handleDelete = async () => {
    try {
      await deleteAddress({ id: currentRowData.id });
      setModalType(null);
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
              onPress={() => {
                setModalType("delete");
              }}
            >
              {t("deleteButton")}
            </Button>
            <Button
              color="primary"
              radius="sm"
              onPress={() => {
                setModalType("edit");
              }}
            >
              {t("editButton")}
            </Button>
          </div>
        </div>
      ) : (
        <button
          className="p-6 border-2 border-dashed border-[#5e5e5e] w-full"
          onClick={() => {
            setModalType("add");
          }}
        >
          <p className="flex items-center gap-2 justify-center">
            <span>+</span>
            <span>{t("addButton")}</span>
          </p>
        </button>
      )}

      <BillingAddressModal
        defaultData={currentRowData}
        isOpen={modalType === "add" || modalType === "edit"}
        type={modalType === "add" ? "add" : "edit"}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />

      <ConfirmModal
        content={t("deleteConfirm")}
        isOpen={modalType === "delete"}
        onConfirm={async () => {
          await handleDelete();
        }}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />
    </>
  );
}
