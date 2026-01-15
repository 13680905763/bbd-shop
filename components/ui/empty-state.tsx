import { useTranslations } from "next-intl";
import React from "react";

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export default function EmptyState({ message, className = "" }: EmptyStateProps) {
  const t = useTranslations("components.ui.empty");

  return (
    <div
      className={`flex flex-col items-center justify-center h-[60vh] text-gray-500 ${className}`}
    >
      <p className="text-lg mb-2">{message || t("defaultMessage")}</p>
    </div>
  );
}
