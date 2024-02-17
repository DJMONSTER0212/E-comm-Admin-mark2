import React from 'react'
import Image from 'next/image'
import { Badge } from '../../ui/badge'
import Link from 'next/link'
import { CheckCheck, Clock1, MapPin, Sparkles } from 'lucide-react'
import BorderLink from '../../ui/border-link'

const TourCard = () => {
    return (
        <Link href='/' className="relative group focus-visible:ring-1 focus-visible:outline-0 focus-visible:ring-ring focus-visible:p-2 transition-all rounded-md">
            <div className="aspect-[3/2] w-full overflow-hidden rounded-md relative">
                <Image src='/ds-4.jpg' alt='tour' width={400} height={400} quality={30} className='aspect-[3/2] object-cover group-hover:scale-105 transition-all' />
                <Badge className='absolute top-2 left-2 bg-white hover:bg-primary text-black hover:text-primary-foreground flex gap-1 items-center rounded-sm px-1 font-normal group/badge'><Sparkles className='w-3 h-3 text-primary group-hover/badge:text-primary-foreground' /> New • Popular</Badge>
            </div>
            <div className="flex flex-col mt-2">
                <p className='flex gap-2 items-center text-sm font-normal text-muted-foreground'><MapPin className='w-3 h-3' /> Jaipur, Rajasthan, India</p>
                <BorderLink className='font-semibold group-hover:font-semibold group-focus-visible:font-semibold mt-1.5' asText onGroupFocus onGroupHover>Jaisalmer: Red Dunes Desert Safari and Camel ride</BorderLink>
                <div className="flex justify-between gap-2 items-start mt-2">
                    <div className="flex flex-col gap-1">
                        <p className='flex gap-3 items-center text-sm text-foreground'><Clock1 className='w-4 h-4' /> 3 Days</p>
                        <p className='flex gap-3 items-center text-sm text-foreground'><CheckCheck className='w-4 h-4' /> Cancellation available</p>
                    </div>
                    <div className="flex flex-col">
                        <p className='text-xs font-normal text-foreground whitespace-nowrap'>From</p>
                        <span className='text-xl font-bold whitespace-nowrap'>₹ 599</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default TourCard