"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  addToast,
  Button,
  Checkbox,
  Divider,
  Image,
  Skeleton,
  Textarea,
} from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { GrPowerReset } from "react-icons/gr";
import { IoIosLink } from "react-icons/io";
import { useTranslations } from "next-intl";

import {
  commonCard,
  lightFont,
  priceFont,
  subtitle,
} from "@/components/primitives";
import Stepper from "@/components/stepper";
import { getGoodsInfo } from "@/services/goods";
import { addCart } from "@/services/cart";
import {
  createOrderPreviewKeyByProduct,
  getOrderPreviewProduct,
} from "@/services";
import { queryClient } from "@/lib/react-query";
import SourceIcon from "@/components/common/source-icon";
import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";
import { safeMul } from "@/utils/number";

interface Sku {
  skuID: string;
  stock: number;
  propId_valueId: string;
  // 其他可能的SKU属性...
}

interface ProductInfo {
  skuList: Sku[];
  skuPropMap: Record<string, string>; // 属性ID到属性名的映射
  skuPropValueMap: Record<string, string>; // 属性值ID到属性值名的映射
}

type SkuPathDict = Record<string, string[]>; // 组合路径到SKU ID数组的映射

/**
 * 生成动态SKU路径字典
 * @param productInfo 产品信息对象
 * @returns 返回SKU路径字典，键为属性组合字符串，值为对应的SKU ID数组
 */
function generateDynamicSkuPathDict(productInfo: ProductInfo): SkuPathDict {
  const dict: SkuPathDict = {};
  const { skuList, skuPropMap, skuPropValueMap } = productInfo;

  skuList.forEach((sku) => {
    if (sku.stock <= 0) return;

    // 解析所有属性
    const props = sku.propId_valueId.split(";");
    const propertyMap: Record<string, string> = {};

    // 提取属性名和值
    props.forEach((prop) => {
      const parts = prop.split(":");

      if (parts.length !== 2) return; // 跳过格式不正确的属性

      const [propName, propValue] = parts;

      // 确保属性名和值在映射表中存在
      if (skuPropMap[propName] && skuPropValueMap[propValue]) {
        // propertyMap["k" + propName] = propValue;
        propertyMap["k" + propName] = prop;
      }
    });

    // 获取所有属性名并按字母排序确保一致性
    const propNames = Object.keys(propertyMap);

    // 生成所有可能的组合键
    const allCombinations = getAllCombinations(propNames, propertyMap);

    // 将SKU ID添加到所有相关组合中
    allCombinations.forEach((combination) => {
      if (!dict[combination]) {
        dict[combination] = [];
      }
      dict[combination].push(sku?.skuID);
    });
  });
  console.log("dict", dict);

  return dict;
}

/**
 * 生成所有可能的属性组合
 * @param propNames 属性名数组
 * @param propertyMap 属性名到属性值的映射
 * @returns 返回所有可能的属性组合字符串数组
 */
function getAllCombinations(
  propNames: string[],
  propertyMap: Record<string, string>,
): string[] {
  const combinations: string[] = [];
  const n = propNames.length;
  const total = 1 << n; // 2^n 种可能性

  for (let mask = 1; mask < total; mask++) {
    const current: string[] = [];

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        current.push(propertyMap[propNames[i]]);
      }
    }
    combinations.push(current.join("-"));
  }

  return combinations;
}

