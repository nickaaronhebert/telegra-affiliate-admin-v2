import type { IconSVG } from "@/types/global/icon";

const User = ({ color = "#fff" }: IconSVG) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "30px", height: "30px" }}
    fill="none"
  >
    <path
      stroke={color}
      strokeLinecap="round"
      strokeWidth={2}
      d="M23 22.552c-.471-1.241-1.512-2.338-2.958-3.12-1.446-.781-3.219-1.205-5.042-1.205s-3.596.424-5.042 1.206C8.512 20.213 7.47 21.31 7 22.552M15 14.331c2.286 0 4.14-1.742 4.14-3.89 0-2.149-1.854-3.89-4.14-3.89-2.288 0-4.142 1.741-4.142 3.89 0 2.148 1.854 3.89 4.141 3.89Z"
    />
  </svg>
);
export default User;
