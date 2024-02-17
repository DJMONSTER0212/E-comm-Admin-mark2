import React from 'react'
import TourImages from './images'
import { Clock, Languages, MapPin, MapPinned, Share2 } from 'lucide-react'
import BorderLink from '@/app/_components/ui/border-link'
import { Button } from '@/app/_components/ui/button'
import ArrowLink from '@/app/_components/ui/arrow-link'
import AdditionalInfo from '../../common/additional-info'
import Includes from '../../common/includes'
import Itinerary from '../../common/itinerary'
import TourBooking from './booking/booking'

const Tour = ({ bookingDetails }) => {
    const itineraryItems = [
        {
            "order": 0,
            "title": "Day 1",
            "subTitle": "8 hours • Admission Ticket Included",
            "shortDesc": "Home to 21 exhibits with 65,000 marine animals Please check which option you have booked: Option 1: Combo Ticket Access to Aquaventure and Lost Chambers Aquarium Option 2: Aquaventure Park",
            "_id": {
                "$oid": "6566190f0b2132863eaec393"
            }
        },
        {
            "order": 0,
            "title": "Day 2",
            "subTitle": "2 Days • Jaipur vintage cars",
            "shortDesc": "Itinerary contains information of steps or path which you will follow in in tour",
            "_id": {
                "$oid": "656782ba4ed0e344538c403e"
            }
        }
    ]
    return (
        <>
            {/* // Name and location on desktop */}
            <div className='mb-7 hidden lg:block'>
                <h1 className='text-3xl font-bold leading-[1.5]'>Jaipur: Lose Yourself in the Land of Maharajas</h1>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 mt-1.5">
                    <BorderLink href='/' className='flex gap-2 items-center text-base text-muted-foreground hover:text-foreground focus-visible:text-foreground hover:font-normal focus-visible:font-normal whitespace-nowrap'><MapPin className='w-3 h-3' /> Jaipur, Rajasthan, India</BorderLink>
                    <span className='hidden lg:block'>•</span>
                    <button className='group focus-visible:outline-none'><BorderLink asText onGroupFocus onGroupHover className='flex gap-2 items-center text-base text-primary hover:font-normal group-hover:font-normal focus-visible:font-normal group-focus-visible:font-normal cursor-pointer whitespace-nowrap'><Share2 className='w-3 h-3' />Share tour</BorderLink></button>
                </div>
            </div>
            <TourImages
                tour={{
                    images: [
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696658196719-f8eb508dfbd6ccd2483d56e3f14f65c3.webp",
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696838495945-b8b971e696a05387fd2b65a17ccbd270.jpg",
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696838495944-76d8963cecf789593708334d0a8579f8.jpg",
                        "https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/oxystays/villas/1696838495944-0371c8a97e4497345bad998c98fefd31.jpg",
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
            <div className='mt-5 lg:hidden'>
                <h1 className='text-3xl font-bold leading-[1.5]'>Jaipur: Lose Yourself in the Land of Maharajas</h1>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 mt-1.5">
                    <BorderLink href='/' className='flex gap-2 items-center text-base text-muted-foreground hover:text-foreground focus-visible:text-foreground hover:font-normal focus-visible:font-normal whitespace-nowrap'><MapPin className='w-3 h-3' /> Jaipur, Rajasthan, India</BorderLink>
                    <span className='hidden lg:block'>•</span>
                    <button className='group focus-visible:outline-none'><BorderLink asText onGroupFocus onGroupHover className='flex gap-2 items-center text-base text-primary hover:font-normal group-hover:font-normal focus-visible:font-normal group-focus-visible:font-normal cursor-pointer whitespace-nowrap'><Share2 className='w-3 h-3' />Share tour</BorderLink></button>
                </div>
            </div>
            <div className="my-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 order-2 lg:order-1">
                    <div className="border border-primary rounded-md p-5 mt-5">
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-5">
                            <div className="flex items-center xs:items-start lg:items-center gap-3 rounded-md w-full">
                                <Button variant='secondary' size='icon' className='text-white' asChild><Languages className='min-h-[2.5rem] min-w-[2.5rem] p-2 shadow-none bg-gradient-to-r from-primary/80 to-rose-400' /></Button>
                                <div className="flex flex-col">
                                    <p className='text-base font-semibold leading-[1.5]'>Language</p>
                                    <p className='text-sm text-muted-foreground mt-1'>Hindi, English and Rajasthani</p>
                                </div>
                            </div>
                            <div className="flex items-center xs:items-start lg:items-center gap-3 rounded-md w-full">
                                <Button variant='secondary' size='icon' className='text-white' asChild><Clock className='min-h-[2.5rem] min-w-[2.5rem] p-2 shadow-none bg-gradient-to-r from-primary/80 to-rose-400' /></Button>
                                <div className="flex flex-col">
                                    <p className='text-base font-semibold leading-[1.5]'>Duration</p>
                                    <p className='text-sm text-muted-foreground mt-1'>3 Days</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="flex flex-col">
                                <p className='uppercase text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-2'><MapPin className="w-3 h-3" />Start Point</p>
                                <p className="ml-5 flex gap-3 items-center text-sm lg:font-medium text-foreground">
                                    Narayan Singh Circle, Delhi Road, Jaipurs
                                </p>
                                <div className="flex-1"></div>
                                <ArrowLink href='/location' className='text-sm ml-5 mt-1' iconClassName='w-5'>Get direction</ArrowLink>
                            </div>
                            <div className="flex flex-col">
                                <p className='uppercase text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-2'><MapPinned className="w-3 h-3" /> Drop point</p>
                                <p className="ml-5 flex gap-3 items-center text-sm lg:font-medium text-foreground">
                                    Sindhi Camp Bus Stand, Jaipur
                                </p>
                                <div className="flex-1"></div>
                                <ArrowLink href='/location' className='text-sm ml-5 mt-1' iconClassName='w-5'>Get direction</ArrowLink>
                            </div>
                        </div>
                    </div>
                    {/* // Description */}
                    <div className="flex flex-col gap-3 mt-10">
                        <p className='text-2xl font-semibold'>About the tour</p>
                        <p>Immerse yourself in Jaipur, the &quot;Pink City,&quot; a vibrant tapestry of royal heritage and bustling life. Wander majestic forts like Amber, echoing with tales of Maharajas, and marvel at Hawa Mahal&apos;s intricate facade.</p>
                    </div>
                    {/* // Itinerary */}
                    <Itinerary itineraryItems={itineraryItems} />
                    {/* // Includes */}
                    <Includes />
                    {/* // Additional info */}
                    <AdditionalInfo />
                </div>
                <TourBooking bookingDetails={bookingDetails} />
            </div>
        </>
    )
}
export default Tour