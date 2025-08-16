import {
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
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useServicesStore } from "@/store";

type ProductItemProps = {
  product: any;
  isLastProduct: boolean;
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
  isLastProduct,
}: ProductItemProps) {
  const services = useServicesStore((state) => state.services);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const {
    isOpen: isOpenRemark,
    onOpen: onOpenRemark,
    onOpenChange: onOpenChangeRemark,
  } = useDisclosure();

  return (
    <>
      <div className="flex justify-between items-center gap-4 border-b-1 p-2 px-4">
        <div className="flex ">
          <div className="flex grow-0 shrink-0 basis-[400px] gap-2">
            <div className=" grow-0 shrink-0 basis-[90px]">
              <button
                onClick={() =>
                  router.push(
                    `/goods/${product.source}/${product?.sourceProductId}`,
                  )
                }
              >
                <Image
                  alt="Product"
                  height={90}
                  src={product.skuPicUrl || product?.picUrl}
                  width={90}
                />
              </button>
            </div>
            <div>
              <div className="line-clamp-2 font-bold">
                {product?.productTitle}
              </div>
              <div className="text-gray-500 text-sm">
                {product?.sku?.propName_valueName}
              </div>
              <div className="text-gray-500">{product?.remark}</div>
            </div>
          </div>
        </div>

        <div className="">
          <p>${product.price}</p>
        </div>
        <div className="">
          <p>x{product.quantity}</p>
        </div>
        <div className="flex  gap-2  justify-center flex-col grow-0 shrink-0 basis-[150px]">
          {product?.orderServiceList?.map((service: any, index: any) => (
            <Tooltip
              key={index}
              className="bg-[#262626] text-white p-2 max-w-screen-sm"
              content={service?.introduction}
            >
              <Checkbox isDisabled={true} isSelected={true}>
                {service?.serviceName}￥{service?.price}
              </Checkbox>
            </Tooltip>
          ))}
          {/* <Button className="button-white" radius="none" size="sm">
            精细拍照
          </Button>
          <Button className="button-white" radius="none" size="sm">
            留言
          </Button> */}
        </div>
        <RemarkModal
          // handleRemark={handleRemark}
          isOpen={isOpenRemark}
          value={product.remark}
          onOpenChange={onOpenChangeRemark}
        />
      </div>
      {/* <div
        className={`${isLastProduct ? "" : "border-b-1"} p-3 flex  justify-between items-center`}
      >
        <div>精细拍照</div>
        <div>0.47</div>
        <div>x1</div>
        <div>pending</div>
        <div className="flex gap-2">
          <Button color="primary" radius="none" size="sm">
            支付
          </Button>
          <Button className="button-default" radius="none" size="sm">
            取消
          </Button>
        </div>
      </div> */}
    </>
  );
}
