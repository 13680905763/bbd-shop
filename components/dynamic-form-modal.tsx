import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Checkbox,
  Divider,
} from "@heroui/react";

interface FieldOption {
  label: string;
  value: string;
  icon?: string; // optional for avatar
}

export interface FieldConfig {
  type: "input" | "select" | "checkbox";
  name: string;
  label: string;
  placeholder?: string;
  options?: FieldOption[]; // for select
}

interface DynamicFormModalProps {
  title: string;
  modalType?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
}

const DynamicFormModal = ({
  modalType = "form",
  isOpen,
  title,
  onOpenChange,
  fields,
  formData,
  onChange,
  onSave,
}: DynamicFormModalProps) => {
  const handleChange = (key: string, value: any) => {
    onChange({ ...formData, [key]: value });
  };

  const renderField = (field: FieldConfig) => {
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
                  <Avatar alt={opt.label} className="w-6 h-6" src={opt.icon} />
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

    return null;
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              {modalType === "form" ? (
                fields.map((field) => renderField(field))
              ) : modalType === "recharge" ? (
                <>
                  <Input
                    label="金额"
                    placeholder="Enter your password"
                    variant="bordered"
                  />
                  <Divider className="my-2" />
                  <div className="grid grid-cols-3 gap-4">
                    {[50, 100, 200, 500, 1000, 5000].map((item) => (
                      <Button
                        key={item}
                        className="border-1 border-[#ccc] bg-[#fff] "
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </>
              ) : modalType === "score" ? (
                <div>
                  <div className="w-full p-5 rounded-lg border-1 border-[#ccc] flex justify-between items-center mb-4">
                    <div className="flex gap-6">
                      <div>
                        <Avatar
                          size="lg"
                          src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
                        />
                      </div>
                      <div>
                        <div className="text-money-xl">CAD 999</div>
                        <div className="text-xs">
                          <div>所需积分：50</div>
                          <div>需要会员等级：1</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button color="primary">兑换</Button>
                    </div>
                  </div>
                  <div className="w-full p-5 rounded-lg border-1 border-[#ccc] flex justify-between items-center mb-4">
                    <div className="flex gap-6">
                      <div>
                        <Avatar
                          size="lg"
                          src="https://bbdbuy.com/uploads/20241118/222e8b859ad8f55bbd073055efd8b41c.png"
                        />
                      </div>
                      <div>
                        <div className="text-money-xl">CAD 999</div>
                        <div className="text-xs">
                          <div>所需积分：50</div>
                          <div>需要会员等级：1</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button color="primary">兑换</Button>
                    </div>
                  </div>
                </div>
              ) : (
                666
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                className="button-default"
                variant="flat"
                onPress={onClose}
              >
                取消
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  onSave(formData);
                  onClose();
                }}
              >
                保存
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DynamicFormModal;
