"use client";
import { Card } from "@heroui/react";
import { FiEdit } from "react-icons/fi";

interface BackendAddress {
  id?: string;
  recipient?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  postcode?: string;
  defaultAddress?: number;
}

export default function AddressCard({
  data,
  onEdit,
  onSelect,
  isSelected,
  isDisabled,
}: any) {
  if (!data) return null;

  const {
    id = "",
    recipient = "未填写收件人",
    phone = "未填写电话",
    country = "",
    state = "",
    city = "",
    address = "",
    postcode = "",
    defaultAddress = 0,
  } = data;

  const fullAddress =
    `${country} ${state} ${city} ${address} ${postcode}`.trim();

  return (
    <Card
      isPressable
      className={`flex-1 p-4 rounded-2xl border transition ${
        isSelected ? "border-primary border-2 bg-orange-50" : "border-gray-200"
      } hover:shadow-md cursor-pointer`}
      isDisabled={isDisabled}
      shadow="none"
      onClick={() => {
        if (isDisabled) return; // ✅ 手动阻止
        if (id && isSelected) {
          // onSelect?.(null);
        } else if (id) {
          console.log(777);

          onSelect?.(id);
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{recipient}</span>
            {/* {defaultAddress === 1 && (
              <Badge
                className="text-orange-600 border-orange-500"
                variant="outline"
              >
                默认
              </Badge>
            )} */}
          </div>
          <span className="text-gray-600 text-sm">{phone}</span>
          <span className="text-gray-700 text-sm leading-relaxed">
            {fullAddress}
          </span>
        </div>

        {onEdit && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              id && onEdit(id);
            }}
          >
            <FiEdit className="w-4 h-4" />
          </span>
        )}
      </div>
    </Card>
  );
}
