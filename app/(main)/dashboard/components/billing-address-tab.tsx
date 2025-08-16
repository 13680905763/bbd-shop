"use client";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import React from "react";

import { FieldConfig } from "@/components/form/formItem-renderer";
import FormModal from "@/components/modal/form-modal";
import ConfirmModal from "@/components/modal/confirm-modal";
import { addAddress, deleteAddress, updateAddress } from "@/services";
import { useBillingAddressStore } from "@/store";
import { AddressItem } from "@/types";
import { queryClient } from "@/lib/react-query";

const fieldsaddress: FieldConfig[] = [
  {
    type: "input",
    name: "recipient",
    label: "收件人",
    placeholder: "请输入收件人姓名",
  },
  {
    type: "input",
    name: "phone",
    label: "联系方式",
    placeholder: "请输入联系方式",
  },
  {
    type: "area",
    name: "area",
    label: "area",
    placeholder: "area",
  },

  {
    type: "input",
    name: "address",
    label: "详细地址",
    placeholder: "请输入您详细地址",
  },
  {
    type: "input",
    name: "doorNo",
    label: "门牌号",
    placeholder: "请输入您的门牌号",
  },
  {
    type: "input",
    name: "postcode",
    label: "邮编",
    placeholder: "请输入邮编",
  },
];

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

export default function AddressTab() {
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
        await updateAddress(filteredData); // 编辑接口
      } else if (modalType === "delete") {
        await deleteAddress(currentRowData.id);
      }
      setModalType(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      console.log(123);

      queryClient.invalidateQueries({ queryKey: ["billingAddress"] }); // 手动刷新
    }
  };

  useEffect(() => {
    setCurrentRowData(billingAddress);
    console.log("currentRowData", currentRowData);
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
              删除账单地址
            </Button>
            <Button color="primary" radius="sm" onPress={handleEdit}>
              修改账单地址
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
            <span>添加账单地址</span>
          </p>
        </button>
      )}

      <FormModal
        fields={fieldsaddress}
        formData={currentRowData}
        isOpen={modalType === "add" || modalType === "edit"}
        title={modalType === "add" ? "添加地址" : "编辑地址"}
        onChange={setCurrentRowData}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
        onSave={handleSave}
      />
      <ConfirmModal
        content={`确定要删除该地址吗？`}
        isOpen={modalType === "delete"}
        onConfirm={(close) => {
          handleSave();
          close();
        }}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />
    </>
  );
}
