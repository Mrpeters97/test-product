export default function CompletenessIcon({ color = '#F97316', size = 15 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.29167 7.29167L6.29167 9.29167L10.2917 5.29167M13.9583 7.29167C13.9583 10.9736 10.9736 13.9583 7.29167 13.9583C3.60977 13.9583 0.625 10.9736 0.625 7.29167C0.625 3.60977 3.60977 0.625 7.29167 0.625C10.9736 0.625 13.9583 3.60977 13.9583 7.29167Z"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
