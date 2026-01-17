import { useTranslations } from "next-intl";
import { memo } from "react";

export default memo(function ProductItemTitle() {
  const t = useTranslations("components.ui.productItemTitle");

  return (
    <div className="grid grid-cols-12 p-4 bg-[#ffeee1] rounded-lg">
      <span className="col-span-6 text-left">{t("product")}</span>
      <span className="col-span-2 text-center">{t("remark")}</span>
      <span className="col-span-2 text-center">{t("price")}</span>
      <span className="col-span-2 text-center">{t("quantity")}</span>
    </div>
  );
});
