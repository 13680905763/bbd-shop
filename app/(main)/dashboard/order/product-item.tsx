import {
  Button,
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

type ProductItemProps = {
  product: Product;
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

export default function ProductItem({ product }: ProductItemProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    isOpen: isOpenRemark,
    onOpen: onOpenRemark,
    onOpenChange: onOpenChangeRemark,
  } = useDisclosure();

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex">
        <Image alt="Product" height={90} src={product.skuPicUrl} width={90} />
      </div>
      <div className="flex-[2]">
        <div className="line-clamp-2 font-bold">{product.productTitle}</div>
        <div className="text-gray-500">{product.sku.propName_valueName}</div>
      </div>
      <div className="flex-1  flex gap-2">
        <Tooltip
          className="bg-[#262626] text-white p-2 "
          content={product.remark}
        >
          <p className=" max-w-24  truncate">备注：{product.remark}</p>
        </Tooltip>
        <button className="text-blue-500 underline" onClick={onOpenRemark}>
          <FaEdit className="w-6 h-6 text-[#f0700c]" />
        </button>
      </div>
      <div>
        <p>${product.price}</p>
        <p>X{product.quantity}</p>
      </div>
      <div className="flex-1 place-items-end">
        <div className="text-lg font-semibold text-red-500">
          总计: ${product.totalPrice}
        </div>
        <div className="text-gray-500">国内运费: {product.postFee}</div>
      </div>
      <RemarkModal
        // handleRemark={handleRemark}
        isOpen={isOpenRemark}
        value={product.remark}
        onOpenChange={onOpenChangeRemark}
      />
    </div>
  );
}
