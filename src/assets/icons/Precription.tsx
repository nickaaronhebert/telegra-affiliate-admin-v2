import { type IconSVG } from "@/types/global/icon";

export default function PrescriptionSvg({
  color,
  width = 15,
  height = 15,
}: IconSVG) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.1923 0.5H1.42307C0.913275 0.5 0.5 0.913335 0.5 1.42321V4.19284C0.5 4.70271 0.913275 5.11605 1.42307 5.11605H4.1923C4.7021 5.11605 5.11537 4.70271 5.11537 4.19284V1.42321C5.11537 0.913335 4.7021 0.5 4.1923 0.5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5768 0.5H8.8076C8.2978 0.5 7.88452 0.913335 7.88452 1.42321V4.19284C7.88452 4.70271 8.2978 5.11605 8.8076 5.11605H11.5768C12.0866 5.11605 12.4999 4.70271 12.4999 4.19284V1.42321C12.4999 0.913335 12.0866 0.5 11.5768 0.5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.1923 7.88281H1.42307C0.913275 7.88281 0.5 8.29615 0.5 8.80602V11.5756C0.5 12.0855 0.913275 12.4989 1.42307 12.4989H4.1923C4.7021 12.4989 5.11537 12.0855 5.11537 11.5756V8.80602C5.11537 8.29615 4.7021 7.88281 4.1923 7.88281Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5768 7.88281H8.8076C8.2978 7.88281 7.88452 8.29615 7.88452 8.80602V11.5756C7.88452 12.0855 8.2978 12.4989 8.8076 12.4989H11.5768C12.0866 12.4989 12.4999 12.0855 12.4999 11.5756V8.80602C12.4999 8.29615 12.0866 7.88281 11.5768 7.88281Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
