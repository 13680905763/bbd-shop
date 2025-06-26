"use client";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import React from "react";

import { FieldConfig } from "@/components/form/formItem-renderer";
import { useAddressList } from "@/hook/addresses/useAddressList";
import { addAddress, deleteAddress, updateAddress } from "@/services/address";
import FormModal from "@/components/modal/form-modal";
import ConfirmModal from "@/components/modal/confirm-modal";

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
};

export default function AddressTab() {
  const { data, isLoading, isError, mutate } = useAddressList(2);
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
    console.log("当前行数据:", currentRowData);
    if (modalType === "add") {
      await addAddress({ ...currentRowData, addressType: 2 }); // 新增接口
    } else if (modalType === "edit") {
      await updateAddress(currentRowData); // 编辑接口
    } else if (modalType === "delete") {
      await deleteAddress(currentRowData.id);
    }
    mutate();
    setModalType(null);
  };

  useEffect(() => {
    console.log(data);
    setCurrentRowData(data?.[0]);
    console.log("currentRowData", currentRowData);
  }, [data]);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>加载失败</div>;

  return (
    <>
      {data?.length ? (
        <div>
          <div className="p-4 border-2 border-dashed border-[#5e5e5e]">
            <div className="flex justify-between ">
              <div className="flex gap-8">
                <div className="text-title">{data[0].recipient}123</div>
                <div>{data[0].phone}</div>
              </div>
              <div>{data[0].postcode}</div>
            </div>
            <div className="text-gray-base">
              {data[0].address},{data[0].city},{data[0].state},{data[0].country}
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
