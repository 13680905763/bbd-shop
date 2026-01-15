import React, { useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Form,
  Input,
  Spacer,
  addToast,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { searchWarehouseRoutesList } from "@/services";
import { useCountries } from "@/hook";
import { useCategoryOptions } from "@/hook/config/useCategoryOptions";

export interface EstimationFormData {
  countryId: number;
  categoryId: string;
  weight: string;
  length: string;
  width: string;
  height: string;
}

interface EstimationFormProps {
  onSearchSuccess: (routes: any[], message?: string) => void;
}

export default function EstimationForm({ onSearchSuccess }: EstimationFormProps) {
  const t = useTranslations("estimation");
  const { data: countries = [] } = useCountries();
  const { data: categoryOptions = [] } = useCategoryOptions();

  const [formData, setFormData] = useState<EstimationFormData>({
    countryId: 0,
    categoryId: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const handleChange = (key: keyof EstimationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const searchMutation = useMutation({
    mutationFn: (data: EstimationFormData) => searchWarehouseRoutesList(data),
    onSuccess: (res) => {
      if (typeof res !== "string" && res?.length) {
        onSearchSuccess(res);
      } else {
        onSearchSuccess([], typeof res === "string" ? res : "");
      }
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { weight, length, width, height } = formData;

    const isWeightFilled = weight && Number(weight) > 0;
    const isSizeFilled =
      length &&
      Number(length) > 0 &&
      width &&
      Number(width) > 0 &&
      height &&
      Number(height) > 0;

    if (!isWeightFilled && !isSizeFilled) {
      addToast({
        title: t("fillWeightOrSize"),
        timeout: 1000,
        color: "danger",
      });
      return;
    }

    searchMutation.mutate(formData);
  };

  return (
    <Form className="w-full" onSubmit={onSubmit}>
      <div className="flex gap-8 w-full">
        <Autocomplete
          isRequired
          className="flex-1"
          defaultItems={countries}
          errorMessage={t("errorCountry")}
          label={t("warehouse")}
          name="countryId"
          selectedKey={String(formData.countryId)}
          onSelectionChange={(key) => handleChange("countryId", Number(key))}
        >
          {(country: any) => (
            <AutocompleteItem
              key={country.id}
              startContent={
                <Avatar
                  alt={country.name}
                  className="w-6 h-6"
                  src={country.nationalFlag}
                />
              }
            >
              {country.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          isRequired
          className="flex-1"
          defaultItems={categoryOptions as any[]}
          errorMessage={t("errorCategory")}
          label={t("category")}
          name="categoryId"
          selectedKey={String(formData.categoryId)}
          onSelectionChange={(key) => handleChange("categoryId", key)}
        >
          {(category: any) => (
            <AutocompleteItem key={category.id}>
              {category.categoryName}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>

      <Spacer y={2} />
      <div className="flex gap-8 w-full">
        <div className="flex-1 flex gap-8">
          <Input
            className="flex-1"
            label={t("weight")}
            name="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange("weight", e.target.value)}
          />
          <Input
            className="flex-1"
            label={t("length")}
            name="length"
            type="number"
            value={formData.length}
            onChange={(e) => handleChange("length", e.target.value)}
          />
          <Input
            className="flex-1"
            label={t("width")}
            name="width"
            type="number"
            value={formData.width}
            onChange={(e) => handleChange("width", e.target.value)}
          />
          <Input
            className="flex-1"
            label={t("height")}
            name="height"
            type="number"
            value={formData.height}
            onChange={(e) => handleChange("height", e.target.value)}
          />
        </div>
      </div>

      <Spacer y={2} />
      <div className="flex justify-center w-full">
        <Button
          className="min-w-48"
          color="primary"
          isLoading={searchMutation.isPending}
          size="lg"
          type="submit"
        >
          {t("search")}
        </Button>
      </div>
    </Form>
  );
}
