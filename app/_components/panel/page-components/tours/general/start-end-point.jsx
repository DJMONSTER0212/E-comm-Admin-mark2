import React, { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import TourStartEndPointEdit from './start-end-point-edit';

const TourStartEndPoint = ({ tour }) => {
    const [isStartEndPointEditOpen, setIsStartEndPointEditOpen] = useState(false)
    return (
        <>
            <Card>
                <CardHeader>
                    <MapPin className='w-10 h-10 text-violet-500 border p-1.5 rounded-md mb-2' />
                    <CardTitle size='lg' className='flex items-end gap-2 justify-between'>Start-End Points {(tour.startPoint?.address || tour.endPoint?.address) && <Button variant='outline' size='sm' className='h-6 rounded-sm' onClick={() => { setIsStartEndPointEditOpen(true) }}>Edit</Button>}</CardTitle>
                    <CardDescription>Start-end points are the locatiom of tour{"'"}s starting and ending points.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col justify-start">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {tour.startPoint?.address ? tour.startPoint.mapsLink ?
                                <Link href={tour.startPoint.mapsLink} className="capitalize">{tour.startPoint.address}</Link>
                                : <p className="capitalize">{tour.startPoint.address}</p>
                                : <Button variant='outline' size='sm' className='h-6 rounded-sm' onClick={() => { setIsStartEndPointEditOpen(true) }}>Set up now</Button>
                            }
                        </div>
                        <div className="h-2 w-1 ml-[8px] border-l border-dashed border-primary"></div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-foreground" />
                            {tour.endPoint?.address ? tour.endPoint.mapsLink ?
                                <Link href={tour.endPoint.mapsLink} className="capitalize">{tour.endPoint.address}</Link>
                                : <p className="capitalize">{tour.endPoint.address}</p>
                                : <Button variant='outline' size='sm' className='h-6 rounded-sm' onClick={() => { setIsStartEndPointEditOpen(true) }}>Set up now</Button>
                            }
                        </div>
                    </div>
                </CardContent>
            </Card>
            <TourStartEndPointEdit tour={tour} open={isStartEndPointEditOpen} setOpen={setIsStartEndPointEditOpen} />
        </>
    )
}

export default TourStartEndPoint