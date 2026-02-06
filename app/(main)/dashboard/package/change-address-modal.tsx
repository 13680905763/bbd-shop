import React, { useState, useEffect } from "react";
import { Textarea } from "@heroui/react";
import { useTranslations } from "next-intl";

import { useAddressList } from "@/hook";
import { Address } from "@/types";
import { BlockSpinner } from "@/components/ui";
import AddressItem from "@/components/block/address-item";
import { usePreviewChangeLine } from "@/hook/api";
import RouteCard from "@/components/common/route-card";
import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";
import AddressModal from "@/components/modal/address-modal";
import { AddAddress } from "@/components/block";

interface ChangeAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { customerAddressId: string, routeId?: string, remark?: string }) => Promise<any>;
  currentAddressId?: string;
  waybillId: string;
}

export default function ChangeAddressModal({
  isOpen,
  onClose,
  onConfirm,
  currentAddressId,
  waybillId,
}: ChangeAddressModalProps) {
  const t = useTranslations("dashboard.package");
  const { currency } = useGlobalStore();
  const { data: addressList, isLoading: isAddressLoading } = useAddressList();
  const [selectedAddressId, setSelectedAddressId] = useState<string>(currentAddressId || "");
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [remark, setRemark] = useState("");
  const [routeList, setRouteList] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<{ type: "success" | "warning" | "info", text: string } | null>(null);

  // 地址编辑/新增弹窗状态
  const [addressModalState, setAddressModalState] = useState<{
    isOpen: boolean;
    type: "add" | "edit";
    data?: Address;
  }>({
    isOpen: false,
    type: "add"
  });

  // 当选择地址变化时，重新获取路线
  useEffect(() => {
    if (selectedAddressId && isOpen) {
      fetchRoutes(selectedAddressId);
    }
  }, [selectedAddressId, isOpen]);

  // 监听弹窗打开状态，关闭时重置数据
  useEffect(() => {
    if (isOpen) {
      setSelectedAddressId(currentAddressId || "");
      setSelectedRouteId("");
      setRemark("");
      setRouteList([]);
      setErrorMessage("");
      setResultMessage(null);
    }
  }, [isOpen, currentAddressId]);

  const { mutateAsync: previewChangeLine, isPending: isRouteLoading } = usePreviewChangeLine();

  const fetchRoutes = async (addressId: string) => {
    setErrorMessage("");
    setRouteList([]);
    try {
      const res = await previewChangeLine({ id: waybillId, addressId });

      if (typeof res === "string") {
        setErrorMessage(res);
        setRouteList([]);
      } else if (Array.isArray(res)) {
        setRouteList(res);
        // 如果有默认路线或推荐路线，可以自动选中
        if (res.length > 0) {
          setSelectedRouteId(res[0].id);
        } else {
          setSelectedRouteId("");
        }
      } else {
        setRouteList([]);
      }

    } catch (error) {
      console.error("Fetch routes failed", error);
      setRouteList([]);
    } finally {
    }
  };


  const handleConfirm = async () => {
    if (!selectedAddressId || !selectedRouteId) return;

    // 如果已经显示了结果，再次点击则关闭
    if (resultMessage) {
      onClose();
      return;
    }

    const res = await onConfirm({
      customerAddressId: selectedAddressId,
      routeId: selectedRouteId,
      remark
    });

    // 处理返回结果
    if (res) {
      // result: 0 运费不变 1 补运费 2 退运费
      const { result, difference } = res;
      const amount = `${currency.symbol}${difference || 0}`;

      if (result === 0) {
        setResultMessage({ type: "info", text: t("editModal.result.noChange") });
      } else if (result === 1) {
        setResultMessage({ type: "warning", text: t("editModal.result.payExtra", { amount }) });
      } else if (result === 2) {
        setResultMessage({ type: "success", text: t("editModal.result.refund", { amount }) });
      }
    } else {
      onClose();
    }
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id);
  }

  const handleEditAddress = (address: Address) => {
    setAddressModalState({
      isOpen: true,
      type: "edit",
      data: address
    });
  };

  const handleAddAddress = () => {
    setAddressModalState({
      isOpen: true,
      type: "add"
    });
  };

  return (
    <>
      <CommonModal
        isOpen={isOpen}
        onOpenChange={onClose}
        title={t("editModal.changeAddress")}
        size="4xl"
        onConfirm={handleConfirm}
        isDisabled={!selectedAddressId || !selectedRouteId}
      >
        <div className="flex flex-col gap-6 py-4">
          {resultMessage ? (
            <div className={`p-4 rounded-lg text-center border ${resultMessage.type === "success" ? "bg-green-50 text-green-700 border-green-200" :
              resultMessage.type === "warning" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                "bg-blue-50 text-blue-700 border-blue-200"
              }`}>
              {resultMessage.text}
            </div>
          ) : (
            <>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold">{t("editModal.addressTitle")}</div>
                </div>
                {isAddressLoading ? (
                  <BlockSpinner />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-1">
                    {addressList && addressList.length > 0 ? (
                      <>

                        {addressList.map((address: Address) => (
                          <AddressItem
                            key={address.id}
                            addressDetail={address}
                            selectable={true}
                            selected={selectedAddressId === address.id}
                            onSelect={handleAddressSelect}
                            onEdit={() => handleEditAddress(address)}
                            showDeleteButton={false}
                          />
                        ))}
                        <AddAddress type="address" onAdd={handleAddAddress} />
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500 col-span-2">
                        {t("editModal.noAddress")}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 路线选择 */}
              {selectedAddressId && (
                <div>
                  <div className="font-bold mb-2">{t("editModal.routeTitle")}</div>
                  {isRouteLoading ? (
                    <BlockSpinner />
                  ) : (
                    <div className="flex flex-col gap-2">
                      {errorMessage ? (
                        <div className="p-4 bg-red-50 text-red-500 rounded-lg text-center border border-red-100">
                          {errorMessage}
                        </div>
                      ) : routeList && routeList.length > 0 ? (
                        routeList.map((line: any) => (
                          <RouteCard
                            key={line.id}
                            data={line}
                            isSelected={line?.id == selectedRouteId}
                            onSelect={(id) => setSelectedRouteId(id)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 border border-dashed rounded-lg">
                          {t("editModal.noRoute")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 备注 */}
              <div>
                <div className="font-bold mb-2">{t("editModal.remarkTitle")}</div>
                <Textarea
                  placeholder={t("editModal.remarkPlaceholder")}
                  value={remark}
                  onValueChange={setRemark}
                />
              </div>
            </>
          )}
        </div>
      </CommonModal>

      {/* 地址编辑/新增弹窗 */}
      <AddressModal
        isOpen={addressModalState.isOpen}
        onOpenChange={(open) => setAddressModalState(prev => ({ ...prev, isOpen: open }))}
        type={addressModalState.type}
        defaultData={addressModalState.data}
      />
    </>
  );
}
