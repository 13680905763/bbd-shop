"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  addToast,
  Button,
  Checkbox,
  Divider,
  Skeleton,
  Textarea,
} from "@heroui/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { GrPowerReset } from "react-icons/gr";
import { IoIosLink } from "react-icons/io";
import { useTranslations } from "next-intl";
import { Image } from "antd";
import { IoShareSocialOutline, IoStar, IoStarOutline } from "react-icons/io5";

import {
  commonCard,
  lightFont,
  priceFont,
  subtitle,
} from "@/components/primitives";
import Stepper from "@/components/stepper";
import { favoriteProduct, getGoodsInfo } from "@/services/goods";
// import { addCart } from "@/services/cart";
import {
  createOrderPreviewKeyByProduct,
  getOrderPreviewProduct,
} from "@/services";
import CopyText from "@/components/ui/copy-text";
import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";
import { safeMul } from "@/utils/number";
import { generateDynamicSkuPathDict } from "@/lib/sku-helper";
import { useConfirm } from "@/components/common/modal/confirm-provider";
import { SourceIcon } from "@/components/ui";
import { useAddCartItem, useUserInfo } from "@/hook/api";

const getSelectedValues = (specs: any) => {
  const arr: any = [];

  specs.forEach((spec: any) => {
    const selectedVal = spec.propValueList.find((item: any) => item.selected);

    arr.push(selectedVal ? `${spec.propId}:${selectedVal.valueID}` : undefined);
  });

  return arr;
};

const _getSelectedImg = (specs: any, skuPropImageMap: any) => {
  let url: string = "";

  specs.forEach((spec: any) => {
    const selectedVal = spec.propValueList.find((item: any) => item.selected);

    if (
      selectedVal?.valueID &&
      skuPropImageMap &&
      skuPropImageMap[selectedVal.valueID]
    ) {
      url = skuPropImageMap[selectedVal.valueID];
    }
  });

  return url;
};

