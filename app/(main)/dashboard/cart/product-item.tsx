import {
  addToast,
  Button,
  Checkbox,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

import { Product } from "./page";

import Stepper from "@/components/stepper";
import { deleteCart, updateCart } from "@/services/api/cart";
import ConfirmModal from "@/components/confirm-modal";
type ProductItemProps = {
  product: Product;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
  mutate: any;
};

const RemarkModal = ({ isOpen, onOpenChange, handleRemark, value }: any) => {
  const [remark, setRemark] = useState(value);

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">备注</ModalHeader>
            <ModalBody>
              <Textarea
                placeholder="请输入备注"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </ModalBody>
            <ModalFooter className="flex gap-2">
              <Button
                className="flex-1 button-default"
                variant="light"
                onPress={onClose}
              >
                取消
              </Button>
              <Button
                className="flex-1"
                color="primary"
                onPress={() => handleRemark(remark, onClose)}
              >
                确定
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default function ProductItem({
  product,
  isSelected,
  onToggle,
  mutate,
}: ProductItemProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    isOpen: isOpenRemark,
    onOpen: onOpenRemark,
    onOpenChange: onOpenChangeRemark,
  } = useDisclosure();
  const handleDelete = (onClose: any) => {
    deleteCart({ idList: [product.id] }).then((e: any) => {
      if (e.success) {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
        onClose();
        mutate();
      } else {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
      }
    });
  };
  const handleRemark = (remark: string, onClose: () => void) => {
    console.log("remark", remark);
    updateCart([
      {
        id: product.id,
        quantity: product.quantity,
        remark,
      },
    ]).then((e: any) => {
      if (e.success) {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
        onClose();
        mutate();
      } else {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
      }
    });
  };

  const handleQuantity = (quantity: number) => {
    updateCart([
      {
        id: product.id,
        quantity,
        remark: product.remark,
      },
    ]).then((e: any) => {
      if (e.success) {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
        mutate();
      } else {
        addToast({
          title: e.msg,
          timeout: 1000,
        });
      }
    });
  };

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex">
        <Checkbox
          isSelected={isSelected}
          size="sm"
          onChange={(e) => onToggle(e.target.checked)}
        />
        <Image alt="Product" height={90} src={product.skuPicUrl} width={90} />
      </div>
      <div className="flex-[2]">
        <div className="line-clamp-2 font-bold">{product.productTitle}</div>
        <div className="text-gray-500">{product.sku.propName_valueName}</div>
      </div>
      <div className="flex-1  flex gap-2">
        <Tooltip
          className="bg-[#262626] text-white p-2 max-w-screen-sm"
          content={product.remark}
        >
          <p className=" max-w-24  truncate">备注：{product.remark}</p>
        </Tooltip>
        <button className="text-blue-500 underline" onClick={onOpenRemark}>
          <FaEdit className="w-6 h-6 text-[#f0700c]" />
        </button>
      </div>
      <div className="flex-1">
        <div className="text-lg font-semibold text-red-500">
          总计: ${product.totalPrice}
        </div>
        <div className="text-sm">单价: ${product.price}</div>
        <div className="text-gray-500">国内运费: {product.postFee}</div>
      </div>
      <Stepper value={product.quantity} onChange={handleQuantity} />
      <div className="flex justify-center gap-2 flex-1">
        <Button className="button-default" size="sm" onPress={onOpen}>
          删除
        </Button>
      </div>
      <ConfirmModal
        content="确定要删除当前商品吗？"
        isOpen={isOpen}
        title="删除购物车"
        onConfirm={handleDelete}
        onOpenChange={onOpenChange}
      />
      <RemarkModal
        handleRemark={handleRemark}
        isOpen={isOpenRemark}
        value={product.remark}
        onOpenChange={onOpenChangeRemark}
      />
    </div>
  );
}
