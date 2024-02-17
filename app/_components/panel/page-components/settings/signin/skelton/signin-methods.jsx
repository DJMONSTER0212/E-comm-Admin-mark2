import React from 'react'
import { Skeleton } from '@/app/_components/ui/skeleton'

const SigninMethodsSkel = () => {
    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
            <div className="bg-muted/50 rounded-md p-3 w-full h-full">
                <Skeleton className="bg-muted-foreground/10 rounded-md w-10 h-10"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[70%] h-4 mt-3"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2 mt-2"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2 mt-0.5"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-full h-9 mt-3"></Skeleton>
            </div>
            <div className="bg-muted/50 rounded-md p-3 w-full h-full">
                <Skeleton className="bg-muted-foreground/10 rounded-md w-10 h-10"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[70%] h-4 mt-3"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2 mt-2"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2 mt-0.5"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-full h-9 mt-3"></Skeleton>
            </div>
            <div className="bg-muted/50 rounded-md p-3 w-full h-full">
                <Skeleton className="bg-muted-foreground/10 rounded-md w-10 h-10"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[70%] h-4 mt-3"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2 mt-2"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2 mt-0.5"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-full h-9 mt-3"></Skeleton>
            </div>
            <div className="bg-muted/50 rounded-md p-3 w-full h-full">
                <Skeleton className="bg-muted-foreground/10 rounded-md w-10 h-10"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[70%] h-4 mt-3"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2 mt-2"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2 mt-0.5"></Skeleton>
                <Skeleton className="bg-muted-foreground/10 rounded-md w-full h-9 mt-3"></Skeleton>
            </div>
        </div>
    )
}

export default SigninMethodsSkel