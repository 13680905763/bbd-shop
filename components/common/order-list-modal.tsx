import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";

import { request } from "@/services/request";
import PaginationBar from "./pagination-bar";
import { useChatOrderList } from "@/hook/api";
import { BlockSpinner, EmptyState } from "../ui";

interface OrderListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendOrder: (order: any) => void;
}

export default function OrderListModal({ isOpen, onClose, onSendOrder }: OrderListModalProps) {
  const t = useTranslations("components.chatbox");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isFetching } = useChatOrderList({
    current: page,
    size: pageSize,
  });

  const orders = data?.records || [];


  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} scrollBehavior="inside" size="2xl">
      <ModalContent>
        <ModalHeader>{t("selectOrder")}</ModalHeader>
        <ModalBody className="max-h-[60vh] overflow-y-auto">
          {isFetching && <BlockSpinner />}
          {orders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order: any) => (
                <div key={order.orderCode} className="border rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-sm">{t("orderNo")}{order.orderCode}</span>
                    <Button size="sm" color="primary" onPress={() => onSendOrder(order)}>
                      {t("send")}
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    {order.products?.map((product: any, idx: number) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <img src={product.picUrl} alt="product" className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1 text-sm">
                          <div className="line-clamp-2">{product.productTitle}</div>
                          <div className="text-gray-500 mt-1">
                            {t("price")}{product.price} x {product.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex flex-col items-stretch gap-4">
          <div className="flex justify-end w-full">
            {
              orders.length > 0 && (
                <PaginationBar
                  page={page}
                  pageSize={pageSize}
                  total={data?.total as number || 0}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              )
            }
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
