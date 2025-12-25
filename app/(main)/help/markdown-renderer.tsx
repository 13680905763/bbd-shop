"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useLocale } from "next-intl";

interface MarkdownRendererProps {
  fileName: string;
}

export function MarkdownRenderer({ fileName }: MarkdownRendererProps) {
  const locale = useLocale();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        // Try to fetch the localized file
        // We use a timestamp to prevent caching issues during development, 
        // but in production you might want to remove it or use a version hash
        const res = await fetch(`/help/${locale}/${fileName}.md`);
        
        if (res.ok) {
          const text = await res.text();
          setContent(text);
        } else {
          // Fallback to English if the localized version is missing
          // and we are not already trying English
          if (locale !== 'en') {
             const fallbackRes = await fetch(`/help/en/${fileName}.md`);
             if (fallbackRes.ok) {
                const text = await fallbackRes.text();
                setContent(text);
                setLoading(false);
                return;
             }
          }
          setContent("Content not found.");
        }
      } catch (error) {
        console.error("Failed to load markdown:", error);
        setContent("Error loading content.");
      } finally {
        setLoading(false);
      }
    }

    if (fileName) {
      fetchContent();
    }
  }, [fileName, locale]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    // The parent ArticleRenderer already provides 'prose' class
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
  );
}
