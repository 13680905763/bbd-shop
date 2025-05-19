"use client";
import React from "react";
import useSWR from "swr";
import { Avatar, Button, Checkbox, Image, Textarea } from "@heroui/react";
import { produce } from "immer";

import {
  commonCard,
  lightFont,
  priceFont,
  subtitle,
} from "@/components/primitives";
import Stepper from "@/components/stepper";

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
      dict[combination].push(sku.skuID);
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

const postFetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ source: "TAOBAO", productId: "638204709583" }),
  });
  const raw = await res.json();

  // 数据初始化
  const cloned = structuredClone(raw);

  cloned.pathMap = generateDynamicSkuPathDict(cloned.data.productInfo);
  cloned.data.productInfo.skuPropList.forEach((spec: any) => {
    spec.propValueList.forEach((value: any) => {
      value.selected = false;
      if (cloned.pathMap[value.valueName]) {
        value.disabled = false;
      } else {
        value.disabled = true;
      }
    });
  });

  return cloned;
};

export default function GoodsPage() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/proxy/product/search/id",
    postFetcher,
  );

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;
  // console.log("data", data.data.productInfo.skuPropList);

  const { productDetail, productInfo } = data?.data;
  const { skuPropList } = productInfo;

  // 切换选择状态
  const changeSelectedStatus = (index: any, indey: any) => {
    mutate((prev: any) => {
      if (!prev) return prev;

      return produce(prev, (draft: any) => {
        draft.data.productInfo.skuPropList.forEach((spec: any, idx: number) => {
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
      });
    }, false);

    undateDisabledStatus();
  };
  const getSelectedValues = (specs: any) => {
    const arr: any = [];

    specs.forEach((spec: any) => {
      const selectedVal = spec.propValueList.find((item: any) => item.selected);

      arr.push(selectedVal ? selectedVal.valueName : undefined);
    });

    return arr;
  };
  // 更新选中状态
  const undateDisabledStatus = () => {
    mutate((prev: any) => {
      if (!prev) return prev;

      return produce(prev, (draft: any) => {
        draft.data.productInfo.skuPropList.forEach(
          (spec: any, index: number) => {
            const selectedValues = getSelectedValues(
              draft.data.productInfo.skuPropList,
            );

            spec.propValueList.forEach((val: any) => {
              selectedValues[index] = val.valueName;
              console.log("selectedValues", selectedValues, val.valueName);

              const key = selectedValues
                .filter((value: any) => value)
                .join("-");

              // console.log("key", key);
              if (draft.pathMap[key]) {
                val.disabled = false;
              } else {
                val.disabled = true;
              }
            });
          },
        );
      });
    }, false);
  };

  return (
    <div className="bg-[#fff]">
      <div className="flex  container mx-auto  my-[15px] ">
        <div className="flex-[4] p-10 pt-0 overflow-auto scrollbar-hide">
          <div className="w-[100%]">
            <Image
              alt="123"
              className=" object-fill "
              radius="sm"
              src={productInfo?.imgList[0]}
              width="100%"
            />
          </div>

          <div className="flex mt-5 gap-2">
            {productInfo?.imgList?.map((src: string) => (
              <div key={src} className=" flex-1">
                <Image key={src} alt="123" radius="sm" src={src} />
              </div>
            ))}
          </div>
          <div>
            <h3 className={subtitle()}>商品詳情</h3>
            <div>
              {productDetail?.productDescImgList?.map(
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
              <h1 className={subtitle()}>{productInfo.title}</h1>
              <div className={priceFont({ size: "xl2" })}>
                {productInfo.price}
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
              {skuPropList.map((specs: any, index: number) => {
                return (
                  <div key={specs.propName}>
                    <div className={subtitle()}>{specs.propName}</div>
                    <div className="flex gap-2 flex-wrap">
                      {specs.propValueList.map((spec: any, indey: number) => {
                        return (
                          <div key={spec.valueName} data-index={spec.selected}>
                            <Button
                              className={`pl-2 bg-white ${spec.selected ? "border-[#f0700c] text-[#f0700c]" : "border-[#ccc]"} `}
                              isDisabled={spec.disabled}
                              radius="lg"
                              size={spec.imageUrl ? "lg" : "md"}
                              variant="bordered"
                              onPress={() => changeSelectedStatus(index, indey)}
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
              })}
              <div>
                <div className={subtitle()}>数量</div>
                <div className="w-[20%]">
                  <Stepper />
                </div>
              </div>
              <div className="mb-4">
                <div className={subtitle()}>备注</div>
                <Textarea placeholder="Enter your description" />
              </div>
              <div className={commonCard({ type: "grey" })}>
                <div className={subtitle()}>免责声明</div>
                <div className="text-sm">
                  <div>
                    Hoobuy上展示的所有代购商品均来自第三方代购平台，非Hoobuy直接销售。因此，Hoobuy对侵犯知识产权和侵犯商品著作权所引起的问题不承担任何责任和法律责任。使用Hoobuy代购服务即表示您默认接受上述风险。
                  </div>
                  <Checkbox className="mt-2 " color="primary">
                    <span className="text-[#676969]">
                      我已阅读并同意Hoobuy的免责声明
                    </span>
                  </Checkbox>
                </div>
              </div>
              <div className="flex-1 flex gap-2  mt-4 ">
                <Button className="flex-1 h-16">加入购物车</Button>
                <Button className=" h-16 flex-1" color="primary">
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
