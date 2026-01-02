import { type IconSVG } from "@/types/global/icon";

export default function QuestionSvg({
  color = "#3E4D61",
  width = 18,
  height = 16,
}: IconSVG) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.2143 9.50056C17.2143 9.15957 17.0788 8.83254 16.8377 8.59142C16.5966 8.3503 16.2696 8.21484 15.9286 8.21484H12.0714V9.50056H5.64286V8.21484H1.78571C1.44472 8.21484 1.1177 8.3503 0.876577 8.59142C0.635459 8.83254 0.5 9.15957 0.5 9.50056V13.3577C0.5 13.6987 0.635459 14.0257 0.876577 14.2668C1.1177 14.508 1.44472 14.6434 1.78571 14.6434H15.9286C16.2696 14.6434 16.5966 14.508 16.8377 14.2668C17.0788 14.0257 17.2143 13.6987 17.2143 13.3577V9.50056Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.78564 4.35547H15.9285"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.78564 0.5H15.9285"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
