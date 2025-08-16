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
import { useParams } from "next/navigation";
import { IoWallet } from "react-icons/io5";

import { price } from "@/components/primitives";
import Progress from "@/components/common/progress";
import { usePaymentMethodList } from "@/hook";
import RechargeModal from "@/components/modal/recharge.modal";
import CommonModal from "@/components/modal/common-modal";
import { createPayOrder, getPayOrderStatus } from "@/services";
import { useBillingAddressStore, useWalletStore } from "@/store";

const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    description,
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
        "group w-full inline-flex items-center hover:bg-content2  active:opacity-50  flex-row tap-highlight-transparent bg-white",
        " cursor-pointer border-1 border-default rounded-lg gap-4 p-4",
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

export default function SubmitOrder() {
  const params = useParams<{ bizCode: string }>();
  const wallet = useWalletStore((state) => state.wallet);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const { data, isLoading, isError } = usePaymentMethodList(params.bizCode);

  const billingAddress = useBillingAddressStore(
    (state) => state.billingAddress,
  );
  const hanldeCreatePayOrder = async () => {
    console.log("handleCreatePayOrder", paymentId);

    try {
      const url = await createPayOrder({
        bizCode: params.bizCode,
        paymentId,
        addressId: billingAddress?.id as string,
      });

      window.open(url, "_blank");
      setIsOpen1(true);
    } catch (error) {}
  };

  useEffect(() => {
    if (data) {
      console.log(6666, data[0]?.paymentList[0]?.id);

      setPaymentId(data[0]?.paymentList[0]?.id);
    }
  }, [data]);

  const currentPayMethod = useMemo(() => {
    return (
      data
        ?.flatMap((item: any) => item.paymentList)
        .find((item: any) => item.id === paymentId) ?? {}
    );
  }, [paymentId]);

  // console.log("currentPayMethod", currentPayMethod);

  if (isLoading) return <div>加载中...</div>;
  if (isError) return <div>加载失败</div>;

  return (
    <div className="container mx-auto bg-[#fff]  p-4 ">
      <div className="mt-5">
        <Progress
          currentStep={1}
          steps={["选择产品", "订单付款", "质检&仓库", "打包", "签收包裹"]}
        />
      </div>
      <div>
        <div className="my-4">
          <p className="text-title">账单地址</p>
          <div className="p-4 border-2 border-dashed border-[#5e5e5e]">
            <div className="flex justify-between ">
              <div className="flex gap-8">
                <div className="text-title">{billingAddress?.recipient}123</div>
                <div>{billingAddress?.phone}</div>
              </div>
              <div>{billingAddress?.postcode}</div>
            </div>
            <div className="text-gray-base">
              {billingAddress?.address},{billingAddress?.city},
              {billingAddress?.state},{billingAddress?.country}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <RadioGroup
            classNames={{
              base: "w-full",
            }}
            value={paymentId}
            onValueChange={(value) => {
              setPaymentId(value);
            }}
          >
            {data?.map((item: any) => {
              if (item.methodName !== "BALANCE") return null;

              return (
                <div
                  key={item.methodName}
                  className="bg-[#ffeee1] p-4 rounded-2xl"
                >
                  <p className="text-title">{item.methodName}</p>
                  {item.paymentList.map((payment: any) => {
                    if (payment.id == 1)
                      return (
                        <CustomRadio key={payment.id} value={payment.id}>
                          <div>
                            <div className="flex justify-between text-sm py-2 px-1 items-center">
                              <div className="flex items-center gap-4">
                                <IoWallet className="w-14 h-14 text-[#f0700c]" />
                                <div>余额 </div>
                                <div className={price({ size: "xl2" })}>
                                  $ {wallet?.availabalBalance}
                                </div>
                              </div>
                              <Button
                                color="primary"
                                onPress={() => {
                                  setIsOpen(true);
                                }}
                              >
                                充值
                              </Button>
                            </div>
                          </div>
                        </CustomRadio>
                      );

                    return null;
                  })}
                </div>
              );
            })}
            {data?.map((item: any) => {
              if (item.methodName === "BALANCE") return null;

              return (
                <div key={item.methodName}>
                  <p className="text-title">{item.methodName}</p>
                  {item.paymentList.map((payment: any) => {
                    return (
                      <Radio
                        key={payment.id}
                        classNames={{
                          base: cn(
                            "inline-flex min-w-[100%] w-full bg-content1 m-0  mb-2 ",
                            "hover:bg-content2 items-center justify-start",
                            "cursor-pointer rounded-lg gap-2 p-3 border-1",
                            "data-[selected=true]:border-primary",
                          ),
                          labelWrapper: "w-full",
                          label: "w-full ",
                        }}
                        value={payment.id}
                      >
                        <div className="w-full flex items-center gap-3 ">
                          <Image
                            className="object-contain"
                            height={60}
                            src={payment.logoUrl}
                            width={60}
                          />
                          <span className="text-sm font-semibold">
                            {payment.payName}
                          </span>
                        </div>
                      </Radio>
                    );
                  })}
                </div>
              );
            })}
          </RadioGroup>
        </div>
        <div className="flex justify-end items-center p-4 gap-4 sticky bottom-0  bg-white z-10">
          <div className="text-[#3d3d3d] text-sm flex items-center gap-1">
            应付金额
            <Tooltip
              className="bg-[#262626] text-white p-2 max-w-screen-sm"
              content="由于币种汇率间转换计算，可能会产生约0.01或0.02的差额"
            >
              <HiQuestionMarkCircle />
            </Tooltip>
            ：{currentPayMethod?.payAmount} 手续费：
            {currentPayMethod?.handlingFee}
          </div>
          <p className="text-price-xl">{currentPayMethod?.payAmount}</p>
          <Button
            className="w-[300px]"
            color="primary"
            size="lg"
            onPress={hanldeCreatePayOrder}
          >
            下单结算
          </Button>
        </div>
      </div>
      <RechargeModal isOpen={isOpen} onOpenChange={setIsOpen} />
      <CommonModal
        cancelText="支付失败反馈"
        confirmText="已付"
        isOpen={isOpen1}
        size="xl"
        title="遇到问题？"
        onConfirm={async (onClose) => {
          const status = await getPayOrderStatus(params?.bizCode);

          if (status === 203) {
            onClose();
          } else {
            addToast({
              title: "未完成支付",
              timeout: 1000,
              color: "danger",
            });
          }
        }}
        onOpenChange={setIsOpen1}
      >
        <div>
          <div className="rounded-lg bg-[#ffeee1] p-2 my-4 text-sm">
            温馨提示：请在新页面完成支付，支付完成前请勿关闭此窗口。
          </div>
          <div className="mt-5 mb-2">如果您支付成功，请点击支付完成。</div>
          <div className="mb-5">
            如果您在付款时遇到问题，请重试或给我们一个{" "}
            <span className="text-blue-600">反馈</span>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
