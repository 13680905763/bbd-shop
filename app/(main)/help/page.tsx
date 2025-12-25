"use client";

import React, { useState, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useFaqCategories } from "./categories";

export default function HelpCenter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const basePadding = 12; // 一级文字左边距
  const childOffset = 20; // 二级相对于一级偏移

  // URL 参数
  const urlCat = searchParams.get("cat");
  const urlArticle = searchParams.get("article");

  const faqCategories = useFaqCategories();
  const defaultCat = faqCategories[0];
  const defaultArticle = defaultCat.articles[0];

  // 状态
  const [openKey, setOpenKey] = useState(defaultCat.id);
  const [activeArticle, setActiveArticle] = useState(defaultArticle);

  // 初始化或 URL 变化时更新
  useEffect(() => {
    console.log("urlCat", urlCat);
    console.log("urlArticle", urlArticle);

    let cat = faqCategories.find((c) => c.id === urlCat) || defaultCat;
    let article =
      cat.articles.find((a) => a.id === urlArticle) ||
      (cat.id === urlCat ? cat.articles[0] : defaultArticle);

    console.log("cat", cat);
    console.log("article", article);

    setOpenKey(cat.id);
    setActiveArticle(article);

    // 如果 URL 没有参数，补上默认参数
    if (!urlCat || !urlArticle) {
      router.replace(`${pathname}?cat=${cat.id}&article=${article.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCat, urlArticle]);

  const updateURL = (catId: string, articleId: string) => {
    router.replace(`${pathname}?cat=${catId}&article=${articleId}`);
  };

  const handleArticleClick = (cat: any, article: any) => {
    setOpenKey(cat.id);
    setActiveArticle(article);
    updateURL(cat.id, article.id);
  };

  return (
    <div className="bg-[#f8f8f8]">
      <section className="container mx-auto max-w-[1440px] py-6 flex">
        {/* 左侧目录 */}
        <aside>
          <ul className="p-5 w-64 rounded-lg bg-white sticky top-20">
            {faqCategories.map((cat) => {
              const isOpen = openKey === cat.id;
              const isCatActive = cat.articles.some(
                (a) => a.id === activeArticle?.id,
              );

              return (
                <li key={cat.id} className="my-2">
                  {/* 一级目录 */}
                  <button
                    className={`min-h-10 w-full flex items-start gap-2 rounded-lg transition text-left 
                      whitespace-normal leading-6 py-2
                      ${
                        isCatActive
                          ? "text-[#f0700c]"
                          : "hover:bg-[#f5f5f5] text-gray-800"
                      }`}
                    style={{
                      paddingLeft: `${basePadding}px`,
                      paddingRight: 12,
                    }}
                    type="button"
                    onClick={() => setOpenKey(isOpen ? "" : cat.id)}
                  >
                    <span className="flex-1 font-medium">{cat.title}</span>

                    <FiChevronRight
                      className={`transition-transform duration-200 w-4 h-4 text-gray-500 mt-1
                        ${isOpen ? "rotate-90" : ""}`}
                    />
                  </button>

                  {/* 二级文章 */}
                  {isOpen && (
                    <ul className="mt-2 space-y-2">
                      {cat.articles.map((article) => {
                        const isActive = activeArticle?.id === article.id;

                        return (
                          <li key={article.id}>
                            <button
                              className={`min-h-10 w-full flex items-start rounded text-left transition 
                                whitespace-normal leading-6 py-2
                                ${
                                  isActive
                                    ? "bg-[#f0700c] text-white"
                                    : "hover:bg-[#f5f5f5] text-gray-800"
                                }`}
                              style={{
                                paddingLeft: `${basePadding + childOffset}px`,
                                paddingRight: 12,
                              }}
                              type="button"
                              onClick={() => handleArticleClick(cat, article)}
                            >
                              {article.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* 右侧文章内容 */}
        <div className="mx-5 flex-1 rounded-lg bg-white p-5">
          <ArticleRenderer component={activeArticle.component} />
        </div>
      </section>
    </div>
  );
}

function ArticleRenderer({ component: Component }: any) {
  return (
    <div className="prose prose-neutral max-w-none prose-a:text-primary hover:prose-a:text-primary/80 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl">
      <Component />
    </div>
  );
}
