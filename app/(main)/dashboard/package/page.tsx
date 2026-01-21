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

import PaginationBar from "@/components/common/pagination-bar";
import { useWaybillList } from "@/hook/api";
import {
  batchPayPackage,
  changePayPackage,
  changePrePayPackage,
  ReceiptPackage,
  refundPayPackage,
  refundPrePayPackage,
  routePackage,
  withdrawPayPackage,
} from "@/services";
import { queryClient } from "@/lib/react-query";
import { useSelection } from "@/hook/common";
import { useConfirm } from "@/components/common/modal/confirm-provider";
import { BlockSpinner, BusinessProgress, EmptyState, FullscreenLoader } from "@/components/ui";

const tabKeyToStatusCode: Record<string, string> = {
  all: "",
  pay: "203",
  shipping: "205",
  receivded: "206",
};

type ModalType = "cancel" | "revoke" | "changeLine" | "line" | "receipt" | null;
interface ModalState {
  type: ModalType;
  confirm?: () => Promise<void>;
  order?: any; // 退款 modal 可能需要 order 数据
  currentPackage?: any; // 退款 modal 选中商品信息
  cancelPre?: any; //取消预览
  linePre?: any; //路线预览
  lineDetails?: any; //路线详情
  isCancelling?: boolean;
  isUpdatingRoute?: boolean;
}
export default function PackagePage() {
  const t = useTranslations("dashboard.package");
  const [activeTab, setActiveTab] =
    useState<keyof typeof tabKeyToStatusCode>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const { data, isLoading, isFetching } = useWaybillList({
    current: page,
    size: pageSize,
    statusCode: tabKeyToStatusCode[activeTab],
  });

  const router = useRouter();

  const [modal, setModal] = useState<ModalState>({ type: null });
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
  const openCancelModal = async (currentPackage: any) => {
    const res = await refundPrePayPackage(currentPackage?.id);

    setModal({
      type: "cancel",
      confirm: async () => {
        try {
          const bizCode = await refundPayPackage(currentPackage?.id);

          if (bizCode) router.push("/payment/" + bizCode);
          await queryClient.invalidateQueries({ queryKey: ["packageList"] }); // 手动刷新
        } catch {
        } finally {
          setModal({ type: null });
        }
      },
      currentPackage,
      cancelPre: res,
    });
  };

  // 打开跟换路线弹窗
  const openChangeLineModal = async (currentPackage: any) => {
    const res = await changePrePayPackage(currentPackage.id);

    setModal({
      type: "changeLine",
      linePre: res.map((item: any) => {
        return {
          ...item,
          checked:
            item?.id == currentPackage?.shipping?.templateId ? true : false,
          packageId: currentPackage?.id,
        };
      }),
    });
  };
  // 提交跟换路线
  const handleChangeLine = async () => {
    const selected = modal.linePre.find((i: any) => i.checked);

    if (!selected) return;
    const payload = {
      id: selected.packageId,
      templateId: selected.id,
    };

    await changePayPackage(payload);
    await queryClient.invalidateQueries({ queryKey: ["packageList"] });
    setModal({ type: null });
  };
  // 打开路线详情弹窗
  const openLineModal = async (currentPackage: any) => {
    const res = await routePackage({
      serverCode: currentPackage?.shipping?.serverCode,
      shippingCode: currentPackage?.shipping?.shippingCode,
    });

    console.log("line", res);

    setModal({
      type: "line",
      confirm: async () => {
        setModal({ type: null });
      },
      lineDetails: res,
    });
  };
  // 打开撤销退款弹窗
  const openRevokeModal = (packageId: string) => {
    console.log(666);
    confirm({
      title: t("withdrawTitle"),
      content: t("withdrawContent"),
      onConfirm: async () => {
        // 调用后端撤销接口
        await withdrawPayPackage(packageId);
        queryClient.invalidateQueries({ queryKey: ["packageList"] });
        // setModal({ type: null });
      },
    });
  };
  // 打开收货弹窗
  const openReceiptModal = (packageId: string) => {
    confirm({
      title: t("receiptTitle"),
      content: t("receiptContent"),
      onConfirm: async () => {
        // 调用后端撤销接口
        await ReceiptPackage(packageId);
        await queryClient.invalidateQueries({ queryKey: ["packageList"] });
        setModal({ type: null });
      },
    });
  };
  // 批量支付
  const handleSubmit = async () => {
    if (isSubLoading) return;
    setIsSubLoading(true);
    try {
      const bizCode = await batchPayPackage({ packageSet: selectedIds });

      if (bizCode) {
        router.push(`/payment/${bizCode}`);
      }
    } catch {
    } finally {
      setIsSubLoading(false);
    }
  };


  const renderWaybillTabContent = () => {
    if (!data?.records?.length) return <EmptyState />;
    return (
      <div className="relative">
        {(isFetching) && <BlockSpinner />}
        <div className="space-y-3 relative">
          {data.records.map((p: any) => (
            <PackageItem
              key={p.packingPackageCode || p.outboundId}
              activeTab={activeTab}
              pack={p}
              selected={isSelected(p.packingPackageCode)}
              onCancelPackage={() => openCancelModal(p)} //取消包裹预览
              onChange={() => onSelect(p.packingPackageCode)}
              onChangePackageLine={() => openChangeLineModal(p)} //变更路线预览
              onLine={() => {
                openLineModal(p);
              }} // 路线详情
              onPayPackageRedirect={() => {
                router.push(`/payment/${p?.packingPackageCode}`);
              }} //支付
              onReceiptPackage={() => {
                openReceiptModal(p?.id);
              }} //收货
              onRevokePackage={() => openRevokeModal(p?.id)} //撤回取消包裹
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
                isLoading={isSubLoading}
                size="lg"
                onPress={handleSubmit}
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
          router.push(`/dashboard/package?tab=${key}`);
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
      {/* 取消弹窗 */}
      <CancelModal
        isOpen={modal.type === "cancel"}
        modalData={modal}
        onClose={() => setModal({ type: null })}
        onOpenChangeLine={async () => {
          await openChangeLineModal(modal?.currentPackage);
        }}
        setModalData={setModal}
      />
      {/* 更换路线弹窗 */}
      <ChangeLineModal
        isOpen={modal.type === "changeLine"}
        modalData={modal}
        onClose={() => setModal({ type: null })}
        onConfirm={handleChangeLine}
        setModalData={setModal}
      />
      {/* 路线详情弹窗 */}
      <LineDetailModal
        isOpen={modal.type === "line"}
        modalData={modal}
        onClose={() => setModal({ type: null })}
      />
    </div>
  );
}
