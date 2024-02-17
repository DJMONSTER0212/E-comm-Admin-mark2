'use client'
import React from 'react'
import useSettings from '@/app/_conf/hooks/use-settings';
import { CheckCheck, FerrisWheel, Sparkles, Ticket } from 'lucide-react'
import ArrowLink from '@/app/_components/ui/arrow-link'
import { cn } from '@/app/_lib/utils'

const WhyUs = ({ className }) => {
    const { data: settings } = useSettings();
    return (
        <div className={cn("pt-10", className)}>
            <div className="bg-primary/10 py-10">
                <div className='max-w-screen-xl mx-auto p-screen grid grid-cols-1 lg:grid-cols-5 items-center gap-10'>
                    <div className="lg:col-span-2 flex flex-col">
                        <p className='text-3xl font-bold leading-[1.5]'>Why {settings.general.name} is the best choice to book tours and cars?</p>
                        <p className='text-base font-normal mt-3'>Use Reserve Now & Pay Later to secure the activities you don{"'"}t want to miss without being locked in.</p>
                        <ArrowLink href='/' className='mt-3'>Read customer reviews</ArrowLink>
                    </div>
                    <div className="lg:col-span-3 grid grid-cols-1 xs:grid-cols-2 gap-5">
                        <div className="bg-background/70 rounded-md w-full p-4">
                            <Ticket className='w-7 h-7 text-primary' />
                            <p className='text-lg font-semibold leading-[1.5] mt-3'>Easy cancellation</p>
                            <p className='text-base font-normal mt-1'>Stay flexible on your trip.</p>
                        </div>
                        <div className="bg-background/70 rounded-md w-full p-4">
                            <FerrisWheel className='w-7 h-7 text-primary' />
                            <p className='text-lg font-semibold leading-[1.5] mt-3'>300+ Tours and Cars</p>
                            <p className='text-base font-normal mt-1'>Make memories around the world.</p>
                        </div>
                        <div className="bg-background/70 rounded-md w-full p-4">
                            <Sparkles className='w-7 h-7 text-primary' />
                            <p className='text-lg font-semibold leading-[1.5] mt-3'>Loved by customers</p>
                            <p className='text-base font-normal mt-1'>4.3 stars from 140,000+ Trustpilot reviews.</p>
                        </div>
                        <div className="bg-background/70 rounded-md w-full p-4">
                            <CheckCheck className='w-7 h-7 text-primary' />
                            <p className='text-lg font-semibold leading-[1.5] mt-3'>Verified listings</p>
                            <p className='text-base font-normal mt-1'>Leave all your worries on us. We verify each listing.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhyUs