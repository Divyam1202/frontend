import React from "react";

const AzureIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 754"
    width="2500"
    height="2500"
  >
    <linearGradient
      id="a"
      gradientUnits="userSpaceOnUse"
      x1="353.1"
      x2="107.1"
      y1="56.3"
      y2="783"
    >
      <stop offset="0" stopColor="#114a8b" />
      <stop offset="1" stopColor="#0669bc" />
    </linearGradient>
    <linearGradient
      id="b"
      gradientUnits="userSpaceOnUse"
      x1="429.8"
      x2="372.9"
      y1="394.9"
      y2="414.2"
    >
      <stop offset="0" stopOpacity=".3" />
      <stop offset=".1" stopOpacity=".2" />
      <stop offset=".3" stopOpacity=".1" />
      <stop offset=".6" stopOpacity=".1" />
      <stop offset="1" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="c"
      gradientUnits="userSpaceOnUse"
      x1="398.4"
      x2="668.4"
      y1="35.1"
      y2="754.4"
    >
      <stop offset="0" stopColor="#3ccbf4" />
      <stop offset="1" stopColor="#2892df" />
    </linearGradient>
    <path
      d="M266.71.4h236.71L257.69 728.9a37.8 37.8 0 0 1-5.42 10.38c-2.33 3.16-5.14 5.93-8.33 8.22s-6.71 4.07-10.45 5.27-7.64 1.82-11.56 1.82H37.71c-5.98 0-11.88-1.42-17.2-4.16A37.636 37.636 0 0 1 7.1 738.87a37.762 37.762 0 0 1-6.66-16.41c-.89-5.92-.35-11.97 1.56-17.64L230.94 26.07c1.25-3.72 3.08-7.22 5.42-10.38 2.33-3.16 5.15-5.93 8.33-8.22 3.19-2.29 6.71-4.07 10.45-5.27S262.78.38 266.7.38v.01z"
      fill="url(#a)"
    />
    <path
      d="M703.07 754.59H490.52c-2.37 0-4.74-.22-7.08-.67-2.33-.44-4.62-1.1-6.83-1.97s-4.33-1.95-6.34-3.21a38.188 38.188 0 0 1-5.63-4.34l-241.2-225.26a17.423 17.423 0 0 1-5.1-8.88 17.383 17.383 0 0 1 7.17-18.21c2.89-1.96 6.3-3.01 9.79-3.01h375.36l92.39 265.56z"
      fill="#0078d4"
    />
    <path
      d="M504.27.4l-165.7 488.69 270.74-.06 92.87 265.56H490.43c-2.19-.02-4.38-.22-6.54-.61s-4.28-.96-6.34-1.72a38.484 38.484 0 0 1-11.36-6.51L303.37 593.79l-45.58 134.42c-1.18 3.36-2.8 6.55-4.82 9.48a40.479 40.479 0 0 1-16.05 13.67 40.03 40.03 0 0 1-10.13 3.23H37.82c-6.04.02-12-1.42-17.37-4.2A37.664 37.664 0 0 1 .43 722a37.77 37.77 0 0 1 1.87-17.79L230.87 26.58c1.19-3.79 2.98-7.36 5.3-10.58 2.31-3.22 5.13-6.06 8.33-8.4s6.76-4.16 10.53-5.38S262.75.38 266.72.4h237.56z"
      fill="url(#b)"
    />
    <path
      d="M797.99 704.82a37.847 37.847 0 0 1 1.57 17.64 37.867 37.867 0 0 1-6.65 16.41 37.691 37.691 0 0 1-30.61 15.72H498.48c5.98 0 11.88-1.43 17.21-4.16 5.32-2.73 9.92-6.7 13.41-11.56s5.77-10.49 6.66-16.41.35-11.97-1.56-17.64L305.25 26.05a37.713 37.713 0 0 0-13.73-18.58c-3.18-2.29-6.7-4.06-10.43-5.26S273.46.4 269.55.4h263.81c3.92 0 7.81.61 11.55 1.81 3.73 1.2 7.25 2.98 10.44 5.26 3.18 2.29 5.99 5.06 8.32 8.21s4.15 6.65 5.41 10.37l228.95 678.77z"
      fill="url(#c)"
    />
  </svg>
);

export default AzureIcon;