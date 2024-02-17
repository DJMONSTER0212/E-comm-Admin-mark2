'use client'
import React, { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import Link from 'next/link';
import { MoveRight, MoveLeft } from 'lucide-react';
import Image from 'next/image';
import Search from './search/search';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/app/_components/ui/carousel'
import Autoplay from "embla-carousel-autoplay"

const HomepageBanner = () => {
    const [api, setApi] = useState();
    return (
        <div className="relative">
            <Carousel
                setApi={setApi}
                plugins={[Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false })]}
                opts={{ align: "center", loop: true }}
                className="relative group mb-60 md:mb-28"
            >
                <div className='h-[70vh] max-h-[550px] w-full overflow-hidden'>
                    <CarouselContent>
                        <CarouselItem>
                            <div className="relative">
                                <Image src='/ds.jpg' width={800} height={550} quality={70} alt='s' priority className='w-full h-[70vh] max-h-[550px] object-cover' />
                                <div className="absolute bg-gradient-to-b from-foreground/60 bottom-0 left-0 h-full w-full">
                                    <div className="max-w-screen-xl mx-auto p-screen z-20 absolute top-14 md:top-10 left-0 right-0">
                                        <h2 className='text-3xl leading-[1.4] md:text-[3rem] font-semibold md:font-bold text-background'>Explore the beautiful sand dunes of Jaisalmer at Rajasthan</h2>
                                        <p className='max-md:mt-3 w-full md:w-[75%] text-lg font-normal text-background'>Embark on a mesmerizing journey through the captivating dunes of Jaisalmer in Rajasthan.</p>
                                        <Button className='w-fit bg-background hover:bg-background/70 text-foreground mt-3' asChild><Link href='/'>Explore now <MoveRight className='ml-3 h-5 w-5 text-foreground' /></Link></Button>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="relative">
                                <Image src='/ds-2.jpg' width={800} height={550} quality={70} alt='s' priority className='w-full h-[70vh] max-h-[550px] object-cover' />
                                <div className="absolute bg-gradient-to-b from-foreground/60 bottom-0 left-0 h-full w-full">
                                    <div className="max-w-screen-xl mx-auto p-screen z-20 absolute top-14 md:top-10 left-0 right-0">
                                        <h2 className='text-3xl leading-[1.4] md:text-[3rem] font-semibold md:font-bold text-background'>Manali is missing you in this weather of snowfall and PHADI MAGGIE.</h2>
                                        <p className='max-md:mt-3 w-full md:w-[75%] text-lg font-normal text-background'>Manali{"'"}s snowfall whispers tales of your absence, echoing through the frosty air. The longing intensifies with every phadi maggie moment.</p>
                                        <Button className='w-fit bg-background hover:bg-background/70 text-foreground mt-3' asChild><Link href='/'>Explore now <MoveRight className='ml-3 h-5 w-5 text-foreground' /></Link></Button>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </div>
                <div className="transition-all opacity-0 group-hover:opacity-100 -top-5 group-hover:top-2 flex gap-5 items-center absolute right-4  z-10">
                    <MoveLeft onClick={() => api.scrollNext()} className='h-7 w-7 text-background cursor-pointer' />
                    <MoveRight onClick={() => api.scrollPrev()} className='h-7 w-7 text-background cursor-pointer' />
                </div>
            </Carousel>
            {/* // Search */}
            <div className="max-w-screen-xl mx-auto p-screen z-20 absolute -bottom-[200px] xs:-bottom-[170px] md:-bottom-[70px] left-0 right-0">
                <Search />
            </div>
        </div>
    )
}

export default HomepageBanner