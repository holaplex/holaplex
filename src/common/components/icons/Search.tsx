import { FC, SVGProps } from "react"

interface SearchIconProps extends SVGProps<SVGSVGElement> {
    color?: string
}

export const Search: FC<SearchIconProps> = ({ color = `#ffffff`, ...props}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={`none`} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search" {...props}>
            <circle cx="11" cy="11" r="8">
            </circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    )
}