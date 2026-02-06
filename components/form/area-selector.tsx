"use client";

import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import { useTranslations } from "next-intl";

import {
  useCountries,
  useProvinces,
  useCities,
} from "@/hook/api";

interface Option {
  id: string | number; // 接口可能是 number，也可能是 string
  code?: string;
  name: string;
  nationalFlag?: string;
}

interface Props {
  value: {
    countryId: string;
    stateId: string;
    city: string;
  };
  onChange: (val: Props["value"]) => void;
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
        isRequired={true}
        label={t("country.label")}
        errorMessage={t("country.errorMessage")}
        placeholder={t("country.placeholder")}
        selectedKey={String(value.countryId) || null}
        variant="bordered"
        onSelectionChange={(code) =>
          onChange({
            countryId: String(code),
            stateId: "",
            city: "",
          })
        }
      >
        {countries.map(renderItem)}
      </Autocomplete>

      <Autocomplete
        isRequired={true}
        label={t("state.label")}
        errorMessage={t("state.errorMessage")}
        placeholder={t("state.placeholder")}
        selectedKey={String(value.stateId) || null}
        variant="bordered"
        onSelectionChange={(code) => {
          return onChange({
            ...value,
            stateId: String(code),
            city: states?.find((item: any) => item.id == code)?.name || "",
          });
        }}
      >
        {states.map(renderItem)}
      </Autocomplete>

      {cities.length > 0 ? (
        <Autocomplete
          isRequired={true}
          label={t("city.label")}
          errorMessage={t("city.errorMessage")}
          placeholder={t("city.placeholder")}
          selectedKey={String(value.city) || null}
          variant="bordered"
          onSelectionChange={(code) =>
            onChange({
              ...value,
              city: String(code),
            })
          }
        >
          {cities.map(renderItemCity)}
        </Autocomplete>
      ) : null}
    </div>
  );
}
