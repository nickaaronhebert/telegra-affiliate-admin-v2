import { type IconSVG } from "@/types/global/icon";

export default function TransactionsSvg({
  color,
  width = 15,
  height = 15,
}: IconSVG) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.6001 4.90835V3.29297"
        stroke={color}
        stroke-width="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.98511 9.21785C5.98511 10.0255 6.70665 10.2948 7.60049 10.2948C8.49434 10.2948 9.21588 10.2948 9.21588 9.21785C9.21588 7.60246 5.98511 7.60246 5.98511 5.98708C5.98511 4.91016 6.70665 4.91016 7.60049 4.91016C8.49434 4.91016 9.21588 5.31939 9.21588 5.98708"
        stroke={color}
        stroke-width="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.60059 10.2969V11.9123"
        stroke={color}
        stroke-width="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.6001 14.6016C11.4661 14.6016 14.6001 11.4676 14.6001 7.60156C14.6001 3.73557 11.4661 0.601562 7.6001 0.601562C3.7341 0.601562 0.600098 3.73557 0.600098 7.60156C0.600098 11.4676 3.7341 14.6016 7.6001 14.6016Z"
        stroke={color}
        stroke-width="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
