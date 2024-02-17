import { MoveRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/app/_lib/utils'

const ArrowLink = ({ children, href = '/', className, asText, iconClassName }) => {
    if (asText) return (
        <p className={cn('text-primary font-medium group flex gap-2 items-center focus-visible:outline-none', className)}>{children} <MoveRight className={cn('group-hover:ml-1 group-focus-visible:ml-1 transition-all', iconClassName)} /></p>
    )
    return (
        <Link href={href} className={cn('text-primary font-medium group flex gap-2 items-center focus-visible:outline-none', className)}>{children} <MoveRight className={cn('group-hover:ml-1 group-focus-visible:ml-1 transition-all', iconClassName)} /></Link>
    )
}

export default ArrowLink