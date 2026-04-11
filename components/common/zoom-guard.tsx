"use client";

import { useEffect, useRef } from "react";

/**
 * ZoomGuard 组件
 * 直接在 <html> 元素上设置 CSS zoom 来补偿浏览器缩放。
 * 不添加额外 DOM 包裹层，不干扰任何布局（fixed、absolute 等全部正常）。
 *
 * - 80%~120% 范围内：不干预，正常跟随浏览器缩放
 * - 低于 80%：锁定视觉效果为 80%
 * - 高于 120%：锁定视觉效果为 120%
 */
export default function ZoomGuard({ children }: { children: React.ReactNode }) {
  const baseRatioRef = useRef<number>(0);

  useEffect(() => {
    baseRatioRef.current = window.devicePixelRatio;

    const update = () => {
      const zoomFactor = window.devicePixelRatio / baseRatioRef.current;

      let cssZoom = 1;

      if (zoomFactor < 0.8) {
        // 浏览器缩放低于 80%，补偿到 80%
        cssZoom = 0.8 / zoomFactor;
      } else if (zoomFactor > 1.2) {
        // 浏览器缩放高于 120%，补偿到 120%
        cssZoom = 1.2 / zoomFactor;
      } else {
        // 80%~120% 范围内不干预
        cssZoom = 1;
      }

      // 直接设置在 <html> 元素上
      console.log("ZoomGuard:", { zoomFactor, cssZoom });
      if (cssZoom === 1) {
        document.documentElement.style.removeProperty("zoom");
      } else {
        document.documentElement.style.setProperty("zoom", String(cssZoom));
      }
    };

    // 使用 matchMedia 精准监听 devicePixelRatio 变化
    let mql: MediaQueryList;

    const listen = () => {
      mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      mql.addEventListener("change", onChange, { once: true });
    };

    const onChange = () => {
      update();
      listen();
    };

    listen();

    return () => {
      mql?.removeEventListener("change", onChange);
      document.documentElement.style.removeProperty("zoom");
    };
  }, []);

  // 不添加任何包裹层，直接透传 children
  return <>{children}</>;
}
