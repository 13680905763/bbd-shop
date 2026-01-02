"use client";
import { useEffect, useState } from "react";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { useTranslations } from "next-intl";

import { AddressItem } from "@/types";
import BillingAddressModal from "@/components/modal/billing-address-modal";

type ModalType = "add" | "edit" | null;

export default function BillingAddress({ billingAddress }: any) {
  const t = useTranslations("PayOrder");

  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentRowData, setCurrentRowData] = useState<any>(null);

  const handleAdd = () => {
    setModalType("add");
  };

  const handleEdit = () => {
    setModalType("edit");
  };

  useEffect(() => {
    setCurrentRowData(billingAddress);
  }, [billingAddress]);

  return (
    <>
      {Object.keys(billingAddress as AddressItem).length ? (
        <div className="relative p-4 border-2 border-dashed border-[#5e5e5e] rounded-xl">
          <div className="flex justify-between">
            <div className="flex gap-8">
              <div className="text-title">{billingAddress?.recipient}</div>
              <div>{billingAddress?.phone}</div>
            </div>
            <div>{billingAddress?.postcode}</div>
          </div>
          <div className="text-gray-base mt-2">
            {billingAddress?.address},{billingAddress?.city},
            {billingAddress?.state},{billingAddress?.country}
          </div>

          {/* 编辑按钮放在右下角 */}
          <button
            className="absolute bottom-2 right-4 flex items-center gap-1 text-sm text-[#f0700c]  transition"
            onClick={handleEdit}
          >
            <AiOutlineEdit className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          className="p-6 border-2 border-dashed border-[#5e5e5e] w-full"
          onClick={handleAdd}
        >
          <p className="flex items-center gap-2 justify-center text-xl">+</p>
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
    </>
  );
}
