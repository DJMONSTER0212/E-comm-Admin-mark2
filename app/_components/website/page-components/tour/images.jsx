'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/app/_components/ui/sheet"
import { Close } from '@radix-ui/react-dialog';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';

const TourImages = ({ tour }) => {
    const [isImagesSidebarOpen, setIsImagesSidebarOpen] = useState(false)
    return (
        <>
            {/* // Pinned images */}
            <div className="grid grid-cols-1 xs:grid-cols-3 md:grid-cols-4 gap-3 relative">
                <div className="xs:col-span-2">
                    <Image src={tour.images[0]} priority height={600} width={600} quality={50} alt='Tour' className='aspect-[3/2] bg-muted rounded-sm  w-full object-cover' />
                </div>
                <div className="hidden xs:grid gap-3 grid-cols-1">
                    {tour.images.slice(1, 3).map((image, index) => (
                        <Image key={index} src={image} priority height={300} width={300} quality={50} alt='Tour' className='w-full aspect-[3/2] bg-muted rounded-sm  object-cover' />
                    ))}
                </div>
                <div className="hidden md:grid gap-3 grid-cols-1">
                    {tour.images.slice(3, 5).map((image, index) => (
                        <Image key={index} src={image} priority height={300} width={300} quality={50} alt='Tour' className='w-full aspect-[3/2] bg-muted rounded-sm object-cover' />
                    ))}
                </div>
                <Button variant='outline' size='sm' onClick={() => setIsImagesSidebarOpen(!isImagesSidebarOpen)} className='cursor-pointer gap-2 absolute bottom-2 left-2'><ImageIcon className='w-4 h-4' /> View all {tour.images.length} images</Button>
            </div>
            {/* // Images sidebar */}
            <Sheet open={isImagesSidebarOpen} onOpenChange={setIsImagesSidebarOpen}>
                <SheetContent side='bottom' hideCloseIcon className='h-full overflow-auto p-0 px-6'>
                    <SheetHeader className='flex-row justify-between w-[100%] sm:w-[70%] mx-auto sticky top-0 z-50 bg-background py-4 space-y-0 gap-2 items-start'>
                        <div className="flex flex-col">
                            <SheetTitle>Tour images</SheetTitle>
                            <SheetDescription className='mt-1'>Some of the greate picture from the past experiences of this tour.</SheetDescription>
                        </div>
                        <Close className="border p-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Close>
                    </SheetHeader>
                    <div className="grid grid-cols-1 justify-center items-center gap-3 mt-5 w-[100%] sm:w-[70%] mx-auto">
                        {tour.images.map((image, index) => (
                            <Image key={index} src={image} height={800} width={800} quality={70} alt='Villa' className='aspect-[3/2] bg-muted rounded-sm mx-auto w-full' />
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default TourImages