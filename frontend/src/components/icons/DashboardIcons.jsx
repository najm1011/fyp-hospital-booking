// Custom illustrated SVG icons for dashboard stats
// Single-color, warm and humanised design

export const CalendarIllustration = ({ className = "h-6 w-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Calendar body */}
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Calendar top bar */}
    <path
      d="M3 10h18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Calendar hooks */}
    <path
      d="M8 3v4M16 3v4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Friendly date marks */}
    <path
      d="M7 14h2M11 14h2M15 14h2M7 17.5h2M11 17.5h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CheckmarkIllustration = ({ className = "h-6 w-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Circle */}
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    {/* Friendly checkmark */}
    <path
      d="M8 12.5l2.5 2.5 5.5-5.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ClockIllustration = ({ className = "h-6 w-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Clock face */}
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    {/* Clock hands */}
    <path
      d="M12 7v5l3 2"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Hour markers */}
    <path
      d="M12 5v1M19 12h-1M12 19v-1M5 12h1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const DoctorIllustration = ({ className = "h-6 w-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Head */}
    <circle
      cx="12"
      cy="7.5"
      r="3.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    {/* Body/shoulders */}
    <path
      d="M5 21v-2c0-3 3-5 7-5s7 2 7 5v2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Stethoscope */}
    <path
      d="M12 14v2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="18"
      r="1.25"
      stroke="currentColor"
      strokeWidth="1.25"
    />
  </svg>
);

export const UsersIllustration = ({ className = "h-6 w-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* First person */}
    <circle
      cx="9"
      cy="7"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M3 20v-1.5c0-2.5 2.5-4 6-4s6 1.5 6 4V20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Second person */}
    <circle
      cx="17"
      cy="6"
      r="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M17.5 12.5c2 .5 3.5 1.5 3.5 3.5v1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ActivityIllustration = ({ className = "h-6 w-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Chart frame */}
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Activity line */}
    <path
      d="M6 15l3-3 2.5 2.5 4-5 2.5 2.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Data points */}
    <circle cx="9" cy="12" r="1" stroke="currentColor" strokeWidth="1.25" />
    <circle cx="15.5" cy="9.5" r="1" stroke="currentColor" strokeWidth="1.25" />
  </svg>
);
