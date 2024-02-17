import React, { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { Route } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import TourItineraryDetailsEdit from './itinerary-details-edit';

const TourItineraryDetails = ({ tour }) => {
    const [isItineraryDetailsEditOpen, setIsItineraryDetailsEditOpen] = useState(false)
    return (
        <>
            <Card>
                <CardHeader>
                    <Route className='w-10 h-10 text-red-500 border p-1.5 rounded-md mb-2' />
                    <CardTitle size='lg' className='flex items-end gap-2 justify-between'>Tour itinerary {(tour.itinerary?.title || tour.itinerary?.desc) && <Button variant='outline' size='sm' className='h-6 rounded-sm' onClick={() => { setIsItineraryDetailsEditOpen(true) }}>Edit</Button>}</CardTitle>
                    <CardDescription>Tour itinerary details contains title and description for the tour itinerary section.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2 justify-start">
                        {tour.itinerary?.title ?
                            <p className="capitalize text-xl font-bold">{tour.itinerary.title}</p>
                            : <Button variant='outline' size='sm' className='h-6 rounded-sm w-fit' onClick={() => { setIsItineraryDetailsEditOpen(true) }}>Set up now</Button>
                        }
                        {tour.itinerary?.desc ?
                            <p className="text-base text-foreground">{tour.itinerary.desc}</p>
                            : tour.itinerary?.title && <p className='text-sm text-muted-foreground' onClick={() => { setIsItineraryDetailsEditOpen(true) }}>Description not available. <span className='hover:text-primary cursor-pointer'>Set up now</span></p>
                        }
                    </div>
                </CardContent>
            </Card>
            <TourItineraryDetailsEdit tour={tour} open={isItineraryDetailsEditOpen} setOpen={setIsItineraryDetailsEditOpen} />
        </>
    )
}

export default TourItineraryDetails