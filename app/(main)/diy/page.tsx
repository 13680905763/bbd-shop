"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Button,
  Input,
  Textarea,
  Image,
  addToast,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { FaPlus, FaTrash, FaCamera } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { Image as AntImage } from "antd";
import { useRouter } from "next/navigation";

import { useGlobalStore } from "@/store";
import { useServices } from "@/hook";
import { useCreateDiyOrder, useUploadDiyImage } from "@/hook/api";
import CommonModal from "@/components/modal/common-modal";
import Stepper from "@/components/stepper";
import { safeMul } from "@/utils/number";

export default function DiyOrderPage() {
  const t = useTranslations("DIY");
  const tOrder = useTranslations("SubmitOrder");
  const { currency } = useGlobalStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  // Services
  const { data: services, isLoading: isServicesLoading } = useServices();
  const { mutateAsync: createDiyOrder, isPending: submitting } =
    useCreateDiyOrder();
  const { mutateAsync: uploadImage, isPending: uploading } =
    useUploadDiyImage();

  const [localServices, setLocalServices] = useState<any[]>([]);
  const [isServiceDetailOpen, setIsServiceDetailOpen] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Form State
  const [productLink, setProductLink] = useState("");
  const [productName, setProductName] = useState("");
  const [specifications, setSpecifications] = useState<
    { s1: string; s2: string; quantity: number }[]
  >([{ s1: "", s2: "", quantity: 1 }]);
  const [remark, setRemark] = useState("");
  const [imageList, setImageList] = useState<
    { id: string; preview: string; url?: string; uploading: boolean }[]
  >([]);

  // Cost State
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [shippingFee, setShippingFee] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize services when data is loaded
  useEffect(() => {
    if (services) {
      setLocalServices(
        services.map((s: any) => ({
          ...s,
          isCheck: false,
          remark: "",
          quantity: 1,
        })),
      );
    }
  }, [services]);

  // Service Handlers
  const openServiceModal = () => {
    onOpen();
  };

  const openServiceDetail = (serviceId: string) => {
    const service = localServices.find((s) => s.id === serviceId);

    if (!service) return;
    setCurrentService(service);
    setIsServiceDetailOpen(true);
  };

  const saveServiceDetail = () => {
    if (currentService.id == 1) {
      setIsServiceDetailOpen(false);

      return;
    }
    setLocalServices((prev) =>
      prev.map((s) =>
        s.id === currentService.id
          ? {
              ...s,
              remark: currentService?.remark,
              isCheck: true,
              quantity: currentService?.quantity,
            }
          : s,
      ),
    );
    setIsServiceDetailOpen(false);
  };

  const removeService = (serviceId: string) => {
    setLocalServices((prev) =>
      prev.map((s) =>
        s.id === serviceId ? { ...s, isCheck: false, remark: "" } : s,
      ),
    );
  };

  const handleServiceSubmit = () => {
    onOpenChange();
  };

  // Handlers
  const handleAddSpec = () => {
    setSpecifications([...specifications, { s1: "", s2: "", quantity: 1 }]);
  };

  const handleRemoveSpec = (index: number) => {
    const newSpecs = [...specifications];

    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
  };

  const handleSpecChange = (
    index: number,
    field: "s1" | "s2" | "quantity",
    val: string | number,
  ) => {
    const newSpecs = [...specifications];

    // @ts-ignore
    newSpecs[index][field] = val;
    setSpecifications(newSpecs);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      if (imageList.length + files.length > 5) {
        addToast({ title: t("uploadImagesTip"), color: "warning" });

        return;
      }

      const fileArray = Array.from(files);
      const newItems = fileArray.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file),
        uploading: true,
      }));

      setImageList((prev) => [...prev, ...newItems]);

      // Process uploads concurrently
      const uploadPromises = fileArray.map(async (file, index) => {
        const item = newItems[index];

        try {
          const url = await uploadImage(file);

          setImageList((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, url, uploading: false } : p,
            ),
          );
        } catch (error) {
          console.error("Upload failed", error);
          addToast({ title: "Image upload failed", color: "danger" });
          setImageList((prev) => prev.filter((p) => p.id !== item.id));
        }
      });
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageList((prev) => {
      const newArr = [...prev];
      const item = newArr[index];

      if (item?.preview) {
        URL.revokeObjectURL(item.preview);
      }
      newArr.splice(index, 1);

      return newArr;
    });
  };

  const { productTotal, shipping, serviceFee, totalCost } = useMemo(() => {
    const rate = currency.rate || 1;
    const price = parseFloat(unitPrice) || 0;
    const qty = specifications.reduce(
      (sum, spec) => sum + (Number(spec.quantity) || 0),
      0,
    );
    const ship = parseFloat(shippingFee) || 0;

    // Calculate service fees
    const skuCount = specifications.length;
    const sFee = localServices
      .filter((s) => s.isCheck)
      .reduce((sum, s) => sum + s.price * s.quantity * skuCount, 0);

    const pTotal = price * qty;
    const totalRMB = pTotal + ship + sFee;

    // Convert RMB to selected currency for display
    // Product price and shipping fee are in RMB, so we convert them
    // Service fee is already in the selected currency
    const pTotalConverted = pTotal / rate;
    const shipConverted = ship / rate;
    const totalCostConverted = pTotalConverted + shipConverted + sFee;

    return {
      productTotal: pTotalConverted.toFixed(2),
      shipping: shipConverted.toFixed(2),
      serviceFee: sFee.toFixed(2),
      totalCost: totalCostConverted.toFixed(2),
    };
  }, [unitPrice, specifications, shippingFee, localServices, currency.rate]);

  const handleSubmit = async () => {
    if (!productLink || !productName) {
      addToast({ title: "Please fill in required fields", color: "danger" }); // Simple validation

      return;
    }

    if (imageList.some((img) => img.uploading)) {
      addToast({
        title: "Images are uploading, please wait...",
        color: "warning",
      });

      return;
    }

    try {
      // ...
      const validImages = imageList
        .filter((img) => img.url && !img.uploading)
        .map((img) => img.url!);
      // Use the first uploaded image as the product picture, or a default/placeholder if none
      const productPic = validImages.length ? validImages : [];
      // Construct specifications list
      const validSpecs = specifications.filter(
        (s) =>
          (s.s1?.trim() !== "" || s.s2?.trim() !== "") &&
          Number(s.quantity) > 0,
      );

      // Calculate total quantity
      const totalQuantity = validSpecs.reduce(
        (sum, spec) => sum + (Number(spec.quantity) || 0),
        0,
      );
      const skuCount = validSpecs.length;

      const checkedServices = localServices
        .filter((s) => s.isCheck)
        .map((s) => ({
          serviceId: s.id,
          quantity: s.quantity * skuCount,
          remark: s.remark,
        }));

      const bizCode = await createDiyOrder({
        productLink,
        productTitle: productName,
        productPic,
        specifications: validSpecs,
        productPrice: unitPrice || "0",
        postage: shippingFee || "0",
        remark,
        serviceList: checkedServices,
      });

      // Redirect to payment page
      if (bizCode) {
        router.push(`/payment/${bizCode}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(currency);

  return (
    <div className="container mx-auto p-4 flex flex-col gap-6 pb-32">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 pb-4 border-b border-gray-100">
          {t("productDetails")}
        </h2>

        <div className="flex flex-col gap-8">
          <div className="flex gap-4 items-center">
            <div className="w-36 text-lg font-semibold text-right shrink-0">
              <span className="text-red-500 mr-1">*</span>
              {t("productLink")}
            </div>
            <Input
              className="flex-1"
              classNames={{
                inputWrapper:
                  "bg-gray-100 data-[hover=true]:bg-gray-200 group-data-[focus=true]:bg-gray-100 border-none h-14",
                input: "text-lg",
              }}
              placeholder={t("productLinkPlaceholder")}
              size="lg"
              value={productLink}
              onValueChange={setProductLink}
            />
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-36 text-lg font-semibold text-right shrink-0">
              <span className="text-red-500 mr-1">*</span>
              {t("productName")}
            </div>
            <Input
              className="flex-1"
              classNames={{
                inputWrapper:
                  "bg-gray-100 data-[hover=true]:bg-gray-200 group-data-[focus=true]:bg-gray-100 border-none h-14",
                input: "text-lg",
              }}
              placeholder={t("productNamePlaceholder")}
              size="lg"
              value={productName}
              onValueChange={setProductName}
            />
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-36 text-lg font-semibold text-right shrink-0 mt-3">
              {t("specifications")}
            </div>
            <div className="flex flex-col gap-4 w-full">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-3 items-center w-full">
                  <Input
                    className="flex-1"
                    classNames={{
                      inputWrapper:
                        "bg-gray-100 data-[hover=true]:bg-gray-200 group-data-[focus=true]:bg-gray-100 border-none h-14",
                      input: "text-lg",
                    }}
                    placeholder={t("specNamePlaceholder")}
                    size="lg"
                    value={spec.s1}
                    onValueChange={(val) => handleSpecChange(index, "s1", val)}
                  />
                  <Input
                    className="flex-1"
                    classNames={{
                      inputWrapper:
                        "bg-gray-100 data-[hover=true]:bg-gray-200 group-data-[focus=true]:bg-gray-100 border-none h-14",
                      input: "text-lg",
                    }}
                    placeholder={t("specValuePlaceholder")}
                    size="lg"
                    value={spec.s2}
                    onValueChange={(val) => handleSpecChange(index, "s2", val)}
                  />
                  <Input
                    className="w-32 shrink-0"
                    classNames={{
                      inputWrapper:
                        "bg-gray-100 data-[hover=true]:bg-gray-200 group-data-[focus=true]:bg-gray-100 border-none h-14",
                      input: "text-lg",
                    }}
                    placeholder={t("specQuantityPlaceholder")}
                    size="lg"
                    type="number"
                    value={spec.quantity?.toString()}
                    onValueChange={(val) =>
                      handleSpecChange(index, "quantity", val)
                    }
                  />
                  {specifications.length > 1 && (
                    <Button
                      isIconOnly
                      size="lg"
                      variant="light"
                      // color="danger"
                      onClick={() => handleRemoveSpec(index)}
                    >
                      <FaTrash size={20} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                className="w-fit font-medium text-lg h-12 button-default"
                color="primary"
                size="lg"
                startContent={<FaPlus />}
                variant="flat"
                onClick={handleAddSpec}
              >
                {t("addSpecification")}
              </Button>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-36 text-lg font-semibold text-right shrink-0 mt-3">
              {t("remark")}
            </div>
            <Textarea
              className="flex-1"
              classNames={{
                inputWrapper:
                  "bg-gray-100 data-[hover=true]:bg-gray-200 group-data-[focus=true]:bg-gray-100 border-none",
                input: "text-lg",
              }}
              minRows={4}
              placeholder={t("remarkPlaceholder")}
              value={remark}
              onValueChange={setRemark}
            />
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-36 text-lg font-semibold text-right shrink-0 mt-3">
              {t("uploadImages")}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-wrap gap-4">
                {imageList.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative w-32 h-32 border rounded-xl overflow-hidden group"
                  >
                    <Image
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                      radius="none"
                      src={item.preview}
                    />
                    {item.uploading && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <button
                      className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors z-20 cursor-pointer"
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <IoCloseCircle size={24} />
                    </button>
                  </div>
                ))}

                {imageList.length < 5 && (
                  <div
                    className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-blue-50 transition-colors text-gray-400 hover:text-primary"
                    role="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaCamera size={32} />
                    <span className="text-sm mt-2 font-medium">
                      {imageList.length}/5
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">{t("uploadImagesTip")}</p>
              <input
                ref={fileInputRef}
                hidden
                multiple
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-36 text-lg font-semibold text-left shrink-0 mt-3">
              {tOrder("OrderItem.valueAddedService")}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="p-4 bg-[#f8f8f8] rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-2 flex-wrap">
                  {localServices.some((s) => s.isCheck) ? (
                    localServices
                      .filter((s) => s.isCheck)
                      .map((item: any) => (
                        <span
                          key={item.id}
                          className="px-3 py-1 text-sm rounded-lg bg-white text-gray-700 border border-gray-200"
                        >
                          {item.serviceName} * {item.quantity}
                        </span>
                      ))
                  ) : (
                    <span className="text-sm text-gray-400">
                      {tOrder("OrderItem.noService")}
                    </span>
                  )}
                </div>

                <Button
                  className="bg-white border border-gray-200 shadow-sm font-medium"
                  size="sm"
                  onPress={openServiceModal}
                >
                  {tOrder("OrderItem.add")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 pb-4 border-b border-gray-100">
          {t("cost")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4 items-center">
            <div className="w-24 text-lg font-semibold text-left shrink-0">
              {t("unitPrice")}
            </div>
            <Input
              className="flex-1"
              classNames={{
                inputWrapper:
                  "bg-gray-100 data-[hover=true]:bg-gray-200 group-data-[focus=true]:bg-gray-100 border-none h-14",
                input: "text-2xl",
                mainWrapper: "w-full",
              }}
              endContent={
                <div className="pointer-events-none flex items-center text-gray-400 text-2xl whitespace-nowrap">
                  ≈ {currency.symbol}{" "}
                  {currency.rate
                    ? (parseFloat(unitPrice || "0") / currency.rate).toFixed(2)
                    : "0.00"}
                </div>
              }
              placeholder="0.00"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-gray-500 text-lg font-medium">¥</span>
                </div>
              }
              type="number"
              value={unitPrice}
              onValueChange={setUnitPrice}
            />
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-24 text-lg font-semibold text-left shrink-0">
              {t("shippingFee")}
            </div>
            <Input
              className="flex-1"
              classNames={{
                inputWrapper:
                  "bg-gray-100 data-[hover=true]:bg-gray-200 group-data-[focus=true]:bg-gray-100 border-none h-14",
                input: "text-2xl",
                mainWrapper: "w-full",
              }}
              endContent={
                <div className="pointer-events-none flex items-center text-gray-400 text-2xl  whitespace-nowrap">
                  ≈ {currency.symbol}{" "}
                  {currency.rate
                    ? (parseFloat(shippingFee || "0") / currency.rate).toFixed(
                        2,
                      )
                    : "0.00"}
                </div>
              }
              placeholder="0.00"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-gray-500 text-lg font-medium">¥</span>
                </div>
              }
              type="number"
              value={shippingFee}
              onValueChange={setShippingFee}
            />
          </div>
        </div>
        <div className="bg-[#ffeee1]  p-6 rounded-xl mt-8 text-base border border-blue-100 font-medium">
          {t("promptText")}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6  z-50">
        <div className="container mx-auto flex justify-end items-center gap-8">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                {tOrder("OrderItem.productFee")} {currency.symbol}
                {productTotal}
              </span>
              <span>+</span>
              <span>
                {t("shippingFee")} {currency.symbol}
                {shipping}
              </span>
              <span>+</span>
              <span>
                {tOrder("OrderItem.serviceFee")} {currency.symbol}
                {serviceFee}
              </span>
            </div>
            <p>
              <span className="font-medium text-2xl">{t("totalCost")}：</span>
              <span className="font-bold text-3xl text-[#f0700c]">
                {currency.symbol}
                {totalCost}
              </span>
            </p>
          </div>
          <Button
            className="w-[200px] "
            color="primary"
            isLoading={submitting}
            size="lg"
            onPress={handleSubmit}
          >
            {t("submit")}
          </Button>
        </div>
      </div>

      {/* Service Modal */}
      <CommonModal
        isDismissable={false}
        isOpen={isOpen}
        title={tOrder("OrderItem.valueAddedService")}
        onConfirm={handleServiceSubmit}
        onOpenChange={onOpenChange}
      >
        {localServices.map((service) => (
          <div key={service.id} className="items-center p-3 border rounded-lg ">
            <div className="flex justify-between items-center">
              <div className="font-medium">{service.serviceName}</div>
              {service.id == 1 ? (
                // Free icon
                <button
                  className="flex items-center text-green-500 text-sm gap-1 h-8 w-16 justify-center"
                  onClick={() => openServiceDetail(service.id)}
                >
                  <FaCamera />
                  {tOrder("free")}
                </button>
              ) : (
                <Button
                  className="button-white"
                  size="sm"
                  onPress={() => openServiceDetail(service.id)}
                >
                  {tOrder("OrderItem.add")}
                </Button>
              )}
            </div>

            {service.isCheck && service.id != 1 && (
              <div className="bg-gray-50 px-3 py-2 rounded-lg mt-2 flex justify-between items-center border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {tOrder("serviceItem")}
                  </span>
                  {service.remark && (
                    <span className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {tOrder("OrderItem.remark")}: {service.remark}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-500">
                    x{service.quantity}
                  </span>
                  <span className="text-sm font-semibold text-red-500">
                    {currency.symbol}
                    {safeMul(service.quantity, service.price)}
                  </span>
                  <Button
                    className="text-[11px] px-2 h-6"
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => removeService(service.id)}
                  >
                    {tOrder("delete")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CommonModal>

      {/* Service Detail Modal */}
      {currentService && (
        <CommonModal
          isDismissable={false}
          isOpen={isServiceDetailOpen}
          showCancel={currentService.id != 1}
          title={currentService.serviceName}
          onConfirm={saveServiceDetail}
          onOpenChange={setIsServiceDetailOpen}
        >
          <div className="space-y-5">
            {/* Service Intro */}
            <div className="bg-[#f8f8f8] p-4 rounded-lg space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {tOrder("serviceIntro")}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {currentService.introduction || tOrder("noIntro")}
                </p>
              </div>

              {/* Sample */}
              {currentService.sample?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {tOrder("sample")}
                  </h3>
                  <div
                    ref={containerRef}
                    className="relative"
                    style={{ width: "100%", overflow: "hidden" }}
                  >
                    <AntImage.PreviewGroup
                      preview={{
                        getContainer: () =>
                          containerRef.current || document.body,
                      }}
                    >
                      <div className="grid grid-cols-4 gap-2">
                        {currentService.sample.map((url: string) => (
                          <AntImage
                            key={url}
                            height={80}
                            src={url}
                            width={80}
                          />
                        ))}
                      </div>
                    </AntImage.PreviewGroup>
                  </div>
                </div>
              )}
            </div>

            {/* Service Fee */}
            {currentService.id != 1 && (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm text-gray-700">
                  {tOrder("OrderItem.serviceFee")}
                </span>
                <div className="flex gap-2">
                  <span className="text-lg font-semibold text-rose-600">
                    {currency.symbol}
                    {currentService.price}
                  </span>
                  {currentService?.stacked == 1 ? (
                    <Stepper
                      value={currentService?.quantity}
                      onChange={(quantity) => {
                        setCurrentService({
                          ...currentService,
                          quantity: quantity,
                        });
                      }}
                    />
                  ) : null}
                </div>
              </div>
            )}

            {/* Remark */}
            {currentService.id != 1 && (
              <Textarea
                className="w-full mt-2"
                minRows={3}
                placeholder={tOrder("remarkPlaceholder")}
                value={currentService.remark}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    remark: e.target.value,
                  })
                }
              />
            )}
          </div>
        </CommonModal>
      )}
    </div>
  );
}
