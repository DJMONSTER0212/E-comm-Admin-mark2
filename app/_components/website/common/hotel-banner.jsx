'use client'
import React from 'react'
import Link from 'next/link'
import { cn } from '@/app/_lib/utils'
import Image from 'next/image'
import { Button } from '../../ui/button'

const HotelBanner = ({ className }) => {
    return (
        <div className={cn("bg-[#FEFEE3] mt-20 relative", className)}>
            <Image src='/book-hotel-banner.jpg' alt='book hotel' width={1700} height={450} quality={30} className='w-full h-[750px] object-cover max-h-[650px] md:max-h-[450px]' />
            <div className="max-w-screen-xl mx-auto p-screen z-20 absolute top-[50%] -translate-y-[50%] left-0 right-0">
                <div className="flex flex-col max-w-[90%] xs:max-w-[70%] lg:max-w-[50%] p-4 lg:p-8 rounded-sm rounded-l-none border-x-4 border-r-0 border-primary bg-foreground/20 backdrop-blur-sm">
                    <p className='text-3xl font-bold leading-[1.5] text-background'>Take your Stay <span className='text-primary'>EXPERIENCE</span> to the next level by booking your stay with our verified partners</p>
                    <p className='text-base font-normal mt-3 text-background'>Use Reserve Now & Pay Later to secure the activities you don{"'"}t want to miss without being locked in.</p>
                    <Button className='mt-3' asChild><Link href='/'>Book your stay now</Link></Button>
                </div>
            </div>
        </div>
    )
}

export default HotelBanner