import { type IconSVG } from "@/types/global/icon";

export default function OrderInformationSvg({
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
        d="M13.8683 4.17488C13.8234 4.1139 13.762 4.06707 13.6913 4.03994L8.6323 2.12543C8.58443 2.10454 8.53277 2.09375 8.48054 2.09375C8.4283 2.09375 8.37664 2.10454 8.32877 2.12543L3.26981 4.07367C3.20297 4.09138 3.14193 4.12627 3.09275 4.17488C3.03385 4.24615 3.00112 4.33544 3 4.4279V10.6015C3.00109 10.6858 3.02738 10.7677 3.07547 10.8369C3.12356 10.906 3.19125 10.9592 3.26981 10.9895L8.32877 12.9377H8.48054H8.6323L13.6913 10.9895C13.7698 10.9592 13.8375 10.906 13.8856 10.8369C13.9337 10.7677 13.96 10.6858 13.9611 10.6015V4.46163C13.9682 4.35767 13.935 4.25496 13.8683 4.17488V4.17488Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.48071 12.9947V6.28125"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.48071 6.28125V12.9947"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.09253 4.21094L8.48032 6.28568L13.8681 4.21094"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
