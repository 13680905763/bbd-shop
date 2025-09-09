"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  cn,
  Radio,
  RadioGroup,
  Image,
  Tooltip,
  useRadio,
  VisuallyHidden,
  RadioProps,
  addToast,
} from "@heroui/react";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { IoWallet } from "react-icons/io5";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import BillingAddress from "./billing-address";

import Progress from "@/components/common/order-progress";
import RechargeModal from "@/components/modal/recharge.modal";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { useBillingAddressStore, useWalletStore } from "@/store";
import { useBillingAddress, usePaymentMethodList } from "@/hook";
import { createPayOrder } from "@/services";
import { price } from "@/components/primitives";

// 自定义 Radio 组件
const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group w-full inline-flex items-center flex-row tap-highlight-transparent bg-white cursor-pointer border-1 border-default rounded-lg gap-4 p-4",
        "hover:bg-content2 active:opacity-50",
        "data-[selected=true]:border-primary",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()} className="flex-1">
        {children && <span {...getLabelProps()}>{children}</span>}
      </div>
    </Component>
  );
};

// 余额支付选项
const BalancePayment = ({ payment, wallet, onRecharge, t }: any) => (
  <CustomRadio value={payment.id}>
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        <IoWallet className="w-14 h-14 text-[#f0700c]" />
        <div>{t("balance")}</div>
        <div className={price({ size: "xl2" })}>
          ${wallet?.availabalBalance}
        </div>
      </div>
      <Button color="primary" onPress={onRecharge}>
        {t("recharge")}
      </Button>
    </div>
  </CustomRadio>
);

// 其他支付方式选项
const OtherPayment = ({ payment }: any) => (
  <Radio
    classNames={{
      base: cn(
        "inline-flex min-w-[100%] w-full bg-content1 m-0 mb-2 hover:bg-content2 items-center justify-start",
        "cursor-pointer rounded-lg gap-2 p-3 border-1",
        "data-[selected=true]:border-primary",
      ),
      labelWrapper: "w-full",
      label: "w-full",
    }}
    value={payment.id}
  >
    <div className="w-full flex items-center gap-3">
      <Image
        className="object-contain"
        height={60}
        src={payment.logoUrl}
        width={60}
      />
      <span className="text-sm font-semibold">{payment.payName}</span>
    </div>
  </Radio>
);

export default function SubmitOrder() {
  const t = useTranslations("PayOrder");
  const params = useParams<{ bizCode: string }>();
  const wallet = useWalletStore((state) => state.wallet);
  const billingAddress = useBillingAddressStore(
    (state) => state.billingAddress,
  );

  const [submitting, setSubmitting] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const { data, isLoading, isError } = usePaymentMethodList(params.bizCode);

  useBillingAddress();

  const handleCreatePayOrder = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (paymentId !== "1" && !billingAddress?.id) {
      addToast({
        title: t("addBillingAddress"),
        timeout: 1000,
        color: "danger",
      });
      setSubmitting(false);

      return;
    }

    try {
      const res = await createPayOrder({
        bizCode: params.bizCode,
        paymentId,
        addressId: billingAddress?.id as string,
      });

      if (typeof res === "string" && res.startsWith("http")) {
        window.location.href = res;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const currentPayMethod = useMemo(
    () =>
      data
        ?.flatMap((item: any) => item.paymentList)
        .find((p: any) => p.id === paymentId) ?? {},
    [data, paymentId],
  );

  // 排序：余额支付放前面
  const sortedData = useMemo(() => {
    if (!data) return [];
    const balance = data.filter((item: any) => item.methodName === "BALANCE");
    const others = data.filter((item: any) => item.methodName !== "BALANCE");

    return [...balance, ...others];
  }, [data]);

  useEffect(() => {
    if (sortedData.length) {
      const firstPayment = sortedData.flatMap(
        (item: any) => item.paymentList,
      )[0];

      if (firstPayment) setPaymentId(firstPayment.id);
    }
  }, [sortedData]);

  if (isLoading) return <FullscreenLoader />;
  if (isError) return <div>{t("loadFailed")}</div>;

  return (
    <div className="container mx-auto bg-white p-4">
      <Progress currentStep={1} />

      {paymentId !== "1" && (
        <div className="my-4">
          <p className="text-title">{t("billingAddress")}</p>
          <BillingAddress billingAddress={billingAddress} />
        </div>
      )}

      <RadioGroup
        classNames={{ base: "w-full" }}
        value={paymentId}
        onValueChange={setPaymentId}
      >
        {sortedData.map((item: any) => (
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
                  onRecharge={() => setIsRechargeOpen(true)}
                />
              ) : (
                <OtherPayment key={payment.id} payment={payment} />
              ),
            )}
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-end items-center p-4 gap-4 sticky bottom-0 bg-white z-10">
        <div className="text-[#3d3d3d] text-sm flex items-center gap-1">
          {t("payAmount")}
          <Tooltip
            className="bg-[#262626] text-white p-2 max-w-screen-sm"
            content={t("tooltipTip")}
          >
            <HiQuestionMarkCircle />
          </Tooltip>
          ：{currentPayMethod?.payAmount} {t("handlingFee")}：
          {currentPayMethod?.handlingFee}
        </div>
        <p className="text-price-xl">{currentPayMethod?.payAmount}</p>
        <Button
          className="w-[300px]"
          color="primary"
          isLoading={submitting}
          size="lg"
          onPress={handleCreatePayOrder}
        >
          {t("submitOrder")}
        </Button>
      </div>

      <RechargeModal isOpen={isRechargeOpen} onOpenChange={setIsRechargeOpen} />
    </div>
  );
}
