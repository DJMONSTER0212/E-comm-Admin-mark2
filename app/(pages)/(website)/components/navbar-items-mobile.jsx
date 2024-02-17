'use client'
import React from 'react'
import { Sparkles } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/_components/ui/accordion"
import BorderLink from '@/app/_components/ui/border-link';

const NavbarItemsMobile = ({ isSidebarOpen }) => {
    return (
        <div className={`${isSidebarOpen && 'w-full opacity-100 transition-all px-4'} px-0 z-30 md:z-0 w-0 opacity-0 transition-all fixed left-0 bg-background overflow-auto h-[calc(100vh-60px)] flex flex-col gap-3 pt-4`}>
            <Accordion type="single" defaultValue='popular-tours' collapsible>
                <AccordionItem value="popular-tours" className='border-none'>
                    <AccordionTrigger className='py-0' iconClassName='w-5 h-5'><BorderLink className='xs:text-lg' asText>Popular tours</BorderLink></AccordionTrigger>
                    <AccordionContent className='mt-3 pb-0'>
                        <div className="border rounded-md">
                            <Accordion type="single" defaultValue="popular-categories" collapsible>
                                <AccordionItem value="popular-categories">
                                    <AccordionTrigger className='font-medium text-sm px-3 py-2 data-[state=open]:border-b'><p className='flex gap-2 items-center'><Sparkles className='w-4 h-4' />Top categories</p></AccordionTrigger>
                                    <AccordionContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-between h-fit mt-3 px-3 pb-2'>
                                        <BorderLink href="/auth/signin" className='text-sm'>
                                            Rent a car
                                        </BorderLink>
                                        <BorderLink href="/auth/signin" className='text-sm'>
                                            Apply for Visa
                                        </BorderLink>
                                        <BorderLink href="/auth/signin" className='text-sm'>
                                            Book hotel
                                        </BorderLink>
                                        <BorderLink href="/auth/signin" className='text-sm'>
                                            Contact Us
                                        </BorderLink>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1" className='border-b-0'>
                                    <AccordionTrigger className='font-medium text-sm px-3 py-2 data-[state=open]:border-b'><p className='flex gap-2 items-center'><Sparkles className='w-4 h-4' />Top categories</p></AccordionTrigger>
                                    <AccordionContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-between h-fit mt-3 px-3 pb-2'>
                                        <BorderLink href="/explore/rented-cars" className='text-sm'>
                                            Rent a car
                                        </BorderLink>
                                        <BorderLink href="/apply-visa" className='text-sm'>
                                            Apply for Visa
                                        </BorderLink>
                                        <BorderLink href="/book-hotel" className='text-sm'>
                                            Book hotel
                                        </BorderLink>
                                        <BorderLink href="/contact-us" className='text-sm'>
                                            Contact Us
                                        </BorderLink>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <BorderLink href="/auth/signin" className='xs:text-lg'>
                Rent a car
            </BorderLink>
            <BorderLink href="/auth/signin" className='xs:text-lg'>
                Apply for Visa
            </BorderLink>
            <BorderLink href="/auth/signin" className='xs:text-lg'>
                Book hotel
            </BorderLink>
            <BorderLink href="/auth/signin" className='xs:text-lg'>
                Contact Us
            </BorderLink>
        </div>
    )
}

export default NavbarItemsMobile