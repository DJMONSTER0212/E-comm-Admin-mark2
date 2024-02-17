import React from 'react'
import CarImages from './images'
import { Calendar, CarFront, Fuel, MapPin, Share2, SquareStack } from 'lucide-react'
import BorderLink from '@/app/_components/ui/border-link'
import { Button } from '@/app/_components/ui/button'
import AdditionalInfo from '../../common/additional-info'
import Includes from '../../common/includes'
import CarBooking from './booking/booking'

const Car = ({ bookingDetails }) => {
    return (
        <>
            {/* // Name and location on desktop */}
            <div className='mb-7 hidden md:block'>
                <h1 className='text-3xl font-bold leading-[1.5]'>EcoSport</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1.5">
                    <BorderLink href='/' className='flex gap-2 items-center text-base text-muted-foreground hover:text-foreground focus-visible:text-foreground hover:font-normal focus-visible:font-normal whitespace-nowrap'><MapPin className='w-3 h-3' /> Jaipur, Rajasthan, India</BorderLink>
                    <span className='hidden md:block'>•</span>
                    <button className='group focus-visible:outline-none'><BorderLink asText onGroupFocus onGroupHover className='flex gap-2 items-center text-base text-primary hover:font-normal group-hover:font-normal focus-visible:font-normal group-focus-visible:font-normal cursor-pointer whitespace-nowrap'><Share2 className='w-3 h-3' />Share car</BorderLink></button>
                </div>
            </div>
            <CarImages
                car={{
                    images: [
                        "https://www.vdm.ford.com/content/dam/vdm_ford/live/en_us/ford/nameplate/ecosport/2022/collections/3-2/22_FRD_ECO_000010_TNM_16x9.jpg/jcr:content/renditions/cq5dam.web.768.768.jpeg",
                        "https://media.zigcdn.com/media/content/2020/Jan/zw-thumb-img-1.jpg",
                        "https://hips.hearstapps.com/hmg-prod/images/2021-ford-ecosport-mmp-1-1595429761.jpg",
                        "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/5GAAYWZLMNPHPPIRLYYU7YPMCE.jpg",
                        "https://www.topgear.com/sites/default/files/2023/12/EcoSport_01.jpg",
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696838495945-483e9690d9fb2175be55b68feab21dd4.jpg",
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696838495945-5d2ccf5bdd9081b0d890d9adba5ce206.jpg",
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696838495944-a413a2be422c9bebd5d20ca95a30d681.jpg",
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696838495936-a05308fa3c46d1a3239881f6eed8801c.jpg",
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696838495944-7e58a203c22c5dc10e3e3288207c2a27.jpg",
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696838495946-e0fc8c96b381ea0b03849208c3ca0b2c.jpg",
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696838495943-6a0d71e411a07f7691cf8e7ed72aa874.jpg"
                    ]
                }}
            />
            {/* // Name and location on mobile */}
            <div className='mt-5 md:hidden'>
                <h1 className='text-3xl font-bold leading-[1.5]'>EcoSport</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1.5">
                    <BorderLink href='/' className='flex gap-2 items-center text-base text-muted-foreground hover:text-foreground focus-visible:text-foreground hover:font-normal focus-visible:font-normal whitespace-nowrap'><MapPin className='w-3 h-3' /> Jaipur, Rajasthan, India</BorderLink>
                    <span className='hidden md:block'>•</span>
                    <button className='group focus-visible:outline-none'><BorderLink asText onGroupFocus onGroupHover className='flex gap-2 items-center text-base text-primary hover:font-normal group-hover:font-normal focus-visible:font-normal group-focus-visible:font-normal cursor-pointer whitespace-nowrap'><Share2 className='w-3 h-3' />Share car</BorderLink></button>
                </div>
            </div>
            <div className="my-5 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 order-2 md:order-1">
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                        <div className="flex items-center xs:items-start md:items-center gap-3 rounded-md w-full">
                            <Button variant='secondary' size='icon' className='text-white' asChild><Fuel className='min-h-[2.5rem] min-w-[2.5rem] p-2 shadow-none bg-gradient-to-r from-primary/80 to-rose-400' /></Button>
                            <div className="flex flex-col">
                                <p className='text-base font-semibold leading-[1.5]'>Fule type</p>
                                <p className='text-sm text-muted-foreground mt-1'>Petrol & CNG</p>
                            </div>
                        </div>
                        <div className="flex items-center xs:items-start md:items-center gap-3 rounded-md w-full">
                            <Button variant='secondary' size='icon' className='text-white' asChild><Calendar className='min-h-[2.5rem] min-w-[2.5rem] p-2 shadow-none bg-gradient-to-r from-primary/80 to-rose-400' /></Button>
                            <div className="flex flex-col">
                                <p className='text-base font-semibold leading-[1.5]'>Model year</p>
                                <p className='text-sm text-muted-foreground mt-1'>2023</p>
                            </div>
                        </div>
                        <div className="flex items-center xs:items-start md:items-center gap-3 rounded-md w-full">
                            <Button variant='secondary' size='icon' className='text-white' asChild><CarFront className='min-h-[2.5rem] min-w-[2.5rem] p-2 shadow-none bg-gradient-to-r from-primary/80 to-rose-400' /></Button>
                            <div className="flex flex-col">
                                <p className='text-base font-semibold leading-[1.5]'>Company</p>
                                <p className='text-sm text-muted-foreground mt-1'>Toyota</p>
                            </div>
                        </div>
                        <div className="flex items-center xs:items-start md:items-center gap-3 rounded-md w-full lg:col-span-2">
                            <Button variant='secondary' size='icon' className='text-white' asChild><SquareStack className='min-h-[2.5rem] min-w-[2.5rem] p-2 shadow-none bg-gradient-to-r from-primary/80 to-rose-400' /></Button>
                            <div className="flex flex-col">
                                <p className='text-base font-semibold leading-[1.5]'>Flexibility</p>
                                <p className='text-sm text-muted-foreground mt-1'>Multiple pickup and drop points</p>
                            </div>
                        </div>
                    </div>
                    {/* // Description */}
                    <div className="flex flex-col mt-10">
                        <p className='text-2xl font-semibold'>About the car</p>
                        <p className='mt-5'> Revolutionizing automotive sustainability with eco-friendly spare parts. Engineered for durability, performance, and environmental responsibility. Embrace a greener future without compromising on quality or reliability.</p>
                    </div>
                    {/* // Includes */}
                    <Includes forCar />
                    {/* // Additional info */}
                    <AdditionalInfo />
                </div>
                <CarBooking bookingDetails={bookingDetails} />
            </div>
        </>
    )
}
export default Car