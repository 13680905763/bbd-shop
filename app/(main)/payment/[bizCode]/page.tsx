"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  RadioGroup,
  Tooltip,
  addToast,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { BalancePayment } from "./balance-payment";
import { OtherPayment } from "./other-payment";
import { CouponSelectionModal } from "./coupon-selection-modal";
import { CouponSelector } from "./coupon-selector";

import { BillingAddress } from "@/components/domain";
import {
  BlockSpinner,
  BusinessProgress,
  FullscreenLoader,
} from "@/components/ui";
import { usePaymentMethodList, useWalletInfo, usePay } from "@/hook/api";
import { useGlobalStore } from "@/store";
import { useBillingAddress } from "@/hook/business";

export default function PaymentPage() {
  const t = useTranslations("payment");
  const { currency } = useGlobalStore();
  const params = useParams<{ bizCode: string }>();

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [confirmedCouponId, setConfirmedCouponId] = useState<
    string | undefined
  >(undefined);
  const {
    isOpen: isPaypalWarningOpen,
    onOpen: onPaypalWarningOpen,
    onOpenChange: onPaypalWarningOpenChange,
  } = useDisclosure();
  const { data: wallet } = useWalletInfo();
  const { data: billingAddress } = useBillingAddress();

  const { data, isLoading, isFetching } = usePaymentMethodList({
    bizCode: params.bizCode,
    customerCouponId: confirmedCouponId,
  });
  const { pay, isPayFetching } = usePay();
  const paymentList = useMemo(() => data?.paymentAndFeeList || [], [data]);
  const couponList = useMemo(() => data?.customerCouponList || [], [data]);

  useEffect(() => {
    if (!paymentId && paymentList?.length > 0) {
      const firstPayment = paymentList[0]?.paymentList?.[0];

      if (firstPayment?.id) {
        setPaymentId(firstPayment.id);
      }
    }
  }, [paymentList, paymentId]);

  const handleCreatePayOrder = async () => {
    if (paymentId !== "1" && !billingAddress) {
      addToast({
        title: t("addBillingAddress"),
        timeout: 1000,
        color: "danger",
      });

      return;
    }
    try {
      await pay({
        bizCode: params.bizCode,
        paymentId,
        addressId: billingAddress?.id as string,
        customerCouponId: selectedCoupon?.id,
      });


    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmPayOrder = async () => {
    // Find if the selected payment method is PayPal
    const isPaypal = paymentList.some(
      (item: any) =>
        item.methodName === "PAYPAL" &&
        item.paymentList.some((p: any) => p.id === paymentId),
    );

    if (isPaypal) {
      onPaypalWarningOpen();

      return;
    }

    await handleCreatePayOrder();
  };
  const currentPayMethod = useMemo(
    () =>
      paymentList
        ?.flatMap((item: any) => item.paymentList)
        .find((p: any) => p.id === paymentId) ?? {},
    [paymentList, paymentId],
  );

  console.log("isFetching", isFetching);

  if (isLoading) return <FullscreenLoader />;

  return (
    <div className="container mx-auto bg-white p-4">
      <BusinessProgress currentStep={1} />
      {isFetching && <BlockSpinner />}
      <CouponSelector
        couponList={couponList}
        selectedCoupon={selectedCoupon}
        onOpenModal={() => setIsCouponModalOpen(true)}
      />

      <CouponSelectionModal
        couponList={couponList}
        isFetching={isFetching}
        isOpen={isCouponModalOpen}
        selectedCoupon={selectedCoupon}
        t={t}
        onConfirm={(coupon) => {
          setSelectedCoupon(coupon);
          setConfirmedCouponId(coupon?.id);
        }}
        onOpenChange={setIsCouponModalOpen}
      />

      {paymentId !== "1" && (
        <div className="my-4">
          <p className="text-title">{t("billingAddress")}</p>
          <BillingAddress />
        </div>
      )}

      <RadioGroup
        classNames={{ base: "w-full" }}
        value={paymentId}
        onValueChange={(v) => {
          setPaymentId(v);
        }}
      >
        {paymentList.map((item: any) => (
          <div
            key={item.methodName}
            className={
              item.methodName === "BALANCE"
                ? "bg-[#ffeee1] p-4 rounded-2xl mb-4"
                : "mb-4"
            }
          >
            <p className="text-title">{item.methodName}</p>
            {item.paymentList.map((payment: any) =>
              item.methodName === "BALANCE" ? (
                <BalancePayment
                  key={payment.id}
                  payment={payment}
                  t={t}
                  wallet={wallet}
                />
              ) : (
                <OtherPayment key={payment.id} payment={payment} />
              ),
            )}
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-end items-center p-4 gap-4 sticky bottom-0 bg-white z-10">
        <div className="text-[#3d3d3d] text-sm flex flex-col gap-1">
          {/* 支付总额标题 + Tooltip */}
          <div className="flex items-center gap-1">
            <span>{t("payAmount")}</span>
            <Tooltip
              className="bg-[#262626] text-white p-2 max-w-xs"
              content={t("tooltipTip")}
            >
              <HiQuestionMarkCircle className="w-4 h-4 cursor-pointer text-gray-500" />
            </Tooltip>
          </div>

          {/* 金额明细 */}
          <div className="flex flex-wrap gap-2">
            <span>
              {t("orderAmount")}:{" "}
              <strong>
                {currency.symbol}
                {currentPayMethod?.orderAmount}
              </strong>
            </span>
            <span>
              {t("fixedCost")}:{" "}
              <strong>
                {currency.symbol}
                {currentPayMethod?.fixedCost}
              </strong>
            </span>
            <span>
              {t("handlingFee")}:{" "}
              <strong>
                {currency.symbol}
                {currentPayMethod?.handlingFee}
              </strong>
            </span>
          </div>
        </div>
        <p className="text-price-xl">
          {currency.symbol}
          {currentPayMethod?.payAmount}
        </p>
        <Button
          className="w-[300px]"
          color="primary"
          isLoading={isPayFetching}
          size="lg"
          onPress={handleConfirmPayOrder}
        >
          {t("submitOrder")}
        </Button>
      </div>

      <Modal
        isOpen={isPaypalWarningOpen}
        onOpenChange={onPaypalWarningOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("paypalWarning.title")}
              </ModalHeader>
              <ModalBody>
                <p>{t("paypalWarning.content")}</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("paypalWarning.cancel")}
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    handleCreatePayOrder();
                  }}
                >
                  {t("paypalWarning.confirm")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
