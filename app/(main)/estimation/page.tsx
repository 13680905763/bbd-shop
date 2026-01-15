"use client";
import React, { useState } from "react";
import { Spacer } from "@heroui/react";
import { useTranslations } from "next-intl";

import RoutesList from "./routes-list";
import EstimationForm from "./estimation-form";

export default function Estimation() {
  const t = useTranslations("estimation");
  const [routesMessage, setRoutesMessage] = useState<string>("");
  const [routes, setRoutes] = useState<any[]>([]);

  const handleSearchSuccess = (resRoutes: any[], message?: string) => {
    setRoutes(resRoutes);
    if (message) {
      setRoutesMessage(message);
    } else {
      setRoutesMessage("");
    }
  };
  return (
    <div>
      <div className="bg-[url('/images/estimation.webp')] bg-no-repeat bg-cover h-[180px]" />
      <div className=" bg-[#fff]">
        <div className="text-center container m-auto p-5">
          <h1 className='text-2xl font-bold'>{t("title")}</h1>
          <Spacer y={8} />
          <EstimationForm
            onSearchSuccess={handleSearchSuccess}
          />
        </div>
      </div>

      {routes.length > 0 && <RoutesList routes={routes} />}
      {routes?.length < 1 && (
        <div className="flex flex-col items-center justify-center h-[20vh] text-gray-500">
          <p className="text-lg mb-2">{routesMessage}</p>
        </div>
      )}
    </div>
  );
}