export default function GoodsPage() {
  const t = useTranslations("Goods");
  const params = useParams();
  const { currency } = useGlobalStore();
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
  const [isCheck, setIsCheck] = useState<any>(false);
  const [currentImg, setCurrentImg] = useState<string>();
  const router = useRouter();

  // useEffect(() => {
  //   const init = async () => {
  //     console.log("初始化 store");

  //     await fetchConfig(); // 等待异步执行完成
  //   };

  //   init();
  // }, []);
  const handleBuyNow = async () => {
    if (issub) return;
    if (!isCheck) {
      addToast({
        title: t("agreeTerms"),
        color: "danger",
        timeout: 1000,
      });

      return;
    }
    if (!currentSku) {
      addToast({
        title: t("selectSku"),
        color: "danger",
        timeout: 1000,
      });

      return;
    }
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

      router.push("/order/submit-order?type=product&key=" + key);
    } catch (err: any) {
    } finally {
      setissub(false);
    }
  };
  const add = async () => {
    if (issub) return;
    if (!isCheck) {
      addToast({
        title: t("agreeTerms"),
        color: "danger",
        timeout: 1000,
      });

      return;
    }
    if (!currentSku) {
      addToast({
        title: t("selectSku"),
        color: "danger",
        timeout: 1000,
      });

      return;
    }
    setissub(true);

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
      await addCart(data);
      await queryClient.removeQueries({ queryKey: ["cartList"] });
      await queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
    } catch {
    } finally {
      setissub(false);
    }
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
    undateDisabledStatus(cloned);
  };
  const getSelectedValues = (specs: any) => {
    const arr: any = [];

    specs.forEach((spec: any) => {
      const selectedVal = spec.propValueList.find((item: any) => item.selected);

      arr.push(
        selectedVal ? `${spec.propId}:${selectedVal.valueID}` : undefined,
      );
    });

    return arr;
  };
  const getSelectedImg = (specs: any) => {
    let url: string = "";

    specs.forEach((spec: any) => {
      const selectedVal = spec.propValueList.find((item: any) => item.selected);

      console.log("selectedVal", selectedVal?.valueID);
      if (
        selectedVal?.valueID &&
        goodsInfo?.productInfo.skuPropImageMap[selectedVal.valueID]
      ) {
        url = goodsInfo?.productInfo.skuPropImageMap[selectedVal.valueID];
      }
    });
    // console.log("url", url);

    return url;
  };
  // 更新选中状态
  const undateDisabledStatus = (cloned: any) => {
    cloned?.productInfo.skuPropList.forEach((spec: any, index: number) => {
      const selectedValues = getSelectedValues(cloned.productInfo.skuPropList);

      spec.propValueList.forEach((val: any) => {
        selectedValues[index] = `${spec.propId}:${val.valueID}`;
        const key = selectedValues.filter((value: any) => value).join("-");

        console.log("key", key, !!pathMap[key]);

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
    const selectedUrl = getSelectedImg(goodsInfo?.productInfo.skuPropList);

    console.log("sku", selectedValues);
    console.log("url", selectedUrl);

    if (selectedUrl) setCurrentImg(selectedUrl);

    const currentSku = goodsInfo?.productInfo.skuList.find((item: any) => {
      return (
        selectedValues.filter((i: any) => item?.propId_valueId.includes(i))
          ?.length == selectedValues.length
      );
    });

    if (currentSku) {
      // setCurrentImg(currentSku.imgUrl);
      console.log("currentSku", currentSku);

      return currentSku;
    }
  }, [goodsInfo]); // 依赖 cart，当 cart 变化时才重新计算

  useEffect(() => {
    setisLoading(true);
    getGoodsInfo({ ...params })
      .then((data: any) => {
        console.log("get goods");

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

  console.log("goodsInfo?.productInfo.price", goodsInfo?.productInfo.price);

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
                  className=" object-fill "
                  radius="sm"
                  referrerPolicy="no-referrer"
                  src={currentImg}
                  width="100%"
                />
              </div>

              <div className="flex mt-2 gap-2 flex-wrap justify-start">
                {goodsInfo?.productInfo?.imgList?.map((src: string) => (
                  <button
                    key={src}
                    className=" "
                    onClick={() => setCurrentImg(src)}
                  >
                    <Image
                      key={src}
                      alt="123"
                      className={` w-[80px] h-[80px] ${currentImg === src ? "border-[#f0700c] border-3" : ""}`}
                      radius="sm"
                      referrerPolicy="no-referrer"
                      src={src}
                    />
                  </button>
                ))}
              </div>
              <h3 className={subtitle()}>{t("purchaseRecord")}</h3>

              <div className="card-grey my-2 flex ">
                <div className="flex-1 text-gray-base gap-2 flex flex-col">
                  <div>{t("sales")} 0</div>
                  <div>{t("weight")} --</div>
                </div>
                <div className="flex-1 text-gray-base gap-2 flex flex-col">
                  <div>{t("avgDelivery")} --days</div>
                  <div>{t("size")} --</div>
                </div>
              </div>
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
                          radius="none"
                          referrerPolicy="no-referrer"
                          src={src}
                          width="100%"
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
                    {/* {currentSku?.price
                      ? currentSku?.price * quantity
                      : goodsInfo?.productInfo.price * quantity} */}
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
                                          className="w-8 h-8 object-cover"
                                          radius="none"
                                          referrerPolicy="no-referrer"
                                          src={spec.imageUrl}
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
                        isSelected={isCheck}
                        onValueChange={(e) => {
                          setIsCheck(e);
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
                    isLoading={issub}
                    onPress={add}
                  >
                    {t("addToCart")}
                  </Button>
                  <Button
                    className=" h-16 flex-1"
                    color="primary"
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
        confirmText={t("continueShopping")}
        isDismissable={false}
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
