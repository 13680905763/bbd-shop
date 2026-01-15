import type { Address } from "@/types/address";

import { Chip, Divider } from "@heroui/react";
import { useTranslations } from "next-intl";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { memo, useCallback, useMemo } from "react";
import clsx from "clsx";
import { formatFullAddress, formatFullCity } from "@/utils";

type AddressItemProps = {
  addressDetail: Address;
  showDeleteButton?: boolean;
  selectable?: boolean; // 是否支持点击选中
  selected?: boolean; // 是否被选中（受控）
  onSelect?: (address: Address) => void;
  onEdit: (address: Address) => void;
  onDelete?: (address: Address) => void;
};

export default memo(function AddressItem({
  addressDetail,
  showDeleteButton = true,
  selectable = false,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
}: AddressItemProps) {
  const t = useTranslations("components.block.addressItem");

  const fullCity = useMemo(() => formatFullCity(addressDetail), [addressDetail]);
  const fullAddress = useMemo(() => formatFullAddress(addressDetail), [addressDetail]);

  const handleSelect = useCallback(() => {
    if (!selectable || !onSelect) return;
    onSelect(addressDetail);
  }, [selectable, onSelect, addressDetail]);
  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      onEdit(addressDetail);
    },
    [onEdit, addressDetail],
  );
  const handleDelete = useCallback(() => {
    if (!onDelete) return;
    onDelete(addressDetail);
  }, [onDelete, addressDetail]);

  console.log("重渲染");

  return (
    <div
      className={clsx(
        "rounded-lg bg-white py-2 flex flex-col gap-1 p-4 text-sm transition",
        selectable && "cursor-pointer",
        !selected && "border-[#5e5e5e]  border-1 ",
        selected && "bg-primary/5 ring-2 ring-primary",
      )}
      role="button"
      onClick={handleSelect}
    >
      <div className="flex items-center justify-between font-semibold text-gray-800">
        <span>{addressDetail.recipient}</span>
        <span className="text-gray-600">{addressDetail.phone}</span>
      </div>

      <div className="text-gray-700">
        <span className="line-clamp-2">{fullCity}</span>
      </div>
      <div className="text-gray-700">
        <span className="line-clamp-2">{fullAddress}</span>
      </div>

      <Divider className="my-1" />

      <div className="flex items-center justify-between">
        {addressDetail.defaultAddress ? (
          <Chip color="primary" radius="sm" size="sm">
            {t("default")}
          </Chip>
        ) : (
          <div />
        )}

        <div className="flex gap-1">
          {showDeleteButton && (
            <button
              aria-label={t("delete")}
              className="p-2"
              onClick={handleDelete}
            >
              <FaTrashAlt className="h-4 w-4" />
            </button>
          )}
          <button aria-label={t("edit")} className="p-2" onClick={handleEdit}>
            <FaEdit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
