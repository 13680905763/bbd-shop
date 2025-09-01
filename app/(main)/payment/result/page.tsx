"use client";

import { Button, Card } from "@heroui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

import { payNotice } from "@/services/wallet";

function formatTime(ts: string) {
  if (!ts) return "";
  const num = Number(ts);
  const ms = num < 1e12 ? num * 1000 : num; // 秒级转毫秒

  return new Date(ms).toLocaleString();
}

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 提取参数
  const payOrderId = searchParams.get("payOrderId") || "";
  const amount = searchParams.get("amount") || "0.00";
  const paySuccTime = searchParams.get("paySuccTime") || "";
  const resultCode = searchParams.get("resultCode"); // 内部
  const status = searchParams.get("status"); // onpay

  // 支付是否成功
  const isSuccess = useMemo(() => {
    if (resultCode) return resultCode === "SUCCESS";
    if (status) return status === "2";

    return false;
  }, [resultCode, status]);

  useEffect(() => {
    async function notifyBackend() {
      try {
        await payNotice(searchParams.toString());
      } catch (err) {
        console.error("通知后端支付状态失败", err);
      } finally {
        setLoading(false);
      }
    }
    notifyBackend();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg">
        正在确认支付结果...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <Card
        className={`w-full max-w-md p-8 rounded-xl shadow-md ${
          isSuccess ? "border-green-500" : "border-red-500"
        }`}
      >
        <div className="flex flex-col items-center space-y-6">
          {isSuccess ? (
            <>
              <AiFillCheckCircle className="text-green-500 w-20 h-20" />
              <h1 className="text-2xl font-bold text-green-600">支付成功</h1>
              <div className="text-gray-600 text-center space-y-2">
                <p>交易号：{payOrderId}</p>
                <p>
                  支付金额：
                  {searchParams.get("currency") === "USD" ? "$" : "￥"}
                  {amount}
                </p>
                <p>支付时间：{formatTime(paySuccTime)}</p>
              </div>
              <p className="text-gray-500 text-center">
                我们已收到您的付款，订单正在处理中。
              </p>
            </>
          ) : (
            <>
              <AiFillCloseCircle className="text-red-500 w-20 h-20" />
              <h1 className="text-2xl font-bold text-red-600">支付失败</h1>
              <div className="text-gray-600 text-center space-y-2">
                <p>订单号：{payOrderId}</p>
                {amount && (
                  <p>
                    支付金额：
                    {searchParams.get("currency") === "USD" ? "$" : "￥"}
                    {amount}
                  </p>
                )}
                {paySuccTime && <p>支付时间：{formatTime(paySuccTime)}</p>}
              </div>
              <p className="text-gray-500 text-center">
                支付未完成，请检查订单或重新尝试付款。
              </p>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              color="primary"
              onPress={() => router.push(`/dashboard/order`)}
            >
              查看订单
            </Button>
            <Button onPress={() => router.push("/")}>返回首页</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
