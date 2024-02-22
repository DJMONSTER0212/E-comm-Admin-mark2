'use client'
import React, { useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/app/_components/ui/carousel'
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image';
import { MoveRight, MoveLeft } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchAuthBanners } from '@/app/_server-actions/auth-banners'
import Message from '@/app/_components/ui/message';
import Link from 'next/link';

const Sidebar = () => {
    const [api, setApi] = useState();
    // Fetch auth banners
    const { data, isPending, isSuccess, error } = useQuery({
        queryKey: ['website-auth-banners'],
        queryFn: async () => { return await fetchAuthBanners() },
    });
    return (
        <div className="hidden md:block md:w-[60%] rounded bg-muted fixed left-0 top-0 h-screen ">
            <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
            {isPending && <p className='mb-5 text-base text-muted-foreground'>Loading...</p>}
            <Carousel
                setApi={setApi}
                plugins={[Autoplay({ delay: 4000, stopOnMouseEnter: true, stopOnInteraction: false })]}
                opts={{ align: "start", loop: true }}
                className='h-screen w-full overflow-hidden bg-black'
            >
                <CarouselContent>
                    {isSuccess && data.length > 0 ? data.map((banner, index) => (
                        <CarouselItem key={index} >
                            <div className='relative'>
                                <div className="flex flex-col z-10 absolute bottom-10 left-10 right-10">
                                    <h2 className='text-6xl font-bold text-background leading-[1.2]'>{banner.title} </h2>
                                    <p className='text-lg font-medium text-background'>{banner.shortDesc}</p>
                                    {(banner.link && banner.btnTitle) && <Button className='w-fit bg-background hover:bg-background/70 text-foreground mt-5' asChild><Link href={banner.link}>{banner.btnTitle} <MoveRight className='ml-3 h-5 w-5 text-foreground' /></Link></Button>}
                                </div>
                                <div className="flex gap-5 items-center mt-5 absolute top-10 right-10 z-10">
                                    <MoveLeft onClick={() => api.scrollNext()} className='h-10 w-10 text-background cursor-pointer' />
                                    <MoveRight onClick={() => api.scrollPrev()} className='h-10 w-10 text-background cursor-pointer' />
                                </div>
                                <Image src={banner.image} width={1000} height={1500} alt={banner.title} className='opacity-60 bg-blend-darken w-full h-screen object-cover' />
                            </div>
                        </CarouselItem>
                    ))
                        : <p className='mb-5 text-base text-muted-foreground'>No auth banners found.</p>
                    }
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export default Sidebar