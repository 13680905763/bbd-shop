import { Tab, Tabs } from "@heroui/react";
import React from "react";

interface TabItem {
  key: string;
  title: string;
  content: React.ReactNode;
}

interface CommonTabsProps {
  tabs: TabItem[];
  onSelectionChange?: (key: React.Key) => void;
  defaultSelectedKey?: string;
}

export default function CommonTabs({
  tabs,
  onSelectionChange,
  selectedKey,
}: CommonTabsProps & { selectedKey?: string }) {
  return (
    <Tabs
      aria-label="Wallet Tabs"
      classNames={{
        base: " w-full bg-white ",
        tabList: "gap-6 w-full relative rounded-none p-0",
        cursor: "w-full bg-[#f0700c]",
        tab: "max-w-fit px-0 h-12",
        tabContent: "group-data-[selected=true]:text-[#f0700c]",
      }}
      color="primary"
      selectedKey={selectedKey}
      variant="underlined"
      onSelectionChange={onSelectionChange}
    >
      {tabs.map((tab) => (
        <Tab key={tab.key} title={tab.title}>
          {tab.content}
        </Tab>
      ))}
    </Tabs>
  );
}
