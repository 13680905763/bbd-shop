"use client";
import {
  Button,
  Checkbox,
  Tab,
  Tabs,
} from "@heroui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import PackageItem from "./package-item";
import CancelModal from "./cancel-modal";
import ChangeLineModal from "./change-line-modal";
import LineDetailModal from "./line-detail-modal";
import EditPackageModal from "./edit-package-modal";
import ChangeAddressModal from "./change-address-modal";

import PaginationBar from "@/components/common/pagination-bar";
import { useBatchPay, useCancelWaybill, useChangeLine, usePreviewCancel, usePreviewChangeLine, useReceipt, useTrackDetail, useWaybillList, useWithdrawCancel, useChangeAddress } from "@/hook/api";

import { useSelection } from "@/hook/common";
import { useConfirm } from "@/components/common/modal/confirm-provider";
import { BlockSpinner, BusinessProgress, EmptyState, FullscreenLoader } from "@/components/ui";

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  pay: "203",
  shipping: "205",
  receivded: "206",
};

type ModalType = "cancel" | "revoke" | "changeLine" | "line" | "receipt" | "edit" | "changeAddress" | null;

export default function PackagePage() {
  const t = useTranslations("dashboard.package");
  const [activeTab, setActiveTab] =
    useState<keyof typeof tabKeyToStatusCode>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading, isFetching } = useWaybillList({
    current: page,
    size: pageSize,
    statusCode: tabKeyToStatusCode[activeTab],
  });
  const { mutateAsync: batchPay, isPending: isBatchPaying } = useBatchPay();
  const { mutateAsync: previewCancel, isPending: isUpdatingRoute } = usePreviewCancel();
  const { mutateAsync: withdrawCancel, isPending: isWithdrawCancelling } = useWithdrawCancel();
  const { mutateAsync: cancelWaybill, isPending: isCancelling } = useCancelWaybill();
  const { mutateAsync: previewChangeLine, isPending: isPreviewChangingLine } = usePreviewChangeLine();
  const { mutateAsync: changeLine, isPending: isChangingLine } = useChangeLine();
  const { mutateAsync: changeAddress, isPending: isChangingAddress } = useChangeAddress();
  const { mutateAsync: trackDetail, isPending: isTracking } = useTrackDetail();
  const { mutateAsync: receipt, isPending: isReceipting } = useReceipt();

  const router = useRouter();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentWaybill, setCurrentWaybill] = useState<any>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const { confirm } = useConfirm();

  const {
    selectedIds,
    isSelected,
    hasSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
  } = useSelection(data?.records || [], { idKey: "packingPackageCode" });

  // 打开取消弹窗
  const onCancel = async (waybill: any) => {
    const res = await previewCancel({ id: waybill?.id });
    setCurrentWaybill({ ...waybill, cancelPre: res });
    setModalType("cancel");
  };
  const handleCancel = async (waybillId: string) => {
    try {
      const bizCode = await cancelWaybill(waybillId);
      if (bizCode) router.push("/payment/" + bizCode);
    } catch {
    } finally {
      setModalType(null);
    }
  };

  // 打开编辑弹窗（选择 修改路线 或 修改地址）
  const onEdit = (waybill: any) => {
    setCurrentWaybill(waybill);
    setModalType("edit");
  };

  // 打开更换路线弹窗
  const onChangeLine = async (waybill: any) => {
    const res = await previewChangeLine({ id: waybill.id });
    setSelectedRouteId(res.find((i: any) => i.id == waybill?.shipping?.templateId)?.id || null);
    setCurrentWaybill({ ...waybill, changePre: res });
    setModalType("changeLine");
  };
  const handleChangeLine = async (waybillId: string, routeId: string | null) => {
    await changeLine({
      id: waybillId,
      templateId: routeId,
    });
    setModalType(null);
  };
  // 打开修改地址弹窗
  const onChangeAddress = async (waybill: any) => {
    // 关闭编辑弹窗，打开地址选择弹窗
    setModalType("changeAddress");
  };
  // 提交修改地址
  const handleChangeAddress = async (data: { customerAddressId: string, routeId?: string, remark?: string }) => {
    if (!currentWaybill) return;
    return await changeAddress({
      id: currentWaybill.id,
      customerAddressId: data.customerAddressId,
      templateId: data.routeId, // 假设后端接口接收 templateId 作为路线ID
      remark: data.remark
    });
  };

  // 打开撤销退款弹窗
  const onRevoke = (waybillId: string) => {
    confirm({
      title: t("withdrawTitle"),
      content: t("withdrawContent"),
      onConfirm: async () => {
        await withdrawCancel(waybillId);
        setModalType(null);
      },
    });
  };
  // 打开路线详情弹窗
  const onTrack = async (pack: any) => {
    const res = await trackDetail({
      serverCode: pack?.shipping?.serverCode,
      shippingCode: pack?.shipping?.shippingCode,
    });
    setCurrentWaybill({ ...pack, trackDetail: res });
    setModalType("line");
  };
  // 打开收货弹窗
  const onReceipt = (packageId: string) => {
    confirm({
      title: t("receiptTitle"),
      content: t("receiptContent"),
      onConfirm: async () => {
        await receipt(packageId);
        setModalType(null);
      },
    });
  };
  // 批量支付/单独支付
  const handleBatchPay = async (waybillIds: string[] = []) => {
    const bizCode = await batchPay({ packageSet: waybillIds });
    if (bizCode) router.push(`/payment/${bizCode}`);
  };

  const renderWaybillTabContent = () => {
    if (!data?.records?.length) return <EmptyState />;
    return (
      <div className="relative">
        {(isFetching) && <BlockSpinner />}
        <div className="space-y-3 relative">
          {data.records.map((waybill: any) => (
            <PackageItem
              key={waybill.packingPackageCode}
              showCheckbox={activeTab === "pay"}
              pack={waybill}
              onCancel={onCancel}
              isSelected={isSelected}
              onChange={onSelect}
              onEdit={onEdit} //编辑
              onPay={handleBatchPay} //支付
              onRevoke={onRevoke} //撤回取消包裹
              onTrack={onTrack} //物流详情
              onReceipt={onReceipt} //收货
            />
          ))}
        </div>
        <div className="mt-10 sticky bottom-0 z-10 border-t bg-white p-4 border border-gray-200 rounded-lg">
          {activeTab === "pay" && (
            <div className="flex items-center justify-between">
              <Checkbox isSelected={isAllSelected} onChange={onToggleSelectAll}>
                {t("selectAll")}
              </Checkbox>
              <Button
                className="w-[200px]"
                color="primary"
                isDisabled={!hasSelected}
                isLoading={isBatchPaying}
                size="lg"
                onPress={() => handleBatchPay(selectedIds)}
              >
                {t("batchPay")}
                {selectedIds.length ? ` (${selectedIds.length})` : ""}
              </Button>
            </div>
          )}
          <PaginationBar
            page={page}
            pageSize={pageSize}
            total={data.total as number}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    );
  };
  if (isLoading) return <FullscreenLoader />;
  return (
    <div className="flex w-full flex-col">
      <div className="mt-5">
        <BusinessProgress currentStep={3} />
      </div>
      <Tabs
        aria-label="Options"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 ",
          cursor: "w-full bg-[#f0700c]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#f0700c]",
        }}
        color="primary"
        variant="underlined"
        onSelectionChange={(key) => {
          const k = String(key) as keyof typeof tabKeyToStatusCode;
          setActiveTab(k);
          setPage(1);
          setPageSize(k === "submit" ? 100 : 10);
        }}
      >
        <Tab key="all" title={t("tabs.all")}>
          {renderWaybillTabContent()}
        </Tab>
        <Tab key="pay" title={t("tabs.pay")}>
          {renderWaybillTabContent()}
        </Tab>
        <Tab key="shipping" title={t("tabs.shipping")}>
          {renderWaybillTabContent()}
        </Tab>
        <Tab key="receivded" title={t("tabs.receivded")}>
          {renderWaybillTabContent()}
        </Tab>
      </Tabs>
      <CancelModal
        currentWaybill={currentWaybill}
        isOpen={modalType === "cancel"}
        onClose={() => setModalType(null)}
        onConfirm={handleCancel}
        isCancelling={isCancelling}
      />
      <EditPackageModal
        isOpen={modalType === "edit"}
        currentWaybill={currentWaybill}
        onClose={() => setModalType(null)}
        onChangeRoute={onChangeLine}
        onChangeAddress={onChangeAddress}
      />
      <ChangeAddressModal
        isOpen={modalType === "changeAddress"}
        onClose={() => setModalType(null)}
        onConfirm={handleChangeAddress}
        currentAddressId={currentWaybill?.shipping?.addressId}
        waybillId={currentWaybill?.id}
      />
      <ChangeLineModal
        isOpen={modalType === "changeLine"}
        currentWaybill={currentWaybill}
        onClose={() => setModalType(null)}
        onConfirm={handleChangeLine}
        selectedRouteId={selectedRouteId}
        setSelectedRouteId={setSelectedRouteId}
      />
      <LineDetailModal
        isOpen={modalType === "line"}
        currentWaybill={currentWaybill}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}
