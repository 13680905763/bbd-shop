import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#5EA2EF] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      xs: "text-2xl lg:text-3xl",
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl leading-9",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg  text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
    weight: {
      normal: "font-normal",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },

  defaultVariants: {
    fullWidth: true,
    weight: "semibold",
  },
});

export const describeText = tv({
  base: "",
  variants: {
    size: {
      sm: "text-sm ",
      md: "",
      lg: "",
      xl: "text-xl",
    },
    color: {
      ac: "text-[#acacac]",
      333: "text-[#333]",
    },
    weight: {
      normal: "font-normal",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "sm",
    color: "ac",
    weight: "bold",
  },
});

export const price = tv({
  base: "",
  variants: {
    size: {
      sm: "text-sm ",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      xl2: "text-2xl",
    },
    color: {
      base: "text-[#333]",
      white: "text-[#fff]",
      red: "text-red",
    },
    weight: {
      normal: "font-normal",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "xl",
    color: "base",
    weight: "bold",
  },
});
