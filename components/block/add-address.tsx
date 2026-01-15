"use client";
import { useTranslations } from "next-intl";

interface AddAddressProps {
    type: "address" | "billingAddress";
    onAdd?: () => void;
}

export default function AddAddress({ type, onAdd }: AddAddressProps) {
    const t = useTranslations("components.block.addAddress");
    return (
        <div className="border-1 border-[#5e5e5e] h-[140px] flex items-center justify-center rounded-lg">
            <button
                className="p-6 w-full"
                onClick={onAdd}
                aria-label={type === "address" ? t("addButton") : t("addBillingButton")}
            >
                <p className="flex items-center gap-2 justify-center">
                    <span>+</span>
                    <span>{type === "address" ? t("addButton") : t("addBillingButton")}</span>
                </p>
            </button>
        </div>
    );
}
