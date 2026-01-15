"use client";
import {
  Button,

} from "@heroui/react";
import { useCallback, useState } from "react";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { deleteAddress } from "@/services/address";
import { useAddressList } from "@/hook";
import {FullscreenLoader} from "@/components/ui";
import AddressModal from "@/components/modal/address-modal";
import { useConfirm } from "@/components/common/modal/confirm-provider";
import { Address, AddressModalState } from "@/types";
import AddressItem from "@/components/block/address-item";
import { queryClient } from "@/lib/react-query";


export function AddressTab() {
  const t = useTranslations("dashboard.page.address");
  const [modalState, setModalState] = useState<AddressModalState>({
    type: null,
  });
  const { data: addressList, isLoading } = useAddressList();
  const { confirm } = useConfirm();

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    },
  });

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setModalState({ type: null });
  }, []);

  const handleAddClick = useCallback(() => {
    setModalState({ type: "add" });
  }, []);
  const handleEditClick = useCallback((address: Address) => {
    setModalState({ type: "edit", address });
  }, []);
  const handleDeleteClick = useCallback(async (address: Address) => {
    if (!address) return;
    await confirm({
      content: t("deleteConfirm"),
      onConfirm: async () => {
        await deleteMutation.mutateAsync({ id: address.id });
      }
    });
  }, []);

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <Button
        color="primary"
        size="sm"
        className="mb-2"
        onPress={handleAddClick}
      >
        {t("add")}
      </Button>
      <div className="flex-1 overflow-auto space-y-2">
        {addressList?.map((addressDetail: Address) => (
          <AddressItem
            key={addressDetail.id}
            addressDetail={addressDetail}
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
          />
        ))}
      </div>
      <AddressModal
        defaultData={
          modalState.type === "edit" ? modalState.address : undefined
        }
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        type={modalState.type === "add" ? "add" : "edit"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
