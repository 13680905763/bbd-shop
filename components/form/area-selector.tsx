"use client";

import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import { useTranslations } from "next-intl";

import { useCities, useCountries, useProvinces } from "@/hook/business";

interface Option {
  id: string | number; // 接口可能是 number，也可能是 string
  code?: string;
  name: string;
  nationalFlag?: string;
}

interface Props {
  value: {
    countryId: string;
    stateId?: string;
    state?: string;
    city: string;
  };
  onChange: (val: any) => void;
}

export default function AreaSelector({ value, onChange }: Props) {
  const t = useTranslations("Common.AreaSelector");
  const { data: countries = [] } = useCountries();
  const { data: states = [] } = useProvinces(value.countryId);
  const { data: cities = [] } = useCities(value.stateId);

  const renderItem = (opt: Option) => (
    <AutocompleteItem
      key={String(opt.id)}
      startContent={
        opt.nationalFlag ? (
          <Avatar alt={opt.name} className="w-6 h-6" src={opt.nationalFlag} />
        ) : null
      }
    >
      {opt.name}
    </AutocompleteItem>
  );
  const renderItemCity = (opt: Option) => (
    <AutocompleteItem
      key={opt.name}
      startContent={
        opt.nationalFlag ? (
          <Avatar alt={opt.name} className="w-6 h-6" src={opt.nationalFlag} />
        ) : null
      }
    >
      {opt.name}
    </AutocompleteItem>
  );

  return (
    <div className="flex flex-col gap-4">
      <Autocomplete
        errorMessage={t("country.errorMessage")}
        isRequired={true}
        label={t("country.label")}
        placeholder={t("country.placeholder")}
        selectedKey={String(value.countryId) || null}
        variant="bordered"
        onSelectionChange={(code) => {
          if (code !== null) {
            onChange({
              countryId: String(code),
              stateId: "",
              city: "",
            });
          }
        }}
      >
        {countries.map(renderItem)}
      </Autocomplete>

      <Autocomplete
        allowsCustomValue
        errorMessage={t("state.errorMessage")}
        inputValue={
          states?.find((s: any) => String(s.id) === String(value.stateId))
            ?.name ||
          value.state ||
          value.stateId ||
          ""
        }
        isRequired={false}
        label={t("state.label")}
        placeholder={t("state.placeholder")}
        selectedKey={value.stateId ? String(value.stateId) : null}
        variant="bordered"
        onInputChange={(text) => {
          const match = states?.find((item: any) => item.name === text);

          if (match) {
            onChange({
              ...value,
              stateId: String(match.id),
              state: "",
            });
          } else {
            onChange({
              ...value,
              stateId: "",
              state: text,
            });
          }
        }}
        onSelectionChange={(code) => {
          if (code !== null) {
            onChange({
              ...value,
              stateId: String(code),
              state: "",
            });
          }
        }}
      >
        {states.map(renderItem)}
      </Autocomplete>

      <Autocomplete
        allowsCustomValue
        errorMessage={t("city.errorMessage")}
        inputValue={value.city || ""}
        isRequired={true}
        label={t("city.label")}
        placeholder={t("city.placeholder")}
        selectedKey={String(value.city) || null}
        variant="bordered"
        onInputChange={(text) => {
          onChange({
            ...value,
            city: text,
          });
        }}
        onSelectionChange={(code) => {
          if (code !== null) {
            onChange({
              ...value,
              city: String(code),
            });
          }
        }}
      >
        {cities.map(renderItemCity)}
      </Autocomplete>
    </div>
  );
}
