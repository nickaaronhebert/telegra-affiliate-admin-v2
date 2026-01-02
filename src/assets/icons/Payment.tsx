import { type IconSVG } from "@/types/global/icon";

export default function PaymentSvg({
  color,
  width = 15,
  height = 15,
}: IconSVG) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.8684 0.5H1.44737C0.924151 0.5 0.5 0.924151 0.5 1.44737V8.55263C0.5 9.07585 0.924151 9.5 1.44737 9.5H11.8684C12.3916 9.5 12.8158 9.07585 12.8158 8.55263V1.44737C12.8158 0.924151 12.3916 0.5 11.8684 0.5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.5 3.81641H12.8158"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.02637 7.13281H10.4474"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
