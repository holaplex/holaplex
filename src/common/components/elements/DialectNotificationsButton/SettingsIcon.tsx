import * as React from 'react'
import { SVGProps } from 'react'

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      stroke="#D8D8D8"
      strokeWidth={2}
      strokeLinecap="round"
      d="M4 4v12M10 4v12M16 4v12"
    />
    <rect x={8} y={11} width={4} height={4} rx={1.5} fill="#fff" />
    <rect x={2} y={5} width={4} height={4} rx={1.5} fill="#fff" />
    <rect x={14} y={5} width={4} height={4} rx={1.5} fill="#fff" />
  </svg>
)

export default SvgComponent
