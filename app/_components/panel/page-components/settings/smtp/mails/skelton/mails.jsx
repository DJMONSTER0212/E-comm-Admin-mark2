import React from 'react'
import { Skeleton } from '@/app/_components/ui/skeleton'

const MailsSkel = () => {
  return (
    <div className="bg-muted/50 rounded-md p-3 w-full h-fit">
      <div className="flex gap-3">
        <Skeleton className="bg-muted-foreground/10 rounded-md w-10 h-10"></Skeleton>
        <div className="flex flex-col gap-1">
          <Skeleton className="bg-muted-foreground/10 rounded-md w-[50%] h-4"></Skeleton>
          <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2"></Skeleton>
        </div>
      </div>
      <Skeleton className="bg-muted-foreground/10 rounded-md w-full h-0.5 my-2"></Skeleton>
      <div className="flex gap-2 items-center">
        <Skeleton className="bg-muted-foreground/10 rounded-md w-1 h-3"></Skeleton>
        <Skeleton className="bg-muted-foreground/10 rounded-md w-[50%] h-3"></Skeleton>
      </div>
      <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-10 mt-2"></Skeleton>
      <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2 mt-1"></Skeleton>
      <Skeleton className="bg-muted-foreground/10 rounded-md w-full h-9 mt-3"></Skeleton>
      <Skeleton className="bg-muted-foreground/10 rounded-md w-full h-0.5 my-2"></Skeleton>
      <div className="flex gap-2 items-center">
        <Skeleton className="bg-muted-foreground/10 rounded-md w-1 h-3"></Skeleton>
        <Skeleton className="bg-muted-foreground/10 rounded-md w-[50%] h-3"></Skeleton>
      </div>
      <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-10 mt-2"></Skeleton>
      <Skeleton className="bg-muted-foreground/10 rounded-md w-[100%] h-2 mt-1"></Skeleton>
      <Skeleton className="bg-muted-foreground/10 rounded-md w-full h-9 mt-3"></Skeleton>
    </div>
  )
}

export default MailsSkel