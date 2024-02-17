'use client'
import BorderLink from '@/app/_components/ui/border-link'
import { Separator } from '@/app/_components/ui/separator'
import { CarFront, FerrisWheel, UserCog } from 'lucide-react'
import React from 'react'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
    const pathname = usePathname();
    return (
        <div className="w-full md:col-span-2 lg:col-span-1 md:sticky md:top-0 order-2 md:order-1 flex flex-col gap-10 h-fit">
            <Separator className='md:hidden' />
            {/* // Account pages */}
            <div>
                <BorderLink href='/account' isActive={pathname == '/account'} className='text-xl font-semibold hover:font-semibold focus-visible:font-semibold'>Your account</BorderLink>
                <p className='text-sm text-muted-foreground mt-1.5'>Manage Your Bookings, Profile, and More</p>
                <div className="mt-4 flex flex-col gap-2">
                    <BorderLink href='/profile' isActive={pathname == '/profile'} className='flex items-center gap-2 text-foreground font-medium'><UserCog className='w-4 min-w-4 h-4 min-h-4' />Account settings</BorderLink>
                    <BorderLink href='/tour-bookings' isActive={pathname == '/tour-bookings'} className='flex items-center gap-2 text-foreground font-medium'><FerrisWheel className='w-4 min-w-4 h-4 min-h-4' />Tour bookings</BorderLink>
                    <BorderLink href='/car-bookings' isActive={pathname == '/car-bookings'} className='flex items-center gap-2 text-foreground font-medium'><CarFront className='w-4 min-w-4 h-4 min-h-4' />Car bookings</BorderLink>
                </div>
            </div>
        </div>
    )
}

export default Sidebar