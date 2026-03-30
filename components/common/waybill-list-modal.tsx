import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image } from "@heroui/react";
import { useTranslations } from "next-intl";

import PaginationBar from "./pagination-bar";
import { useChatWaybillList } from "@/hook/api";
import { BlockSpinner, EmptyState } from "../ui";
import { useGlobalStore } from "@/store";

interface WaybillListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendWaybill: (waybill: any) => void;
}

export default function WaybillListModal({ isOpen, onClose, onSendWaybill }: WaybillListModalProps) {
  const t = useTranslations("components.chatbox");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isFetching } = useChatWaybillList({
    current: page,
    size: pageSize,
  });

  const waybills = data?.records || [];

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} scrollBehavior="inside" size="2xl">
      <ModalContent>
        <ModalHeader>{t("selectWaybill")}</ModalHeader>
        <ModalBody className="max-h-[60vh] overflow-y-auto">
          {isFetching && <BlockSpinner />}
          {waybills.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-4">
              {waybills.map((waybill: any) => (
                <div key={waybill.packingPackageCode} className="border rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {t("waybillNo")}
                        {waybill.packingPackageCode}
                      </span>
                      {waybill.shippingCode && (
                        <span className="text-xs text-gray-500">
                          {t("trackingNo")}
                          {waybill.shippingCode}
                        </span>
                      )}
                    </div>
                    <Button size="sm" color="primary" onPress={() => onSendWaybill(waybill)}>
                      {t("send")}
                    </Button>
                  </div>
                  {waybill.pic && waybill.pic.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar flex-wrap">
                      {waybill.pic.map((url: string, index: number) => (
                        <Image
                          key={index}
                          src={url}
                          referrerPolicy="no-referrer"
                          alt="waybill pic"
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                    <div>{t("weight")}: {waybill.weight}g</div>
                    <div>{t("size")}: {waybill.length}*{waybill.width}*{waybill.height}cm</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex flex-col items-stretch gap-4">
          <div className="flex justify-end w-full">
            {waybills.length > 0 && (
              <PaginationBar
                page={page}
                pageSize={pageSize}
                total={data?.total as number || 0}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            )}
          </div>
          <div className="flex justify-end w-full">
            <Button color="danger" variant="light" onPress={onClose}>
              {t("close")}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}