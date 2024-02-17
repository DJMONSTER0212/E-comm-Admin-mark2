import React from 'react'
import Image from 'next/image'
import { Badge } from '../../ui/badge'
import Link from 'next/link'
import { Fuel, MapPin, Sparkles, Calendar, CheckCheck } from 'lucide-react'
import BorderLink from '../../ui/border-link'

const RentedCar = () => {
    return (
        <Link href='/' passHref className="relative group focus-visible:ring-1 focus-visible:outline-0 focus-visible:ring-ring focus-visible:p-2 transition-all rounded-md">
            <div className="aspect-[3/2] w-full overflow-hidden rounded-md relative group">
                <Image src='/car.webp' alt='tour' width={400} height={400} quality={30} className='aspect-[3/2] object-cover group-hover:scale-105 transition-all' />
                <Badge className='absolute top-2 left-2 bg-white hover:bg-primary text-black hover:text-primary-foreground flex gap-1 items-center rounded-sm px-1 font-normal group/badge'><Sparkles className='w-3 h-3 text-primary group-hover/badge:text-primary-foreground' /> New • Popular</Badge>
            </div>
            <div className="flex flex-col mt-2">
                <p className='flex gap-2 items-center text-sm font-normal text-muted-foreground'><MapPin className='w-3 h-3' /> Jaipur, Rajasthan, India</p>
                <div className="mt-1.5 flex gap-1 items-start">
                    <BorderLink className='font-semibold group-hover:font-semibold group-focus-visible:font-semibold' asText onGroupFocus onGroupHover>EcoSport</BorderLink>
                    <span className='text-xs font-medium text-foreground'>2022</span>
                </div>
                <div className="flex justify-between gap-2 items-start mt-2">
                    <div className="flex flex-col gap-1">
                        <p className='flex gap-3 items-center text-sm text-foreground'><Fuel className='w-4 h-4' /> Petrol</p>
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

export default RentedCar