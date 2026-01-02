"use client";
import { Card } from "@heroui/react";
import { FiPlus } from "react-icons/fi";

interface AddAddressCardProps {
  onAdd?: () => void;
}

export function AddAddressCard({ onAdd }: AddAddressCardProps) {
  return (
    <Card
      isPressable
      className="flex-1 p-4 rounded-2xl border  border-gray-300 hover:border-primary hover:shadow-md cursor-pointer flex items-center justify-center min-h-[120px]"
      shadow="none"
      onClick={onAdd}
    >
      <div className="flex flex-col items-center gap-2 text-gray-500">
        <FiPlus className="w-6 h-6" />
        <span className="text-sm">Add Address</span>
      </div>
    </Card>
  );
}
