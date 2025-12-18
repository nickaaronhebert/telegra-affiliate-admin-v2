const DefaultCardSVG = ({ width = 32, height = 32, className = "" }) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="0.00109863" width="32" height="32" rx="6" fill="#00579F" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 12H8V11.25C8 10.5596 8.44772 10 9 10H23C23.5523 10 24 10.5596 24 11.25V12ZM24 14.5V21C24 21.5523 23.5523 22 23 22H9C8.44772 22 8 21.5523 8 21V14.5H24ZM12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20H13C13.5523 20 14 19.5523 14 19C14 18.4477 13.5523 18 13 18H12Z"
      fill="white"
    />
  </svg>
);

export default DefaultCardSVG;
