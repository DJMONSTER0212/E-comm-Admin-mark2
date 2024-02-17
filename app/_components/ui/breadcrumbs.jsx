"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { ChevronRight, ArrowDown, ChevronDown } from 'lucide-react'
import { Button } from './button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu"
import Link from 'next/link'
import { cn } from '@/app/_lib/utils'
import { Skeleton } from './skeleton'

const Breadcrumbs = ({ breadcrumbs = [], className, loading }) => {
    const [visibleBreadcrumbs, setVisibleBreadcrumbs] = useState(0)
    const handleResize = useCallback(() => {
        // Get screen size
        const screenWidth = window.innerWidth;
        if (screenWidth < 350) {
            setVisibleBreadcrumbs(0);
        } else if (screenWidth >= 350 && screenWidth < 440) {
            setVisibleBreadcrumbs(0);
        } else if (screenWidth >= 440 && screenWidth < 850) {
            setVisibleBreadcrumbs(2);
        } else if (screenWidth >= 820 && screenWidth < 1080) {
            setVisibleBreadcrumbs(4);
        } else {
            setVisibleBreadcrumbs(5);
        }
    }, [])
    useEffect(() => {
        // Call handleResize on initial page load
        handleResize();
        // Call handleResize on window resize
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);
    return (
        <>
            {loading ?
                <div className={cn("flex gap-2 items-center", className)}>
                    <Skeleton className="bg-muted-foreground/10 rounded-md w-[8%] h-6"></Skeleton>
                    <Skeleton className="bg-muted-foreground/10 rounded-md w-[6%] h-6"></Skeleton>
                    <Skeleton className="bg-muted-foreground/10 rounded-md w-[12%] h-8"></Skeleton>
                </div>
                :
                <div className={cn("flex items-center", className)}>
                    {breadcrumbs.slice(0, Math.min(breadcrumbs.length - 1, visibleBreadcrumbs)).map((breadcrumb) => {
                        return breadcrumb.link ?
                            <Button key={breadcrumb.link} variant='ghost' size='sm' className='pr-1 whitespace-nowrap text-sm text-muted-foreground flex gap-2' asChild><Link href={breadcrumb.link} passHref>{breadcrumb.title} <ChevronRight className='w-4 h-4' /></Link></Button> :
                            <Button variant='ghost' size='sm' className='whitespace-nowrap text-foreground text-sm hover:bg-transparent hover:text-foreground'>{breadcrumb.title}</Button>
                    })}
                    {visibleBreadcrumbs < breadcrumbs.length - 1 &&
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' size='sm' className='whitespace-nowrap text-sm xxs:text-base xs:text-md text-muted-foreground flex gap-2 data-[state=open]:bg-muted'>{breadcrumbs.length - 1 - visibleBreadcrumbs} Page{breadcrumbs.length - 1 - visibleBreadcrumbs > 1 ? 's' : ''}<ChevronDown className='w-4 h-4' /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='start' className='w-[150px]'>
                                    <DropdownMenuLabel>Previews page{breadcrumbs.length - 1 - visibleBreadcrumbs > 1 ? 's' : ''}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {breadcrumbs.slice(visibleBreadcrumbs, breadcrumbs.length - 1).map((breadcrumb) => (
                                        <DropdownMenuItem key={breadcrumb.link} className='flex items-center justify-between' asChild><Link href={breadcrumb.link} passHref>{breadcrumb.title} <ArrowDown className='w-4 h-4' /></Link></DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    }
                    <h1 className={`text-foreground text-sm xxs:text-base xs:text-xl font-semibold hover:bg-transparent hover:text-foreground line-clamp-1 ${breadcrumbs.length == 1 ? 'px-0' : 'px-2'}`}>{breadcrumbs[breadcrumbs.length - 1].title}</h1>
                </div>
            }
        </>
    )
}

export default Breadcrumbs