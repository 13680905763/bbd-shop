"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  addToast,
  Avatar,
  Button,
  Checkbox,
  Divider,
  Image,
  Textarea,
} from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { GrPowerReset } from "react-icons/gr";
import { IoIosLink } from "react-icons/io";

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
        propertyMap[skuPropMap[propName]] = skuPropValueMap[propValue];
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
  const params = useParams();
  const [remark, setRemark] = useState<string>();
  const [quantity, setQuantity] = useState<number>(1);

  const [goodsInfo, setGoodsInfo] = useState<any>();
  const [pathMap, setPathMap] = useState<any>(null);
  const [isLoading, setisLoading] = useState<any>(false);
  const [isCheck, setIsCheck] = useState<any>(false);
  const [currentImg, setCurrentImg] = useState<string>();
  const router = useRouter();
  const handleBuyNow = async () => {
    if (isLoading) return;
    if (!isCheck) {
      addToast({
        title: "请勾选同意协议",
        color: "danger",
        timeout: 1000,
      });

      return;
    }
    if (!currentSku) {
      addToast({
        title: "请选择商品规格",
        color: "danger",
        timeout: 1000,
      });

      return;
    }
    setisLoading(true);

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
      setisLoading(false);
    }
  };
  const add = async () => {
    if (isLoading) return;
    if (!isCheck) {
      addToast({
        title: "请勾选同意协议",
        color: "danger",
        timeout: 1000,
      });

      return;
    }
    if (!currentSku) {
      addToast({
        title: "请选择商品规格",
        color: "danger",
        timeout: 1000,
      });

      return;
    }
    setisLoading(true);

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
      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
    } catch {
    } finally {
      setisLoading(false);
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

    // setGoodsInfo(cloned);

    undateDisabledStatus(cloned);
  };
  const getSelectedValues = (specs: any) => {
    const arr: any = [];

    specs.forEach((spec: any) => {
      const selectedVal = spec.propValueList.find((item: any) => item.selected);

      arr.push(selectedVal ? selectedVal.valueName : undefined);
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
    console.log(666, url);

    return url;
  };
  // 更新选中状态
  const undateDisabledStatus = (cloned: any) => {
    // const cloned: any = structuredClone(goodsInfo);

    // console.log("goodsInfo666", goodsInfo);

    cloned?.productInfo.skuPropList.forEach((spec: any, index: number) => {
      const selectedValues = getSelectedValues(cloned.productInfo.skuPropList);

      spec.propValueList.forEach((val: any) => {
        selectedValues[index] = val.valueName;
        // console.log("selectedValues", selectedValues, val.valueName);
        const key = selectedValues.filter((value: any) => value).join("-");

        // console.log("key", key);
        if (pathMap[key]) {
          val.disabled = false;
        } else {
          val.disabled = true;
        }
      });
    });
    // console.log("cloned", cloned);

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
      // console.log("item", item);

      return (
        selectedValues.filter((i: any) => item?.propName_valueName.includes(i))
          ?.length == selectedValues.length
      );
    });

    if (currentSku) {
      // setCurrentImg(currentSku.imgUrl);
      console.log("currentSku", currentSku);

      return currentSku;
    }
    // else return goodsInfo.productInfo.skuList[0];
  }, [goodsInfo]); // 依赖 cart，当 cart 变化时才重新计算

  useEffect(() => {
    getGoodsInfo({ ...params }).then((data: any) => {
      // 数据初始化
      const cloned = structuredClone(data);
      let pathMap = generateDynamicSkuPathDict(cloned.productInfo);

      setPathMap(pathMap);
      cloned.productInfo.skuPropList.forEach((spec: any) => {
        spec.propValueList.forEach((value: any) => {
          value.selected = false;
          console.log("value.valueName", value.valueName, pathMap);

          if (pathMap[value.valueName]) {
            value.disabled = false;
          } else {
            value.disabled = true;
          }
        });
      });
      console.log("cloned", cloned);

      setCurrentImg(cloned?.productInfo?.imgList[0] ?? "");
      setGoodsInfo(cloned);
    });
  }, []);

  return (
    <div className="bg-[#fff] ">
      <div className="flex  container mx-auto  my-[15px] mt-16">
        <div className="flex-[2] p-10 pt-0 overflow-auto scrollbar-hide">
          <div className="w-[100%] flex gap-2">
            <Image
              alt="123"
              className=" object-fill "
              radius="sm"
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
                  src={src}
                />
              </button>
            ))}
          </div>
          <h3 className={subtitle()}>购买记录</h3>
          <div className="card-grey my-2 flex ">
            <div className="flex-1 text-gray-base gap-2 flex flex-col">
              <div>销量 0</div>
              <div>重量（g）--</div>
            </div>
            <div className="flex-1 text-gray-base gap-2 flex flex-col">
              <div>平均送达时间 --days</div>
              <div>尺码（cm3）--</div>
            </div>
          </div>
          <div>
            <h3 className={subtitle()}>商品詳情</h3>
            <div>
              {goodsInfo?.productDetail?.productDescImgList?.map(
                (src: string, index: number) => {
                  return (
                    <Image
                      key={index}
                      alt="123"
                      className=" object-fill "
                      radius="none"
                      src={src}
                      width="100%"
                    />
                  );
                },
              )}
            </div>
          </div>
        </div>
        <div className="flex-[5] max-w-[55%]">
          <div className="sticky top-20 flex  h-[calc(100vh-80px)] ">
            <div className="overflow-y-auto scrollbar-hide flex flex-col gap-4 pb-7">
              <div className="flex gap-2 items-center">
                <SourceIcon source={goodsInfo?.productInfo?.source} />
                <p className="font-bold text-lg">
                  {goodsInfo?.productInfo?.sellerInfo?.shopName}
                </p>
              </div>
              <Divider className="border-1" />
              <h1 className={subtitle()}>{goodsInfo?.productInfo?.title}</h1>
              <div className="flex -m-2 ml-0 gap-2 text-sm text-[#f0700c]">
                <a
                  className="flex items-center gap-1"
                  href={goodsInfo?.productInfo?.productUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <IoIosLink />
                  原链接
                </a>
                <button
                  className="flex items-center gap-1"
                  onClick={() => window.location.reload()}
                >
                  <GrPowerReset />
                  刷新
                </button>
              </div>
              <div className={priceFont({ size: "xl2" })}>
                {currentSku?.price || goodsInfo?.productInfo.price}
              </div>
              <div className={lightFont({ size: "sm" })}>
                支付后，我们会在09:00-18:00（UTC+8）为您进行代购服务
              </div>
              <div className={commonCard()}>
                <div className=" text-sm py-2 px-1">
                  <div>1、卖家 到 BBD 仓库,国内运费 0.00 CNY</div>
                  <div>2、BBD 仓库 到 您的地址,估算国际运费</div>
                </div>
              </div>
              {goodsInfo?.productInfo?.skuPropList.map(
                (specs: any, index: number) => {
                  return (
                    <div key={specs.propName}>
                      <div className={subtitle()}>{specs.propName}</div>
                      <div className="flex gap-2 flex-wrap">
                        {specs.propValueList.map((spec: any, indey: number) => {
                          return (
                            <div
                              key={spec.valueName}
                              data-index={spec.selected}
                            >
                              <Button
                                className={`pl-2 bg-white ${spec.selected ? "border-[#f0700c] text-[#f0700c]" : "border-[#ccc]"} `}
                                isDisabled={spec.disabled}
                                radius="lg"
                                size={spec.imageUrl ? "lg" : "md"}
                                variant="bordered"
                                onPress={() =>
                                  changeSelectedStatus(index, indey)
                                }
                              >
                                {spec.imageUrl ? (
                                  <Avatar radius="none" src={spec.imageUrl} />
                                ) : null}
                                {spec.valueName}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                },
              )}
              <div>
                <div className={subtitle()}>数量</div>
                <div className="w-[20%]">
                  <Stepper
                    value={quantity}
                    onChange={(value) => setQuantity(value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className={subtitle()}>备注</div>
                <Textarea
                  placeholder="Enter your description"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
              <div className={commonCard({ type: "grey" })}>
                <div className={subtitle()}>免责声明</div>
                <div className="text-sm">
                  <div>
                    BBDbuy上展示的所有代购商品均来自第三方代购平台，非BBDbuy直接销售。因此，BBDbuy对侵犯知识产权和侵犯商品著作权所引起的问题不承担任何责任和法律责任。使用BBDbuy代购服务即表示您默认接受上述风险。
                  </div>
                  <Checkbox
                    className="mt-2 "
                    color="primary"
                    isSelected={isCheck}
                    onValueChange={(e) => {
                      setIsCheck(e);
                    }}
                  >
                    <span className="text-[#676969]">
                      我已阅读并同意BBDbuy的免责声明
                    </span>
                  </Checkbox>
                </div>
              </div>
              <div className="flex-1 flex gap-2  mt-4 ">
                <Button
                  className="flex-1 h-16"
                  isLoading={isLoading}
                  onPress={add}
                >
                  加入购物车
                </Button>
                <Button
                  className=" h-16 flex-1"
                  color="primary"
                  isLoading={isLoading}
                  onPress={handleBuyNow}
                >
                  立即购买
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
