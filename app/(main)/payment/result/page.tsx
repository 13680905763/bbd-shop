"use client";

import { Button, Card, Spinner } from "@heroui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { useTranslations } from "next-intl";

import { payNotice, payPaypel } from "@/services/wallet";
import { useGlobalStore } from "@/store";

function formatTime(ts: string) {
  if (!ts) return "";
  const num = Number(ts);
  const ms = num < 1e12 ? num * 1000 : num; // 秒级转毫秒

  return new Date(ms).toLocaleString();
}
/**
 * 汇率转换（金额 → 中间汇率A → 最终汇率B）
 * 返回保留两位小数的数字
 */
function convertCurrency(
  amount: number | string | null | undefined,
  rateA: number | string | null | undefined,
  rateB: number | string | null | undefined,
  digits = 2,
): number {
  // 转成数字，如果无效就用 0（rateB 避免除以 0，用 1）
  const numAmount = amount != null ? Number(amount) : 0;
  const numRateA = rateA != null ? Number(rateA) : 0;
  const numRateB = rateB != null ? Number(rateB) : 1;

  if (isNaN(numAmount) || isNaN(numRateA) || isNaN(numRateB)) {
    return 0;
  }

  const scale = 1e6; // 提升精度，避免浮点误差

  // 原币 → 中间币
  const middle = Math.round(numAmount * numRateA * scale) / scale;

  // 中间币 → 目标币
  const result = Math.round((middle / numRateB) * scale) / scale;

  // 保留指定小数位
  const finalScale = Math.pow(10, digits);

  return Math.round(result * finalScale) / finalScale;
}

export default function PaymentResultPage() {
  const t = useTranslations("PaymentResultPage");
  const { currency, currencies } = useGlobalStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isConvert, setIsConvert] = useState(false);

  const paymentMethod = searchParams.get("paymentMethod"); // paymentMethod

  const [paymentInfo, setPaymentInfo] = useState<{
    success: boolean;
    orderId?: string;
    amount?: number;
    payTime?: string;
    currency?: string;
  }>({ success: false });

  useEffect(() => {
    // 初始化类型
    async function notifyBackend() {
      try {
        let paymentInfo;

        if (paymentMethod == "PAYPAL") {
          console.log("走paypel");

          // PayPal: 用 token 请求后端
          const res = await payPaypel(searchParams.toString());

          paymentInfo = {
            success: res?.resultCode === "SUCCESS" || res?.status === "2",
            orderId: res?.payOrderId,
            amount: res?.amount,
            payTime: res?.paySuccTime,
            currency: res?.currency,
          };
          // paymentInfo = { success: true/false, orderId, amount, payTime, currency }
        } else {
          console.log("onpay/钱包");

          // 原支付方式: 用 URL 参数构造结果
          paymentInfo = {
            success:
              searchParams.get("resultCode") === "SUCCESS" ||
              searchParams.get("status") === "2",
            orderId: searchParams.get("payOrderId"),
            amount: searchParams.get("amount"),
            payTime: searchParams.get("paySuccTime"),
            currency: searchParams.get("currency"),
          };

          // 同步通知后端（非钱包支付）
          if (paymentMethod != "WALLET") {
            await payNotice(searchParams.toString());
          }
        }
        console.log("paymentInfo", paymentInfo);

        setPaymentInfo(paymentInfo);
      } catch {
      } finally {
        setIsConvert(true);
      }
    }

    notifyBackend();
  }, []);

  useEffect(() => {
    if (currencies?.length && paymentInfo?.currency) {
      console.log("转金额");

      const rateFromToIntermediate = currencies.find(
        (item: any) => item.label == paymentInfo?.currency,
      )?.rate as number; // 从源币种到中间币种

      const rateIntermediateToTarget = currency?.rate; // 从中间币种到目标币种

      setPaymentInfo({
        ...paymentInfo,
        amount: convertCurrency(
          paymentInfo?.amount as number,
          rateFromToIntermediate,
          rateIntermediateToTarget,
        ),
      });
      setLoading(false);
    }
  }, [currencies, isConvert]);

  if (loading) {
    return (
      <div className="flex justify-center flex-col items-center h-[70vh] text-lg">
        {t("loading")}
        <div className="mt-4">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <Card
        className={`w-full max-w-md p-8 rounded-xl shadow-md ${
          paymentInfo?.success ? "border-green-500" : "border-red-500"
        }`}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* 图标和标题 */}
          {paymentInfo?.success ? (
            <>
              <AiFillCheckCircle className="text-green-500 w-20 h-20" />
              <h1 className="text-2xl font-bold text-green-600">
                {t("successTitle")}
              </h1>
            </>
          ) : (
            <>
              <AiFillCloseCircle className="text-red-500 w-20 h-20" />
              <h1 className="text-2xl font-bold text-red-600">
                {t("failTitle")}
              </h1>
            </>
          )}

          {/* 信息详情 - 公共部分 */}
          <div className="text-gray-600 text-center space-y-2">
            <p>
              {paymentInfo?.success ? t("transactionId") : t("orderId")}
              {paymentInfo?.orderId}
            </p>
            <p>
              {t("amount")}
              {currency.symbol}
              {paymentInfo?.amount}
            </p>
            {paymentInfo?.payTime && (
              <p>
                {t("time")}
                {formatTime(paymentInfo.payTime)}
              </p>
            )}
          </div>

          {/* 消息文本 */}
          <p className="text-gray-500 text-center">
            {paymentInfo?.success ? t("successMessage") : t("failMessage")}
          </p>

          {/* 按钮组 - 公共部分 */}
          <div className="flex gap-4 pt-4">
            <Button
              color="primary"
              onPress={() => router.push(`/dashboard/order`)}
            >
              {t("viewOrder")}
            </Button>
            <Button onPress={() => router.push("/")}>{t("backHome")}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
