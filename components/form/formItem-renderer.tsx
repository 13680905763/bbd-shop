import {
  Input,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Checkbox,
  DatePicker,
} from "@heroui/react";

import AreaSelector from "./area-selector";

export interface FieldOption {
  label: string;
  value: string;
  icon?: string;
}

export interface FieldConfig {
  key: string; // 用于 React 元素 key
  type: "input" | "select" | "checkbox" | "date" | "area";
  name: string; // 用于 formData
  label?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  options?: FieldOption[];
  startContent?: React.ReactNode;
}

interface DynamicFormProps<T extends Record<string, any>> {
  fields: FieldConfig[];
  formData: T;
  onChange: (data: T) => void;
}

export default function FormItemRenderer<T extends Record<string, any>>({
  fields,
  formData,
  onChange,
}: DynamicFormProps<T>) {
  const handleChange = (name: string, value: any) => {
    onChange({ ...formData, [name]: value });
  };

  return (
    <>
      {fields.map((field) => {
        const {
          type,
          name,
          label,
          placeholder,
          options = [],
          startContent = "",
          size = "md",
          key,
        } = field;

        const value = formData[name] ?? "";

        switch (type) {
          case "input":
            return (
              <Input
                key={key} // 用 key
                label={label}
                placeholder={placeholder}
                size={size}
                startContent={startContent}
                value={value}
                variant="bordered"
                onValueChange={(val) => handleChange(name, val)}
              />
            );
          case "select":
            return (
              <Autocomplete
                key={key} // 用 key
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
                      opt.icon && (
                        <Avatar
                          alt={opt.label}
                          className="w-6 h-6"
                          src={opt.icon}
                        />
                      )
                    }
                  >
                    {opt.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            );
          case "checkbox":
            return (
              <Checkbox
                key={key} // 用 key
                isSelected={!!value}
                size={size}
                onValueChange={(val) => handleChange(name, val)}
              >
                {label}
              </Checkbox>
            );
          case "date":
            return (
              <DatePicker
                key={key} // 用 key
                classNames={{ inputWrapper: "focus-within:!border-[#f0700c]" }}
                label={label}
                variant="bordered"
              />
            );
          case "area":
            return (
              <AreaSelector
                key={key} // 用 key
                value={{
                  countryId: formData.countryId ?? "",
                  stateId: formData.stateId ?? "",
                  city: formData.city ?? "",
                }}
                onChange={(val) => onChange({ ...formData, ...val })}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
