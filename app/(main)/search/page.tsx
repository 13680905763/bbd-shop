"use client";
import {
  Card,
  CardBody,
  Tab,
  Tabs,
  Image,
  CardFooter,
  Spinner,
} from "@heroui/react";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getGoodsList, getGoodsListByKeyword } from "@/services";
import { useGlobalStore } from "@/store";

export default function SearchPage() {
  const { currency } = useGlobalStore();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const taobaoId = searchParams.get("TAOBAO");
  const alibabaId = searchParams.get("1688");
  const keyword = searchParams.get("keyword");

  const [selectedTab, setSelectedTab] = useState<string>("TAOBAO");
  const router = useRouter();
  const fetchData = useCallback(
    async (pageNum: number) => {
      const id = selectedTab === "TAOBAO" ? taobaoId : alibabaId;
      const source = selectedTab;

      if (!id && !keyword) return;

      try {
        setLoading(true);
        let res: any;

        if (keyword) {
          res = await getGoodsListByKeyword({
            keyword,
            source,
            current: pageNum,
            size: 20,
          });
        } else {
          res = await getGoodsList({
            imageId: id,
            source,
            current: pageNum,
            size: 20,
          });
        }

        const records = res?.records || res || [];

        if (records.length === 0) {
          setHasMore(false);

          return;
        }

        if (records.length < 20) setHasMore(false);

        setList((prev) => [...prev, ...records]);
      } catch (err) {
        console.error("搜索失败:", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedTab, taobaoId, alibabaId, keyword],
  );

  // 当 URL 参数变化时，重置状态并加载第一页数据
  useEffect(() => {
    setList([]);
    setPage(1);
    setHasMore(true);

    // 只在有参数时触发
    if (taobaoId || alibabaId || keyword) fetchData(1);
  }, [taobaoId, alibabaId, keyword, selectedTab, fetchData]);

  // 分页滚动加载
  useEffect(() => {
    if (page === 1) return; // 第一页由上面的 useEffect 已经加载
    fetchData(page);
  }, [page, fetchData]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const tabs = keyword ? ["TAOBAO", "1688", "WEIDIAN"] : ["TAOBAO", "1688"];

  return (
    <div className="w-full bg-[#f8f8f8] py-10">
      <div className="container mx-auto">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0",
            cursor: "w-full bg-[#f0700c]",
            tab: "max-w-fit px-0 h-12 text-2xl",
            tabContent: "group-data-[selected=true]:text-[#f0700c]",
          }}
          color="primary"
          selectedKey={selectedTab}
          variant="underlined"
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          {tabs.map((tabKey) => (
            <Tab key={tabKey} title={<span>{tabKey}</span>}>
              <div>
                {loading && list.length === 0 ? (
                  <div className="flex justify-center items-center h-[50vh]">
                    <Spinner color="primary" size="lg" />
                  </div>
                ) : list.length > 0 ? (
                  <div className="gap-5 grid grid-cols-2 sm:grid-cols-5">
                    {list.map((item: any, index: number) => (
                      <Card
                        key={index}
                        isPressable
                        radius="none"
                        onPress={() =>
                          router.push(
                            `/goods/${item.source}/${item.sourceProductId}`,
                          )
                        }
                      >
                        <CardBody className="overflow-visible p-0">
                          <Image
                            alt={item.sourceProductId}
                            className="w-full object-fill h-[300px]"
                            radius="none"
                            referrerPolicy="no-referrer"
                            src={item.imageUrl}
                            width="100%"
                          />
                        </CardBody>
                        <CardFooter className="text-small">
                          <div className="text-left">
                            <b className="line-clamp-2">{item.title}</b>
                            <p className="text-money-lg">
                              {" "}
                              {currency.symbol}
                              {item.price}
                            </p>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    暂无匹配结果
                  </div>
                )}
                {loading && hasMore && list.length > 0 && (
                  <div className="flex justify-center items-center py-5">
                    <Spinner color="primary" size="lg" />
                  </div>
                )}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
