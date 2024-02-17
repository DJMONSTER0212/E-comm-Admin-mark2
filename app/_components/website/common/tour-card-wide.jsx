import React from 'react'
import Image from 'next/image'
import { Badge } from '../../ui/badge'
import Link from 'next/link'
import { CheckCheck, Clock1, Sparkles } from 'lucide-react'
import BorderLink from '../../ui/border-link'

const TourCardWide = () => {
  return (
    <Link href='/' passHref className="relative group flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-5 md:justify-between items-start shadow-sm border rounded-md p-2 md:p-3 focus-visible:ring-1 focus-visible:outline-0 focus-visible:ring-ring">
      <div className="aspect-[3/2] overflow-hidden rounded-md relative group h-max">
        <Image src='/ds.jpg' alt='tour' width={400} height={400} quality={30} className='aspect-[3/2] object-cover group-hover:scale-105 transition-all' />
        <Badge className='absolute top-2 left-2 bg-white hover:bg-primary text-black hover:text-primary-foreground flex gap-1 items-center rounded-sm px-1 font-normal group/badge'><Sparkles className='w-3 h-3 text-primary group-hover/badge:text-primary-foreground' /> New • Popular</Badge>
      </div>
      <div className="flex flex-col w-full gap-3 md:gap-2 justify-between md:h-full md:col-span-2">
        <BorderLink className='md:text-lg font-semibold group-hover:font-semibold group-focus-visible:font-semibold mt-1' asText onGroupFocus onGroupHover>Jaisalmer: Red Dunes Desert Safari and Camel ride</BorderLink>
        <p className='text-sm font-normal text-muted-foreground max-md:hidden line-clamp-2 xl:line-clamp-3'>Take a break from sightseeing and delve into Italys beloved cuisine with this pasta and tiramisù cooking class in the heart of Rome. Roll up your sleeves and learn how to roll and fill fresh pasta like a pro plus pick up techniques for assembling a flawless tiramisù in a restaurant kitchen right on Piazza Navona. End by feasting on the dishes youve prepared, served with wine, limoncello, and coffee.</p>
        <div className="flex md:flex-col justify-between gap-2 items-start">
          <div className="flex flex-col gap-1">
            <p className='flex gap-3 items-center text-sm md:font-medium text-foreground'><Clock1 className='w-4 h-4' /> 3 Days</p>
            <p className='flex gap-3 items-center text-sm md:font-medium text-foreground'><CheckCheck className='w-4 h-4' /> Cancellation available</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:gap-1.5">
            <p className='text-xs md:text-sm font-normal text-foreground whitespace-nowrap md:mb-0.5'>From</p>
            <span className='text-xl font-bold whitespace-nowrap'>₹ 599</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TourCardWide