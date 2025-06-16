import {
  Input,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Checkbox,
  DatePicker,
} from "@heroui/react";
import { useState } from "react";

import AreaSelector from "./area-selector";

export interface FieldOption {
  label: string;
  value: string;
  icon?: string;
}

export interface FieldConfig {
  type: "input" | "select" | "checkbox" | "date" | "area"; // 添加 date 类型
  name: string;
  label: string;
  placeholder?: string;
  options?: FieldOption[];
}

interface DynamicFormProps {
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function FormItemRenderer({
  fields,
  formData,
  onChange,
}: DynamicFormProps) {
  const [area, setArea] = useState({ countryId: "", stateId: "", city: "" });
  const handleChange = (key: string, value: any) => {
    onChange({ ...formData, [key]: value });
  };

  return (
    <>
      {fields.map((field) => {
        const { type, name, label, placeholder, options = [] } = field;
        const value = formData[name] ?? "";

        if (type === "input") {
          return (
            <Input
              key={name}
              label={label}
              placeholder={placeholder}
              value={value}
              variant="bordered"
              onValueChange={(val) => handleChange(name, val)}
            />
          );
        }

        if (type === "select") {
          return (
            <Autocomplete
              key={name}
              label={label}
              placeholder={placeholder}
              selectedKey={value}
              variant="bordered"
              onSelectionChange={(val) => handleChange(name, val as string)}
            >
              {options.map((opt) => (
                <AutocompleteItem
                  key={opt.value}
                  startContent={
                    opt.icon ? (
                      <Avatar
                        alt={opt.label}
                        className="w-6 h-6"
                        src={opt.icon}
                      />
                    ) : null
                  }
                >
                  {opt.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          );
        }

        if (type === "checkbox") {
          return (
            <Checkbox
              key={name}
              isSelected={!!value}
              onValueChange={(val) => handleChange(name, val)}
            >
              {label}
            </Checkbox>
          );
        }

        if (type === "date") {
          return (
            <DatePicker
              key={name}
              classNames={{
                inputWrapper: "focus-within:!border-[#f0700c]",
              }}
              label={label}
              // value={value}
              variant="bordered"
              // onChange={(val) => handleChange(name, val)}
            />
          );
        }
        if (type === "area") {
          return (
            <AreaSelector
              key={name}
              handleChange={handleChange}
              name={name}
              value={area}
              onChange={setArea}
            />
          );
        }

        return null;
      })}
    </>
  );
}
// {
//   type: "select",
//   name: "country",
//   label: "国家",
//   placeholder: "选择国家",
//   options: [
//     {
//       label: "Argentina",
//       value: "Argentina",
//       icon: "https://flagcdn.com/ar.svg",
//     },
//     {
//       label: "Venezuela",
//       value: "Venezuela",
//       icon: "https://flagcdn.com/ve.svg",
//     },

//   ],
// },
