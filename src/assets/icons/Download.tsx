const DownloadSvg = ({ width = 16, height = 16, color = "black" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.99268 9.99279V2"
      stroke={color}
      stroke-width="1.33213"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.9875 9.99219V12.6565C13.9875 13.0098 13.8471 13.3486 13.5973 13.5984C13.3475 13.8482 13.0086 13.9886 12.6553 13.9886H3.33042C2.97712 13.9886 2.63829 13.8482 2.38846 13.5984C2.13864 13.3486 1.99829 13.0098 1.99829 12.6565V9.99219"
      stroke={color}
      stroke-width="1.33213"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.66235 6.66016L7.99268 9.99049L11.323 6.66016"
      stroke={color}
      stroke-width="1.33213"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DownloadSvg;
