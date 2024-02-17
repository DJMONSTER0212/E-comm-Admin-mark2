import Link from 'next/link'
import React from 'react'
import { cn } from '@/app/_lib/utils'

export const baseClassNames = 'text-base font-normal transition-all text-foreground hover:border-x-2 focus-visible:border-x-2 hover:border-r-0 focus-visible:border-r-0 border-primary focus-visible:border-primary hover:pl-1.5 focus-visible:pl-1.5 hover:font-medium focus-visible:font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50'
const onGroupFocusClassNames = 'group-focus-visible:border-x-2 group-focus-visible:border-r-0 group-focus-visible:border-primary group-focus-visible:pl-1.5 group-focus-visible:font-medium'
const onGroupHoverClassNames = 'group-hover:border-x-2 group-hover:border-r-0 group-hover:border-primary group-hover:pl-1.5 group-hover:font-medium'
const isActiveClassNames = 'border-x-2 border-r-0 border-primary pl-1.5 font-medium'

const BorderLink = ({ children, href = '/', asText = false, isActive, onGroupFocus, onGroupHover, className, ...props }) => {
    if (asText) {
        return (
            <p className={cn(baseClassNames, onGroupFocus && onGroupFocusClassNames, onGroupHover && onGroupHoverClassNames, isActive && isActiveClassNames, className)} {...props}>{children}</p>
        )
    } else {
        return (
            <Link href={href} className={cn(baseClassNames, onGroupFocus && onGroupFocusClassNames, onGroupHover && onGroupHoverClassNames, isActive && isActiveClassNames, className)} {...props}>{children}</Link>
        )
    }
}

export default BorderLink