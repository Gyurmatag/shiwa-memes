type LogoProps = {
  height: number
  width: number
}

export default function Logo({ height, width }: LogoProps) {
  return (
    <svg
      className={`h-${height} w-${width} fill-gray-800 dark:fill-gray-100`}
      viewBox="0 0 219 218"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M109.075 2.34506e-06C48.8346 2.34506e-06 0 48.7115 0 108.8C0 168.889 48.8346 217.6 109.075 217.6C169.316 217.6 218.15 168.889 218.15 108.8C218.156 79.9427 206.667 52.2655 186.21 31.8602C165.753 11.4549 138.006 -0.00598543 109.075 2.34506e-06ZM78.0434 170.526L153.642 135.464V135.351C158.834 132.931 162.337 127.933 162.832 122.238C163.326 116.543 160.738 111.018 156.041 107.743C151.345 104.469 145.253 103.942 140.062 106.362L64.4628 141.515C56.4311 145.255 52.9603 154.782 56.7105 162.794C60.4607 170.805 70.0118 174.267 78.0434 170.526ZM78.0434 111.238L153.642 76.1985V76.0856C158.838 73.6657 162.345 68.6649 162.841 62.9668C163.338 57.2688 160.75 51.7392 156.051 48.4609C151.352 45.1827 145.257 44.6539 140.062 47.0737L64.4628 82.2266C56.4311 85.9673 52.9603 95.4943 56.7105 103.506C60.4607 111.517 70.0118 114.979 78.0434 111.238Z"
      />
    </svg>
  )
}