import React from 'react'
import Image from 'next/image'
import { CarFront, Clock1, Fuel, MapPin, MapPinned, MoreVertical, Users } from 'lucide-react'
import BorderLink from '@/app/_components/ui/border-link'
import ArrowLink from '@/app/_components/ui/arrow-link'
import { Button } from '@/app/_components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu"

const BookingCard = () => {
    return (
        <div className="relative flex flex-col lg:grid lg:grid-cols-3 gap-3 lg:gap-5 lg:justify-between items-start shadow-sm border rounded-md p-2 lg:p-3 focus-visible:ring-1 focus-visible:outline-0 focus-visible:ring-ring">
            <div className="rounded-md relative flex flex-col justify-between h-full">
                <Image src='/car.webp' alt='car' width={400} height={400} quality={30} className='aspect-[3/2] h-full object-cover group-hover:scale-105 transition-all rounded-md' />
                <div className="flex mt-2">
                    <Button variant='secondary' className='w-full mr-2 border' size='sm' >Download invoice</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant='outline' className='h-8 w-8' size='icon' ><MoreVertical className='w-4 h-4' /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem>Cancel booking</DropdownMenuItem>
                            <DropdownMenuItem>View car</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="flex flex-col w-full gap-3 lg:gap-2 justify-between lg:h-full lg:col-span-2">
                <div className="flex gap-5 justify-between">
                    <div className="flex flex-col">
                        <BorderLink href='/' className='lg:text-lg font-semibold hover:font-semibold focus-visible:font-semibold mt-1'>EcoSport</BorderLink>
                        <p className='text-sm font-normal text-muted-foreground line-clamp-2 xl:line-clamp-3 mt-1.5 lg:mt-0.5'>Jaipur, Rajasthan, India</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className='text-3xl font-bold text-primary'>12</p>
                        <p className='text-base font-semibold text-foreground -mt-1'>DEC</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 bg-muted rounded-md p-3">
                        <div className="flex flex-col">
                            <p className='uppercase text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-2'><MapPin className="w-3 h-3" />Pick up point <BorderLink href='/' className='text-primary capitalize cursor-pointer text-xs'>Change</BorderLink></p>
                            <p className="ml-5 flex gap-3 items-center text-xs lg:font-medium text-foreground">
                                Narayan Singh Circle, Delhi Road, Jaipurs
                            </p>
                            <div className="flex-1"></div>
                            <ArrowLink href='/location' className='text-sm ml-5 mt-1' iconClassName='w-5'>Get direction</ArrowLink>
                        </div>
                        <div className="flex flex-col">
                            <p className='uppercase text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-2'><MapPinned className="w-3 h-3" /> Drop point <BorderLink href='/' className='text-primary capitalize cursor-pointer text-xs'>Change</BorderLink></p>
                            <p className="ml-5 flex gap-3 items-center text-xs lg:font-medium text-foreground">
                                Sindhi Camp Bus Stand, Jaipur
                            </p>
                            <div className="flex-1"></div>
                            <ArrowLink href='/location' className='text-sm ml-5 mt-1' iconClassName='w-5'>Get direction</ArrowLink>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                        <div className="flex flex-col bg-muted rounded-md p-3">
                            <p className='uppercase text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-2'><CarFront className='w-3 h-3' /> Company & Model</p>
                            <p className="ml-5 flex gap-3 items-center text-xs lg:font-medium text-foreground">
                                Toyota 2022
                            </p>
                        </div>
                        <div className="flex flex-col bg-muted rounded-md p-3">
                            <p className='uppercase text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-2'><Clock1 className="w-3 h-3" /> Booked for</p>
                            <p className="ml-5 flex gap-3 items-center text-xs lg:font-medium text-foreground">
                                3 Days
                            </p>
                        </div>
                        <div className="flex flex-col bg-muted rounded-md p-3">
                            <p className='uppercase text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-2'><Fuel className="w-3 h-3" /> Fuel type</p>
                            <p className="ml-5 flex gap-3 items-center text-xs lg:font-medium text-foreground">
                                Petrol
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingCard