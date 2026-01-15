"use client";
import { Checkbox } from "@heroui/react";

import { useTranslations } from "next-intl";
import { WarehousePackageItem as WarehousePackageItemType } from "@/types/warehouse";
import { PackageProductItem } from "@/components/block";
import { SourceIcon } from "@/components/ui";


type WarehousePackageItemProps = {
  packageItem: WarehousePackageItemType;
  showCheckbox: boolean;
  onSelect: (packageCode: string) => void;
  isSelected: (packageCode: string) => boolean;
};

export default function WarehousePackageItem({
  packageItem,
  showCheckbox,
  onSelect,
  isSelected,
}: WarehousePackageItemProps) {
  const t = useTranslations("dashboard.warehouse.packageItem");
  // console.log('渲染WarehousePackageItem');

  return (
    <div className="card-cart mb-4  bg-white  ">
      <div className="p-4 flex items-center gap-1 ">
        {showCheckbox && (
          <Checkbox isSelected={isSelected(packageItem.packageCode)} onChange={() => onSelect(packageItem.packageCode)} />
        )}
        <SourceIcon source={packageItem?.orderProduct?.source} />
        <div className="text-sm font-extrabold">
          {t("orderNumber")} {packageItem?.orderCode}
        </div>
        <div className="text-[#acacac] text-sm">
          {t("createTime")} {packageItem?.createTime}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4 pt-0">
        <PackageProductItem
          packageItem={packageItem}
        />
      </div>
    </div>
  );
}
