"use client";
import * as React from "react";
import { Image } from "@heroui/react";

import { IconSvgProps } from "@/types";

export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => (
  <Image
    alt="HeroUI hero Image"
    height={height || size}
    src="https://bbdbuy.com/uploads/20241228/6d32e25a7b3730177117fd5f5cf8f006.png"
    width={width || size}
  />
);

export const DiscordIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const MoonFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

export const HeartFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);
export const DeleteIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};
export const EditIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const Icon1688: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => (
  <Image
    alt="HeroUI hero Image"
    height={height || size}
    radius="none"
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAVXSURBVGiB7ZptbFNVGMd/pc1cCDM1W2yjq5FYMyJzY0nJUIgCGXEEwptMp5thgFMimEEU3cYIEoiIJm5kRCAYwGT4hsiQLUI2Nl2YbroIDERMaqgWx0hKaNwyBrapH56V3r6tu7fD8mH/L+09Pfec//8+5znPc55bGENioQtt8D3Oi+iYhQ9DIghFhQ4PPlp15/g0uFkBXxYVwLv/KzH1qNR1s81/cVvA0JM/mBhOKuGjyG+JcbcbdcxOGCG1UHBVCtAnhIwWKLjeOUfNyAZrJkycBPeng8EAHg+4XWA/D50n4erluKcZPQFJyTDnWZi1CKblQYox+Pdbg9JHiaav4IN1cQmJX0DGFCh4FeYVw/gJkfv0ueGFqZBmhun5sGAZmNJhzlLImgbP5YhlNGBc7C7DEK8+Al+ehoJVkcn3uaGzGb7+GB6ywulTsLMK5k6EzaUw0C9Ciss001BvgRQjlG2DJS+DPuR2tws6mqHreyFrPx95DK9HRBnTZKycGRqoC9QJyM2DLfvlqfnhtMPxL6D9uJBWg5uD8jnQr+4+BUYuoHQDrNkauD60Bw7tht/PaJtZbxDfAWg/oW0MRipgfTUUrw1u67mknTxAaZVssX1uaKzTPExsJ45E3usB5x/hfVOMsOyN2LPaZsIrG+T7h+tFhEYMb4HSqnDyA/1Q+RK01gfakpJh9kLZIl1XIdUM13ojj2lKh+2fyRJqaxRnjgPRBUzPhzVbgtuuXoYLXVC4WoKWxwP3GuG6C5oPw8blw882fgJ89K3Egx4HbCyJi3x0AcY02LQ3vN1ph7WLtc2kN0jcsGaKFdcu1hy8lIjsA2XbgrfK0cCmvZJigCxBtRuAMS1isAy3gCkdFpYEt3k9sG871NWom9SPFeWBMXdvDvafWLA9DSaLxJgIFgsXkLc0OMK6euG1udq3zNy8gC+1NcKud2LfY7FKbmV6EBoPDrvNhgvIyA6+1mJuP5KSJXLrDbJVVhZH75eVKxvHrEXguAh1O6Dru5hThAu4ERLW1aQHeoMsNz/mFwd8qccBxlSwPCK7kMUqCd5jNphsk/uOfgJvFkTPoUYkoOkwFK4JXNccgb1bobszmNz4CULGYoXJU+HSRck8lbl9qjnwPWMKNNjDGXR3wPvrZJloCGiBQ302+/FRAoiAt6rDs80eh3z6d4QLXSL4mwPiK6GwWKHuR+nvx0A/nOuAjpNyoHFGEBWb9QHdWZZDtDjw+U5oaxBHysiG+4YI/O2AK3/CxTNCIhJpJZx2mGORJaI3SHT+yx5syTgRPRL3OGTpxItbg+rTbBXQfiK7SzAmINEYE5BoxC8gNENMNYcXsO4gtAsoWAWHz0F5rVxPz4f636DliqQKSclQewzO+uDUdcgvlH6lG+CnG/DLv1C1K4ECXL2Bpz9xkhxWWo/CEykSQybb4Kn5MP9RSRNWvC19V5TDe6/LgaZgVdznDu0CWusDqcXilVK8LSoTK9hmwq9d8nvtMVhQIrUjkKPn6i1QUSsBLs4C7+g4sTVT0obncyQ5q6iVapspHX44IenxvCKx2JPPSHre3SkJnsV6Fwi41gv/uCXP8VcjcmbIYb+mXE5z1kxZUmlm2FEBW4fqqXGUFWG0yuv7tsOeJnHMPrdUJ5x2WLISfr4hfRoPQks9nG6XgjCIZdoa4po6cjo9UqSaJbN0u2TXSTPLd3+tU2+QZXRzMLhO9MDDcE+ynCG0sY6RTo8USlK3BgNO7YfXE94Gkds0IuADPryjNuqdhoKrUkBLQshogYLrbQFD710rE0JIHSqVb+uj/dVg9l332tWHFx8toX81GEOi8R8IUrk3IWcGngAAAABJRU5ErkJggg=="
    width={width || size}
  />
);
