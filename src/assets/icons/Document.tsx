const DocumentSvg = ({
  width = 20,
  height = 20,
  color = "#6A7383",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.4981 1.66797H4.99918C4.55722 1.66797 4.13336 1.84354 3.82085 2.15605C3.50833 2.46856 3.33276 2.89242 3.33276 3.33439V16.6657C3.33276 17.1077 3.50833 17.5315 3.82085 17.8441C4.13336 18.1566 4.55722 18.3321 4.99918 18.3321H14.9977C15.4396 18.3321 15.8635 18.1566 16.176 17.8441C16.4885 17.5315 16.6641 17.1077 16.6641 16.6657V5.83401L12.4981 1.66797Z"
      stroke={color}
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.6648 1.66797V5.0008C11.6648 5.44276 11.8404 5.86662 12.1529 6.17914C12.4654 6.49165 12.8893 6.66722 13.3312 6.66722H16.664"
      stroke={color}
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8.33219 7.5H6.66577"
      stroke={color}
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M13.3314 10.832H6.66577"
      stroke={color}
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M13.3314 14.1641H6.66577"
      stroke={color}
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default DocumentSvg;