export default function GoodsPage() {
  const t = useTranslations("Goods");
  const params = useParams();
  const { currency } = useGlobalStore();

  const { data: user } = useUserInfo();
  // sku滚动部分
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("78vh");
  const [lastTop, setLastTop] = useState<number | null>(null);

  const [remark, setRemark] = useState<string>();
  const [quantity, setQuantity] = useState<number>(1);
  const [isOpen1, setIsOpen1] = useState(false);
  const [goodsInfo, setGoodsInfo] = useState<any>();
  const [pathMap, setPathMap] = useState<any>(null);
  const [isLoading, setisLoading] = useState<any>(false);
  const [issub, setissub] = useState<any>(false);
  const [isChecked, setIsChecked] = useState<any>(false);
  const [currentImg, setCurrentImg] = useState<string>();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const { mutateAsync: addCartItem, isPending: isAdding } = useAddCartItem();
  const { confirm } = useConfirm();
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const inviteCode = searchParams.get("inviteCode");
    if (inviteCode && typeof window !== "undefined") {
      localStorage.setItem("inviteCode", inviteCode);
    }
  }, [searchParams]);
  const validateSkuSelection = () => {

    if (issub) return false;
    if (!isChecked) {
      confirm({
        title: t("disclaimer"),
        content: t("disclaimerDescription"),
        onConfirm: () => setIsChecked(true),
      });

      return false;
    }
    if (!currentSku) {
      addToast({
        title: t("selectSku"),
        color: "danger",
        timeout: 1000,
      });

      return false;
    }

    return true;
  };

  const handleBuyNow = async () => {
    if (!user) return router.push("/login");
    if (!validateSkuSelection()) return;

    setissub(true);

    try {
      const key = await createOrderPreviewKeyByProduct({
        source: params.source as any,
        sourceProductId: params.sourceProductId as string,
        sourceSkuId: currentSku.skuID,
        sourceMpId: goodsInfo?.productInfo?.sourceMpId,
        sourceMpSkuId: currentSku.sourceMpSkuId,
        specId: currentSku?.specId,
        quantity,
        remark,
      });
      const res = await getOrderPreviewProduct(key, { showToast: true });

      console.log(res);

      router.push("/submit/order?type=product&key=" + key);
    } catch (err: any) {
    } finally {
      setissub(false);
    }
  };
  const add = async () => {
    if (!user) return router.push("/login");
    if (!validateSkuSelection()) return;
    const data = {
      source: params.source,
      sourceProductId: params.sourceProductId,
      sourceSkuId: currentSku.skuID,
      sourceMpId: goodsInfo?.productInfo?.sourceMpId,
      sourceMpSkuId: currentSku.sourceMpSkuId,
      specId: currentSku?.specId,
      quantity,
      remark,
    };

    try {
      await addCartItem(data);
    } catch { }
  };
  // 切换选择状态
  const changeSelectedStatus = (index: any, indey: any) => {
    const cloned: any = structuredClone(goodsInfo);

    cloned?.productInfo.skuPropList.forEach((spec: any, idx: number) => {
      if (idx === index) {
        spec.propValueList.forEach((val: any, idy: number) => {
          if (val.selected && idy === indey) {
            val.selected = false;
          } else if (!val.selected && idy === indey) {
            val.selected = true;
          } else {
            val.selected = false;
          }
        });
      }
    });
    updateDisabledStatus(cloned);
  };

  // 更新选中状态
  const updateDisabledStatus = (cloned: any) => {
    cloned?.productInfo.skuPropList.forEach((spec: any, index: number) => {
      const selectedValues = getSelectedValues(cloned.productInfo.skuPropList);

      spec.propValueList.forEach((val: any) => {
        selectedValues[index] = `${spec.propId}:${val.valueID}`;
        const key = selectedValues.filter((value: any) => value).join("-");

        if (pathMap[key]) {
          val.disabled = false;
        } else {
          val.disabled = true;
        }
      });
    });

    setGoodsInfo(cloned);
  };
  const currentSku = useMemo(() => {
    if (!goodsInfo) return;
    const selectedValues = getSelectedValues(
      goodsInfo?.productInfo.skuPropList,
    );
    const selectedUrl = _getSelectedImg(
      goodsInfo?.productInfo.skuPropList,
      goodsInfo?.productInfo?.skuPropImageMap,
    );

    console.log("sku", selectedValues.join(";"));

    if (selectedUrl) setCurrentImg(selectedUrl);

    const currentSku = goodsInfo.productInfo.skuList.find((item: any) => {
      if (!item?.propId_valueId) return false;

      return item?.propId_valueId == selectedValues.join(";");
    });

    if (currentSku) {
      console.log("currentSku", currentSku);

      return currentSku;
    }
  }, [goodsInfo]); // 依赖 cart，当 cart 变化时才重新计算

  // Calculate display values for sales, weight, etc.
  const displayValues = useMemo(() => {
    const defaultSales = goodsInfo?.productInfo?.sales || "--";
    const daysToArrival = goodsInfo?.productInfo?.daysToArrival || "--";

    let weight = "--";
    let size = "--";

    // Attempt to find specific SKU info from skuVmMap if available
    if (goodsInfo?.productInfo?.skuVmMap) {
      // Priority: Current SKU -> First available SKU in map -> Default
      const skuId = currentSku?.skuID;
      const skuData = skuId ? goodsInfo.productInfo.skuVmMap[skuId] : null;

      // Fallback to first item in skuVmMap if current not found, or just keep default
      const firstSkuKey = Object.keys(goodsInfo.productInfo.skuVmMap)[0];
      const fallbackData = firstSkuKey
        ? goodsInfo.productInfo.skuVmMap[firstSkuKey]
        : null;

      const activeData = skuData || fallbackData;

      if (activeData) {
        if (activeData.weight) weight = activeData.weight;
        if (activeData.length && activeData.width && activeData.height) {
          size = `${activeData.length}x${activeData.width}x${activeData.height}`;
        }
      }
    }

    return {
      sales: defaultSales,
      daysToArrival,
      weight,
      size,
    };
  }, [goodsInfo, currentSku]);

  const handleFavorite = async () => {
    try {
      await favoriteProduct(
        params.source as any,
        params.sourceProductId as string,
        isFavorite ? 0 : 1,
      );
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    setisLoading(true);
    getGoodsInfo({ ...params })
      .then((data: any) => {
        console.log("get goods");
        setIsFavorite(data.collection);
        // 数据初始化
        const cloned = structuredClone(data);
        let pathMap = generateDynamicSkuPathDict(cloned.productInfo);

        setPathMap(pathMap);
        cloned.productInfo.skuPropList.forEach((spec: any) => {
          spec.propValueList.forEach((value: any) => {
            value.selected = false;
            if (pathMap[`${spec.propId}:${value.valueID}`]) {
              value.disabled = false;
            } else {
              value.disabled = true;
            }
          });
        });
        setCurrentImg(cloned?.productInfo?.imgList[0] ?? "");
        setGoodsInfo(cloned);
      })
      .catch((err) => {
        console.log("err", err);
        setIsOpen1(true);
      })
      .finally(() => {
        setisLoading(false);
      });
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const topOffset = containerRef.current.getBoundingClientRect().top;
      const STICKY_THRESHOLD = 1; // 微小误差允许
      const STICKY_HEIGHT = "calc(78vh + 80px)";
      const NORMAL_HEIGHT = "78vh";

      const isSticky =
        lastTop !== null && Math.abs(topOffset - lastTop) < STICKY_THRESHOLD;

      // 只有状态变化才更新 height，避免抖动
      setHeight((prev) =>
        isSticky && prev !== STICKY_HEIGHT
          ? STICKY_HEIGHT
          : !isSticky && prev !== NORMAL_HEIGHT
            ? NORMAL_HEIGHT
            : prev,
      );

      setLastTop(topOffset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastTop]);

  return (
    <div className="bg-[#fff] ">
      <div className="flex  container mx-auto  my-[15px] mt-10">
        {isLoading ? (
          <div className="flex gap-5 w-full">
            <Skeleton className="rounded-lg flex-[4] ">
              <div className="h-[500px] rounded-lg bg-default-300  pt-0" />
            </Skeleton>
            <Skeleton className="rounded-lg flex-[6] max-w-[60%]">
              <div className="h-24 rounded-lg bg-default-300 max-w-[60%]" />
            </Skeleton>
          </div>
        ) : (
          <>
            <div className="flex-[4] p-10 pt-0 overflow-auto scrollbar-hide">
              <div className="w-[100%] flex gap-2">
                <Image
                  alt="123"
                  preview={false}
                  referrerPolicy="no-referrer"
                  src={currentImg}
                  width="100%"
                />
              </div>

              <div className="mt-2 grid grid-cols-5 justify-between">
                {goodsInfo?.productInfo?.imgList?.map((src: string) => (
                  <Image
                    key={src}
                    alt="123"
                    className={`  ${currentImg === src ? "border-[#f0700c] border-2" : ""} cursor-pointer`}
                    height={100}
                    preview={false}
                    referrerPolicy="no-referrer"
                    src={src}
                    width={100}
                    onClick={() => setCurrentImg(src)}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center px-2 py-2 mt-4">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                  role="button"
                  onClick={handleFavorite}
                >
                  {isFavorite ? (
                    <IoStar className="text-2xl text-[#f0700c]" />
                  ) : (
                    <IoStarOutline className="text-xl" />
                  )}
                  <span className={isFavorite ? "text-[#f0700c]" : ""}>
                    {isFavorite ? t("favorited") : t("favorite")}
                  </span>
                </div>
                <CopyText
                  text={
                    typeof window !== "undefined"
                      ? `${window.location.href}${user?.inviteCode
                        ? (window.location.href.includes("?") ? "&" : "?") +
                        "inviteCode=" +
                        user.inviteCode
                        : ""
                      }`
                      : ""
                  }
                  toastMessage="Link Copied"
                >
                  <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                    <IoShareSocialOutline className="text-xl" />
                    <span>{t("share")}</span>
                  </div>
                </CopyText>
              </div>
              <div className="">
                <div className={subtitle()}>{t("singleItemSalesTitle")}</div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center flex flex-col justify-between">
                    <div className="text-gray-500 text-sm mb-1">
                      {t("avgArrivalTime")}
                    </div>
                    <div className="font-semibold">
                      {displayValues.daysToArrival} days
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center flex flex-col justify-between">
                    <div className="text-gray-500 text-sm mb-1">
                      {t("salesVolume")}
                    </div>
                    <div className="font-semibold">{displayValues.sales}</div>
                  </div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center flex flex-col justify-between">
                    <div className="text-gray-500 text-sm mb-1">
                      {t("weightWithUnit")}
                    </div>
                    <div className="font-semibold">{displayValues.weight}</div>
                  </div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center flex flex-col justify-between">
                    <div className="text-gray-500 text-sm mb-1">
                      {t("volumeWithUnit")}
                    </div>
                    <div className="font-semibold">{displayValues.size}</div>
                  </div>
                </div>
              </div>
              {goodsInfo?.productInfo?.qcList?.length && (
                <div>
                  <h3 className={subtitle()}>Product QC</h3>
                  <div className="grid grid-cols-5 justify-between">
                    <Image.PreviewGroup
                      preview={{
                        getContainer: () => document.body, // 让预览挂在这个 div 内
                      }}
                    >
                      {goodsInfo.productInfo.qcList.map((url: string) => (
                        <Image key={url} height={100} src={url} width={100} />
                      ))}
                    </Image.PreviewGroup>
                    {/* {goodsInfo?.productInfo?.qcList?.map(
                      (src: string, index: number) => {
                        return (
                          <Image
                            key={index}
                            alt="123"
                            className=" object-fill w-[100px] h-[100px]"
                            radius="none"
                            referrerPolicy="no-referrer"
                            src={src}
                          />
                        );
                      },
                    )} */}
                  </div>
                </div>
              )}

              <div>
                <h3 className={subtitle()}>{t("productDetails")}</h3>
                <div>
                  {goodsInfo?.productDetail?.productDescImgList?.map(
                    (src: string, index: number) => {
                      return (
                        <Image
                          key={index}
                          alt="123"
                          className=" object-fill "
                          preview={false}
                          referrerPolicy="no-referrer"
                          src={src}
                        />
                      );
                    },
                  )}
                </div>
              </div>
            </div>
            <div className="flex-[6] max-w-[60%]">
              <div
                ref={containerRef}
                className="sticky top-28 flex flex-col  "
                style={{ height }}
              >
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex gap-2 items-center">
                    <SourceIcon source={goodsInfo?.productInfo?.source} />
                    <p className="font-bold text-lg">
                      {goodsInfo?.productInfo?.sellerInfo?.shopName}
                    </p>
                  </div>
                  <Divider className="border-1" />
                  <h1 className={subtitle()}>
                    {goodsInfo?.productInfo?.title}
                  </h1>
                  <div className="flex -m-2 ml-0 gap-2 text-sm text-[#f0700c]">
                    <a
                      className="flex items-center gap-1"
                      href={goodsInfo?.productInfo?.productUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <IoIosLink />
                      {t("originalLink")}
                    </a>
                    <button
                      className="flex items-center gap-1"
                      onClick={() => window.location.reload()}
                    >
                      <GrPowerReset />
                      {t("refresh")}
                    </button>
                  </div>
                  <div className={priceFont({ size: "xl2" })}>
                    {currency.label} {currency.symbol}
                    {goodsInfo?.productInfo.price
                      ? currentSku?.price
                        ? safeMul(currentSku?.price, quantity)
                        : safeMul(goodsInfo?.productInfo.price, quantity)
                      : null}
                  </div>
                  <div className={lightFont({ size: "sm" })}>
                    {t("afterPaymentNotice")}
                  </div>
                  <div className={commonCard()}>
                    <div className=" text-sm py-2 px-1">
                      <div>
                        {t("shippingStep1")}
                        <span className=" text-black  bg-white px-4 py-1 mx-2  text-xs rounded-sm">
                          {goodsInfo?.productInfo?.postFee || 0.0}
                        </span>
                        {currency.label}
                      </div>
                      <div className="mt-2">{t("shippingStep2")}</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-y-auto scrollbar-hide flex flex-col gap-4 ">
                  {goodsInfo?.productInfo?.skuPropList.map(
                    (specs: any, index: number) => {
                      return (
                        <div key={specs.propName}>
                          <div className={subtitle()}>{specs.propName}</div>
                          <div className="flex gap-2 flex-wrap">
                            {specs.propValueList.map(
                              (spec: any, indey: number) => {
                                return (
                                  <div
                                    key={spec.valueName}
                                    data-index={spec.selected}
                                  >
                                    <Button
                                      className={`pl-2 bg-white ${spec.selected ? "border-[#f0700c] text-[#f0700c]" : "border-[#ccc]"} `}
                                      isDisabled={spec.disabled}
                                      radius="md"
                                      size={spec.imageUrl ? "md" : "sm"}
                                      variant="bordered"
                                      onPress={() =>
                                        changeSelectedStatus(index, indey)
                                      }
                                    >
                                      {spec.imageUrl ? (
                                        <Image
                                          alt="avatar"
                                          height={32}
                                          preview={false}
                                          referrerPolicy="no-referrer"
                                          src={spec.imageUrl}
                                          width={32}
                                        />
                                      ) : null}
                                      {spec.valueName}
                                    </Button>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                  <div>
                    <div className={subtitle()}>{t("quantity")}</div>
                    <div className="w-[20%]">
                      <Stepper
                        value={quantity}
                        onChange={(value) => setQuantity(value)}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className={subtitle()}>{t("remark")}</div>
                    <Textarea
                      placeholder={t("remarkPlaceholder")}
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                  </div>

                  <div className={commonCard({ type: "grey" })}>
                    <div className={subtitle()}>{t("disclaimer")}</div>
                    <div className="text-sm">
                      <div>{t("disclaimerDescription")}</div>
                      <Checkbox
                        className="mt-2 "
                        color="primary"
                        defaultSelected={true}
                        isSelected={isChecked}
                        onValueChange={(e) => {
                          setIsChecked(e);
                        }}
                      >
                        <span className="text-[#676969]">
                          {t("agreeDisclaimer")}
                        </span>
                      </Checkbox>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex gap-2  mt-4 ">
                  <Button
                    className="flex-1 h-16"
                    isLoading={isAdding}
                    onPress={add}
                  >
                    {t("addToCart")}
                  </Button>
                  <Button
                    className=" h-16 flex-1"
                    color="primary"
                    isDisabled={isAdding}
                    isLoading={issub}
                    onPress={handleBuyNow}
                  >
                    {t("buyNow")}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <CommonModal
        hideCloseButton={true}
        confirmText={t("continueShopping")}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen1}
        showCancel={false}
        size="xl"
        title={t("riskNotice")}
        onConfirm={() => {
          router.push("/");
        }}
        onOpenChange={setIsOpen1}
      >
        <div>
          <div className="rounded-lg bg-[#ffeee1] p-2 my-4 text-sm">
            {t("riskDescription")}
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
