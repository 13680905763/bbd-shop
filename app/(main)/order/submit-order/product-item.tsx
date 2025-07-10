import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";

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

export default function ProductItem({ product }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    isOpen: isOpenRemark,
    onOpen: onOpenRemark,
    onOpenChange: onOpenChangeRemark,
  } = useDisclosure();

  return (
    <div className="flex justify-between  gap-4">
      <div className="flex ">
        <div className="flex grow-0 shrink-0 basis-[400px] gap-2">
          <div className=" grow-0 shrink-0 basis-[90px]">
            <div>
              <Image
                alt="Product"
                height={90}
                src={product?.picUrl}
                width={90}
              />
            </div>
          </div>
          <div>
            <div className="line-clamp-2 font-bold">
              {product?.productTitle}
            </div>
            <div className="text-gray-500 text-sm">
              {product?.sku?.propName_valueName}
            </div>
          </div>
        </div>
      </div>

      <div className="flex grow-0 shrink-0 basis-[200px] ">
        <p className="   truncate ">
          备注：
          <span className="text-gray-500">{product?.remark ?? "暂无备注"}</span>
        </p>
      </div>
      <div className="flex  gap-2   flex-col  grow-0 shrink-0 basis-[200px]">
        <Button className="button-white" radius="none" size="sm">
          精细拍照
        </Button>
        <Button className="button-white" radius="none" size="sm">
          留言
        </Button>
      </div>
      <div className="flex grow-0 shrink-0 basis-[100px]">
        <p>{product.price}</p>
      </div>
      <div className="flex grow-0 shrink-0 basis-[100px]">
        <p>x{product.quantity}</p>
      </div>
      {/* <div className="flex grow-0 shrink-0 basis-[100px]">
        <p>${product.price * product.quantity}</p>
      </div> */}

      {/* <div className="flex-1 place-items-end">
        <div className="text-lg font-semibold text-red-500">
          总计: ${product.totalPrice}
        </div>
        <div className="text-gray-500">国内运费: {product.postFee}</div>
      </div> */}
      <RemarkModal
        // handleRemark={handleRemark}
        isOpen={isOpenRemark}
        value={product.remark}
        onOpenChange={onOpenChangeRemark}
      />
    </div>
  );
}
