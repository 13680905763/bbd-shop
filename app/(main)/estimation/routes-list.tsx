import React from "react";
import { Accordion, AccordionItem, Divider } from "@heroui/react";

import RouteItemHeader from "./route-item-header";
import RouteItemDetail from "./route-item-detail";
import { RouteItem } from "./types";

interface RoutesListProps {
  routes: RouteItem[];
}

export default function RoutesList({ routes }: RoutesListProps) {
  const disabledKeys = routes
    .map((route, index) => (route.disable ? String(index) : null))
    .filter((item) => item !== null) as string[];

  return (
    <div className="container m-auto p-5">
      <Accordion
        className="!border-1"
        disabledKeys={disabledKeys}
        variant="bordered"
      >
        {routes.map((route, index) => (
          <AccordionItem
            key={String(index)}
            title={<RouteItemHeader route={route} />}
          >
            <Divider />
            <RouteItemDetail route={route} />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
