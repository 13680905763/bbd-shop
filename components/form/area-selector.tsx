"use client";

import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";

import {
  useCountries,
  useProvinces,
  useCities,
} from "@/hook/addresses/useAreaSelector";

interface Option {
  id: string;
  code: string;
  name: string;
  nationalFlag?: string; // 图片链接 or emoji
}

interface Props {
  name: string;
  value: {
    countryId: string;
    stateId: string;
    city: string;
  };
  onChange: (val: Props["value"]) => void;
  handleChange: (key: string, value: any) => void;
}

export default function AreaSelector({
  value,
  onChange,
  handleChange,
  name,
}: Props) {
  console.log("value", value);

  const { data: countries = [] } = useCountries();
  const { data: states = [] } = useProvinces(value.countryId);
  const { data: cities = [] } = useCities(value.stateId);

  //   console.log("cities", cities);
  //   useEffect(() => {
  //     if (cities.length === 0 && value.stateId) {
  //       onChange({ ...value, city: value.stateId });
  //     }
  //   }, [cities]);
  const renderItem = (opt: Option) => (
    <AutocompleteItem
      key={opt.id}
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
        label="国家"
        placeholder="选择国家"
        selectedKey={value.countryId}
        onSelectionChange={(code) => {
          handleChange(name, value);
          onChange({
            countryId: code as string,
            stateId: "",
            city: "",
          });
        }}
      >
        {countries.map(renderItem)}
      </Autocomplete>

      <Autocomplete
        // isDisabled={!value.countryId}
        label="省份"
        placeholder="选择省份"
        selectedKey={value.stateId}
        onSelectionChange={(code) => {
          handleChange(name, value);
          onChange({ ...value, stateId: code as string, city: "" });
        }}
      >
        {states.map(renderItem)}
      </Autocomplete>

      <Autocomplete
        // isDisabled={!value.stateId}
        label="城市"
        placeholder="选择城市"
        selectedKey={value.city}
        onSelectionChange={(code) => {
          handleChange(name, value);
          onChange({ ...value, city: code as string });
        }}
      >
        {cities.map(renderItem)}
      </Autocomplete>
    </div>
  );
}
