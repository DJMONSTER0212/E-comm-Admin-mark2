import React from 'react'
import { Skeleton } from '@/app/_components/ui/skeleton'

const MailTemplatesSkel = () => {
    return (
        <div className="bg-muted/50 rounded-md p-3 w-full h-full">
            <div className="flex items-center gap-3">
                <Skeleton className="bg-muted-foreground/10 rounded-md w-7 h-7"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[70%] h-4"></Skeleton>
            </div>
            <Skeleton className="bg-muted-foreground/10 rounded-md w-full h-0.5 my-2"></Skeleton>
            <div className='flex flex-col'>
                <div className="flex gap-2 items-center">
                    <Skeleton className="bg-muted-foreground/10 rounded-md w-1 h-3"></Skeleton>
                    <Skeleton className="bg-muted-foreground/10 rounded-md w-[50%] h-3"></Skeleton>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
                    <Skeleton className="bg-muted-foreground/10 rounded-md w-ful h-32"></Skeleton>
                </div>
            </div>
        </div>
    )
}

export default MailTemplatesSkel