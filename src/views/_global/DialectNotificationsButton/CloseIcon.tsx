import * as React from 'react'
import { SVGProps } from 'react'

const SvgX = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="x_svg__h-6 x_svg__w-6"
    fill="none"
    viewBox="-4 -4 32 32"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
)

export default SvgX
