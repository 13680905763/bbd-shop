import { IoWallet, IoAddCircleOutline, IoRepeat } from "react-icons/io5";
import React, { useState } from "react";
import { Button } from "@heroui/react";

import DynamicFormModal, { FieldConfig } from "./dynamic-form-modal";

interface UserBalanceCardProps {
  type?: string;
  balanceCNY: string;
  balanceUSD: string;
  bgColor?: string;
  children?: React.ReactNode; // 左侧内容插槽
}
const fieldspwd: FieldConfig[] = [
  {
    type: "input",
    name: "name123",
    label: "姓名",
    placeholder: "请输入姓名",
  },
  {
    type: "select",
    name: "country",
    label: "银行",
    placeholder: "选择银行",
    options: [
      {
        label: "中国银行",
        value: "Argentina",
        // icon: "https://flagcdn.com/ar.svg",
      },
      {
        label: "建设银行",
        value: "Venezuela",
        // icon: "https://flagcdn.com/ve.svg",
      },
      {
        label: "paypal",
        value: "Brazil",
        // icon: "https://flagcdn.com/ve.svg",
      },
    ],
  },
  {
    type: "input",
    name: "phone123",
    label: "卡号",
    placeholder: "请确认卡号",
  },
  {
    type: "input",
    name: "phone12123",
    label: "金额",
    placeholder: "请输入金额",
  },
];
const UserBalanceCard = ({
  balanceCNY,
  balanceUSD,
  children,
  bgColor,
  type,
}: UserBalanceCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [modalType, setModalType] = useState<"recharge" | "form" | "score">(
    "recharge",
  );
  const titleMap = {
    recharge: "充值",
    form: "提现",
    score: "积分",
  };
  const [formData, setFormData] = useState<Record<string, any>>({
    name: "",
    phone: "",
    country: "",
    province: "",
    address: "",
    zipCode: "",
    isDefault: false,
  });
  const onRecharge = () => {
    setModalType("recharge");
    setIsOpen(true);
  };
  const onScore = () => {
    setModalType("score");
    setIsOpen(true);
  };
  const onWithdraw = () => {
    setModalType("form");
    setIsOpen(true);

    console.log("withdraw");
  };

  // 保存时处理
  const handleSave = (data: Record<string, any>) => {
    console.log("表单数据:", data);
    // 你可以在这里做提交接口等操作
  };

  return (
    <div
      className={`flex justify-between ${bgColor ? bgColor : "bg-[#fff]"} rounded-lg  p-8`}
    >
      {children ? (
        <div className="flex  flex-1 items-center gap-6">{children}</div>
      ) : null}
      <div className="flex gap-4 flex-[2]">
        {type === "score" ? (
          <>
            <div className="flex-1 flex items-center gap-2 p-5">
              <IoWallet className="w-5 h-5 text-[#f0700c]" />
              <div>积分</div>
              <div className="flex items-center gap-2">
                <span className="text-money-3xl">{balanceCNY}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button color="primary" size="md" onPress={onScore}>
                <IoRepeat className="w-5 h-5" />
                积分兑换优惠券
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 flex items-center gap-2 p-5">
              <IoWallet className="w-5 h-5 text-[#f0700c]" />
              <div>余额</div>
              <div className="flex items-center gap-2">
                <span className="text-money-3xl">￥{balanceCNY}</span>
                <span>≈</span>
                <span className="text-money-3xl-black">$ {balanceUSD}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button color="primary" size="md" onPress={onRecharge}>
                <IoAddCircleOutline className="w-5 h-5" />
                充值
              </Button>
              <Button className="button-default" size="md" onPress={onWithdraw}>
                <IoWallet className="w-5 h-5" />
                提现
              </Button>
            </div>
          </>
        )}
      </div>
      <DynamicFormModal
        fields={fieldspwd}
        formData={formData}
        isOpen={isOpen}
        modalType={modalType}
        title={titleMap[modalType] as string}
        onChange={setFormData}
        onOpenChange={setIsOpen}
        onSave={handleSave}
      />
    </div>
  );
};

export default UserBalanceCard;
