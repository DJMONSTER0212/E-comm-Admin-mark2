'use client'
import React from 'react'
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from '@/app/_lib/utils';
import { Button } from '@/app/_components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react"
import Link from 'next/link';

const Pagignation = ({ className, totalPages }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    let page = Number(searchParams.get('page')) || 1;
    // Function to create url query string >>>>>>>>>>>>>>>>>>>>>>
    const createQueryString = (params) => {
        const newSearchParams = new URLSearchParams(searchParams?.toString());
        for (const [key, value] of Object.entries(params)) {
            if (value === null) {
                newSearchParams.delete(key);
            } else {
                newSearchParams.set(key, String(value));
            }
        }
        return newSearchParams.toString();
    };
    const goToPage = (page) => {
        router.push(`${pathname}?${createQueryString({ page: page })}`);
    }
    const goPrevPage = () => {
        router.push(`${pathname}?${createQueryString({ page: page - 1 })}`);
    }
    const goNextPage = () => {
        router.push(`${pathname}?${createQueryString({ page: page + 1 })}`);
    }
    return (
        <>
            {totalPages > 1 &&
                <div className={cn('flex justify-center py-2', className)}>
                    <div className='flex gap-3 items-center justify-center'>
                        <Button onClick={goPrevPage} variant='ghost' disabled={page == 1} size='icon' aria-label='Go to previous page'>
                            <ChevronLeft className='w-4 h-4' />
                        </Button>
                        {(page - 1 != 1 && page != 1) && <Button onClick={() => goToPage(1)} className='p-0' variant='ghost' size='icon'>
                            <Link href='#' className='f-full w-full'>1</Link>
                        </Button>}
                        {page - 1 > 2 && <Button variant='ghost' disabled className='disabled:opacity-100' size='icon'>
                            <MoreHorizontal className='w-4 h-4' />
                        </Button>}
                        {page - 1 >= 1 && <Button onClick={() => goToPage(page - 1)} variant='ghost' size='icon'>
                            {page - 1}
                        </Button>}
                        <Button onClick={() => goToPage(page)} variant='outline' size='icon'>
                            {page}
                        </Button>
                        {page + 1 <= totalPages && <Button onClick={() => goToPage(page + 1)} variant='ghost' size='icon'>
                            {page + 1}
                        </Button>}
                        {page + 1 < totalPages - 1 && <Button variant='ghost' disabled className='disabled:opacity-100' size='icon'>
                            <MoreHorizontal className='w-4 h-4' />
                        </Button>}
                        {(page + 1 != totalPages && page != totalPages) && <Button onClick={() => goToPage(totalPages)} variant='ghost' size='icon'>
                            {totalPages}
                        </Button>}
                        <Button onClick={goNextPage} variant='ghost' disabled={page == totalPages} size='icon' aria-label='Go to next page'>
                            <ChevronRight className='w-4 h-4' />
                        </Button>
                    </div>
                </div>
            }
        </>
    )
}

export default Pagignation