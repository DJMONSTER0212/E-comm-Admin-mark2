import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/app/_components/ui/badge'
import ArrowLink from '@/app/_components/ui/arrow-link'
import BorderLink from '@/app/_components/ui/border-link'

const PopularTourCities = () => {
    return (
        <div className='max-w-screen-xl mx-auto p-screen mt-20'>
            <div className="flex flex-col xs:flex-row gap-y-2 gap-x-5 items-start xs:items-center justify-between">
                <p className='text-3xl font-bold leading-[1.5]'>Popular tour destinations</p>
                <ArrowLink href='/'>Explore more</ArrowLink>
            </div>
            <div className="grid gap-5 grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-between items-start mt-10">
                <Link href='/' className="group relative rounded-md overflow-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none">
                    <Image src='/ds.jpg' alt='City' width={300} height={300} quality={30} className='aspect-[3/4] rounded-md object-cover group-hover:scale-105 group-focus-visible:scale-105 transition-all' />
                    <div className="rounded-md absolute bg-gradient-to-t from-foreground bottom-0 left-0 h-full w-full">
                        <div className="absolute bottom-2 left-2">
                            <BorderLink className='text-lg text-background hover:text-background group-hover:text-background group-focus-visible:text-background' asText onGroupHover onGroupFocus>Kullu</BorderLink>
                            <p className='text-sm text-background'>Himachal Pradesh, India</p>
                        </div>
                    </div>
                    <Badge className='absolute top-2 right-2 rounded-sm'>324+ Tours</Badge>
                </Link>
                <Link href='/' className="group relative rounded-md overflow-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none">
                    <Image src='/ds-2.jpg' alt='City' width={300} height={300} quality={30} className='aspect-[3/4] rounded-md object-cover group-hover:scale-105 group-focus-visible:scale-105 transition-all' />
                    <div className="rounded-md absolute bg-gradient-to-t from-foreground bottom-0 left-0 h-full w-full">
                        <div className="absolute bottom-2 left-2">
                            <BorderLink className='text-lg text-background hover:text-background group-hover:text-background group-focus-visible:text-background' asText onGroupHover onGroupFocus>Jaipur</BorderLink>
                            <p className='text-sm text-background'>Rajasthan, India</p>
                        </div>
                    </div>
                    <Badge className='absolute top-2 right-2 rounded-sm'>324+ Tours</Badge>
                </Link>
                <Link href='/' className="group relative rounded-md overflow-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none">
                    <Image src='/ds-3.jpg' alt='City' width={300} height={300} quality={30} className='aspect-[3/4] rounded-md object-cover group-hover:scale-105 group-focus-visible:scale-105 transition-all' />
                    <div className="rounded-md absolute bg-gradient-to-t from-foreground bottom-0 left-0 h-full w-full">
                        <div className="absolute bottom-2 left-2">
                            <BorderLink className='text-lg text-background hover:text-background group-hover:text-background group-focus-visible:text-background' asText onGroupHover onGroupFocus>Kullu</BorderLink>
                            <p className='text-sm text-background'>Himachal Pradesh, India</p>
                        </div>
                    </div>
                    <Badge className='absolute top-2 right-2 rounded-sm'>324+ Tours</Badge>
                </Link>
                <Link href='/' className="group relative rounded-md overflow-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none">
                    <Image src='/ds-4.jpg' alt='City' width={300} height={300} quality={30} className='aspect-[3/4] rounded-md object-cover group-hover:scale-105 group-focus-visible:scale-105 transition-all' />
                    <div className="rounded-md absolute bg-gradient-to-t from-foreground bottom-0 left-0 h-full w-full">
                        <div className="absolute bottom-2 left-2">
                            <BorderLink className='text-lg text-background hover:text-background group-hover:text-background group-focus-visible:text-background' asText onGroupHover onGroupFocus>Jaipur</BorderLink>
                            <p className='text-sm text-background'>Rajasthan, India</p>
                        </div>
                    </div>
                    <Badge className='absolute top-2 right-2 rounded-sm'>324+ Tours</Badge>
                </Link>
                <Link href='/' className="group relative rounded-md overflow-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none">
                    <Image src='/ds-2.jpg' alt='City' width={300} height={300} quality={30} className='aspect-[3/4] rounded-md object-cover group-hover:scale-105 group-focus-visible:scale-105 transition-all' />
                    <div className="rounded-md absolute bg-gradient-to-t from-foreground bottom-0 left-0 h-full w-full">
                        <div className="absolute bottom-2 left-2">
                            <BorderLink className='text-lg text-background hover:text-background group-hover:text-background group-focus-visible:text-background' asText onGroupHover onGroupFocus>Jaipur</BorderLink>
                            <p className='text-sm text-background'>Rajasthan, India</p>
                        </div>
                    </div>
                    <Badge className='absolute top-2 right-2 rounded-sm'>324+ Tours</Badge>
                </Link>
                <Link href='/' className="group relative rounded-md overflow-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none">
                    <Image src='/ds-4.jpg' alt='City' width={300} height={300} quality={30} className='aspect-[3/4] rounded-md object-cover group-hover:scale-105 group-focus-visible:scale-105 transition-all' />
                    <div className="rounded-md absolute bg-gradient-to-t from-foreground bottom-0 left-0 h-full w-full">
                        <div className="absolute bottom-2 left-2">
                            <BorderLink className='text-lg text-background hover:text-background group-hover:text-background group-focus-visible:text-background' asText onGroupHover onGroupFocus>Jaipur</BorderLink>
                            <p className='text-sm text-background'>Rajasthan, India</p>
                        </div>
                    </div>
                    <Badge className='absolute top-2 right-2 rounded-sm'>324+ Tours</Badge>
                </Link>
            </div>
        </div>
    )
}

export default PopularTourCities