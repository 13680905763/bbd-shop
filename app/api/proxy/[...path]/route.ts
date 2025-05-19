// app/api/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = "http://192.168.1.191:8080"; // 你的后端服务地址

async function handler(req: NextRequest) {
  // 1. 获取原始路径并拼接后端地址
  const path = req.nextUrl.pathname.replace(/^\/api\/proxy/, "");
  const targetUrl = `${BACKEND_BASE_URL}${path}${req.nextUrl.search}`;

  // 2. 克隆请求头，并移除一些 Next.js 不允许传给外部服务的头
  const headers = new Headers(req.headers);

  headers.delete("host");
  headers.delete("connection");

  // 3. 获取请求体（只有 POST/PUT 等有 body）
  let body: BodyInit | null = null;

  if (!["GET", "HEAD"].includes(req.method)) {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const json = await req.json();

      body = JSON.stringify(json);
    } else {
      body = await req.text(); // fallback: raw text/body
    }
  }

  // 4. 发起代理请求
  const proxyRes = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    redirect: "manual",
  });

  // 5. 创建响应（支持 JSON / 文件 / 字节流等）
  const resBody = await proxyRes.arrayBuffer();
  const response = new NextResponse(resBody, {
    status: proxyRes.status,
    headers: proxyRes.headers,
  });

  return response;
}

// 映射所有请求方法
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
