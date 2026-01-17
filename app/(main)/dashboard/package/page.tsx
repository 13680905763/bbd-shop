"use client";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoCloseCircleOutline, IoSwapHorizontalOutline } from "react-icons/io5";

import PackageItem from "./package-item";

import PaginationBar from "@/components/common/pagination-bar";
import { usePackageList } from "@/hook";
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
import CommonModal from "@/components/modal/common-modal";
import { queryClient } from "@/lib/react-query";
import { useGlobalStore } from "@/store";
import RouteCard from "@/components/common/route-card";
import { useSelection } from "@/hook/common";
import { useConfirm } from "@/components/common/modal/confirm-provider";
import { BusinessProgress } from "@/components/ui";

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
export default function WarehousePage() {
  const t = useTranslations("dashboard.package");
  const { currency } = useGlobalStore();
  const [activeTab, setActiveTab] =
    useState<keyof typeof tabKeyToStatusCode>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const { data, isLoading, isFetching } = usePackageList(
    page,
    pageSize,
    tabKeyToStatusCode[activeTab],
  ) as any;

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
  const handlePackageSubmit = async () => {
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

  const PackageTabContent = ({ packList }: { packList: any[] }) => {
    if (isLoading)
      return <Spinner className="flex h-[70vh] flex-col items-center" />;
    if (!packList?.length)
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-lg text-gray-500">
          {t("noTracking")}
        </div>
      );
    if (isFetching)
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <div className="text-lg mb-2">
            <Spinner />
          </div>
        </div>
      );

    return (
      <>
        <div className="flex flex-col gap-3">
          {packList.map((p: any) => (
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
        <div className="mt-10 sticky bottom-0 border-t bg-white z-10 p-4 card-cart">
          {activeTab == "pay" && (
            <div className="flex justify-between items-center gap-4">
              <Checkbox isSelected={isAllSelected} onChange={onToggleSelectAll}>
                {t("selectAll")}
              </Checkbox>
              <Button
                className="w-[200px]"
                color="primary"
                isDisabled={!hasSelected}
                size="lg"
                onPress={handlePackageSubmit}
              >
                {t("batchPay")}
              </Button>
            </div>
          )}
          {(data?.total as number) > 0 && (
            <PaginationBar
              page={page}
              pageSize={pageSize}
              total={data?.total as number}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>
      </>
    );
  };

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
          <PackageTabContent packList={data?.records || []} />
        </Tab>

        <Tab key="pay" title={t("tabs.pay")}>
          <PackageTabContent packList={data?.records || []} />
        </Tab>

        <Tab key="shipping" title={t("tabs.shipping")}>
          <PackageTabContent packList={data?.records || []} />
        </Tab>

        <Tab key="receivded" title={t("tabs.receivded")}>
          <PackageTabContent packList={data?.records || []} />
        </Tab>
      </Tabs>
      {/* 取消弹窗 */}
      {modal.type === "cancel" && (
        <CommonModal
          isOpen
          footer={<div />}
          title={t("cancelModal.title")}
          onOpenChange={() => setModal({ type: null })}
        >
          <div className="flex justify-center gap-6 py-6">
            <Card
              isPressable
              className="w-52 rounded-2xl border border-gray-200 shadow-sm transition-all duration-200 hover:border-red-500 hover:bg-red-50"
              onPress={() => {
                setModal({ ...modal, isCancelling: true });
                if (modal.confirm) modal.confirm();
              }}
            >
              <CardBody className="flex flex-col items-center justify-between space-y-3 px-3 py-4 text-center">
                <div className="flex flex-col items-center space-y-1">
                  {modal?.isCancelling ? (
                    <Spinner color="danger" size="lg" />
                  ) : (
                    <IoCloseCircleOutline className="h-10 w-10 text-red-500" />
                  )}
                  <p
                    className={`text-base font-semibold ${
                      modal?.isCancelling ? "text-gray-500" : "text-red-600"
                    }`}
                  >
                    {modal?.isCancelling
                      ? t("cancelModal.cancelCard.submittingTitle")
                      : t("cancelModal.cancelCard.title")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {modal?.isCancelling
                      ? t("cancelModal.cancelCard.submittingSubtitle")
                      : t("cancelModal.cancelCard.subtitle")}
                  </p>
                </div>

                {/* 下半部分：费用明细 */}
                <div className="w-full rounded-xl border-t border-gray-100 bg-white pt-2 text-sm text-gray-700">
                  <div className="flex justify-between px-2 py-1">
                    <span>{t("cancelModal.cancelCard.serviceFee")}</span>
                    <span>
                      {currency.symbol}
                      {modal?.cancelPre?.serviceFee ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between px-2 py-1">
                    <span>{t("cancelModal.cancelCard.packingFee")}</span>
                    <span>
                      {currency.symbol}
                      {modal?.cancelPre?.packingFee ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between px-2 py-1 font-semibold text-red-600">
                    <span>{t("cancelModal.cancelCard.totalFee")}</span>
                    <span>
                      {currency.symbol}
                      {modal?.cancelPre?.totalFee ?? 0}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* 更换路线 */}
            {modal?.currentPackage?.changeFlag && (
              <Card
                isPressable
                className="h-auto w-48 border border-gray-200 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
                onPress={async () => {
                  if (modal?.isCancelling) return;
                  setModal({ ...modal, isUpdatingRoute: true });
                  await openChangeLineModal(modal?.currentPackage);
                }}
              >
                <CardBody className="flex flex-col items-center justify-center text-center">
                  {modal?.isUpdatingRoute ? (
                    <Spinner color="danger" size="lg" />
                  ) : (
                    <IoSwapHorizontalOutline className="h-8 w-8 text-blue-500" />
                  )}

                  <p className="text-lg font-semibold text-blue-600">
                    {t("cancelModal.changeRouteCard.title")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("cancelModal.changeRouteCard.subtitle")}
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </CommonModal>
      )}
      {/* 跟换路线弹窗 */}
      {modal.type === "changeLine" && (
        <CommonModal
          isOpen
          size={"4xl"}
          title={t("changeTitle")}
          onConfirm={handleChangeLine}
          onOpenChange={() => setModal({ type: null })}
        >
          {/* 路线 */}
          <div className="flex flex-col gap-2">
            {modal?.linePre?.map((route: any) => (
              <RouteCard
                key={route.id}
                data={route}
                isSelected={route?.checked}
                onSelect={(id: any) =>
                  setModal({
                    ...modal,
                    linePre: modal?.linePre?.map((item: any) => {
                      return {
                        ...item,
                        checked: id == item?.id ? true : false,
                      };
                    }),
                  })
                }
              />
            ))}
          </div>
        </CommonModal>
      )}
      {modal.type === "line" && (
        <CommonModal
          isOpen
          footer={<div />}
          size="4xl"
          title={t("lineModal.title")}
          onOpenChange={() => setModal({ type: null })}
        >
          {/* 滚动区域 */}
          <div className="max-h-[60vh] space-y-8 overflow-y-auto pr-2">
            {/* ========== 主运单基本信息 ========== */}
            <div className="space-y-2 rounded-xl border bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                {t("lineModal.waybillNumber")}
                <span className="font-medium text-gray-800">
                  {modal?.lineDetails?.trackingNumber}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                {t("lineModal.currentStatus")}
                <span className="font-medium text-[#f0700c]">
                  {modal?.lineDetails?.statusName}
                </span>
              </p>
            </div>

            {/* ========== 主运单时间线 ========== */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                {t("lineModal.mainTimeline")}
              </h3>

              <div className="relative pl-6">
                {/* 竖线 */}
                <div className="absolute bottom-0 left-2 top-0 w-[2px] bg-gray-200" />

                {modal?.lineDetails?.trackItems?.map(
                  (item: any, index: number) => (
                    <div key={index} className="relative mb-6 flex items-start">
                      {/* 时间线圆点 */}
                      <div className="absolute left-0 mt-1 h-3 w-3 rounded-full bg-[#f0700c] shadow" />

                      <div className="ml-6">
                        <p className="text-sm font-medium text-gray-800">
                          {item.content}
                        </p>

                        {item.location && (
                          <p className="mt-1 text-xs text-gray-500">
                            {t("lineModal.location")}
                            {item.location}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-gray-400">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* ========== 多个子运单（如果存在） ========== */}
            {Array.isArray(modal?.lineDetails?.subOrderList) &&
              modal?.lineDetails.subOrderList.length > 0 &&
              modal?.lineDetails.subOrderList.map((sub: any) => (
                <div key={sub}>
                  <h3 className="mb-4 text-lg font-semibold">
                    {t("lineModal.subWaybillTitle")}
                    {sub}
                  </h3>

                  <div className="relative pl-6">
                    <div className="absolute bottom-0 left-2 top-0 w-[2px] bg-gray-200" />

                    {modal?.lineDetails.subOrderTrackItems?.[sub]?.map(
                      (item: any, idx: number) => (
                        <div
                          key={idx}
                          className="relative mb-6 flex items-start"
                        >
                          <div className="absolute left-0 mt-1 h-3 w-3 rounded-full bg-green-500 shadow" />

                          <div className="ml-6">
                            <p className="text-sm font-medium text-gray-800">
                              {item.content}
                            </p>

                            {item.location && (
                              <p className="mt-1 text-xs text-gray-500">
                                {t("lineModal.location")}
                                {item.location}
                              </p>
                            )}

                            <p className="mt-1 text-xs text-gray-400">
                              {item.time}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CommonModal>
      )}
    </div>
  );
}
