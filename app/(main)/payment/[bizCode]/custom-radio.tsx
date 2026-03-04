import { RadioProps, cn, useRadio, VisuallyHidden } from "@heroui/react";

// 自定义 Radio 组件
export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    getBaseProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group w-full inline-flex items-center flex-row tap-highlight-transparent bg-white cursor-pointer border-1 border-default rounded-lg gap-4 p-4",
        "hover:bg-content2 active:opacity-50",
        "data-[selected=true]:border-primary",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span className="hidden">
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()} className="flex-1">
        {children && <span {...getLabelProps()}>{children}</span>}
      </div>
    </Component>
  );
};
