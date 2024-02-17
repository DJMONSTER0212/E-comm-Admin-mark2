import React, { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import { PlusCircle, MoreVertical, MapPin } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import AddStartPoint from './add-start-point';
import EditStartPoint from './edit-start-point';
import DeleteStartPointDialog from './delete-start-point-dialog';

const StartPoints = ({ rentedCar }) => {
    // Open state for add, edit, delete and selected start point
    const [isAddStartPointOpen, setIsAddStartPointOpen] = useState(false)
    const [isEditStartPointOpen, setIsEditStartPointOpen] = useState(false)
    const [isDeleteStartPointDialogOpen, setIsDeleteStartPointDialogOpen] = useState(false)
    const [selectedStartPoint, setSelectedStartPoint] = useState()

    return (
        <>
            <Card>
                <CardHeader>
                    <MapPin className='w-10 h-10 text-violet-500 border p-1.5 rounded-md mb-2' />
                    <CardTitle size='lg' className='flex items-end gap-2 justify-between'>Start (Pickup) points</CardTitle>
                    <CardDescription>Start-end points are the locations of rented car{"'"}s starting and ending points (Pickup and Drop points).</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2 justify-start">
                        {rentedCar.startPoints?.length > 0 ? rentedCar.startPoints.map((startPoint, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                {startPoint.mapsLink ?
                                    <Link href={startPoint.mapsLink} className="capitalize flex-1">{startPoint.address}</Link>
                                    : <p className="capitalize flex-1">{startPoint.address}</p>
                                }
                                <div className="flex gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-label="Open menu"
                                                variant="outline"
                                                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                            >
                                                <MoreVertical className="h-4 w-4" aria-hidden="true" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-auto">
                                            <DropdownMenuItem onClick={() => { setSelectedStartPoint(startPoint); setIsEditStartPointOpen(true) }}>Edit</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                                onClick={() => { setSelectedStartPoint(startPoint); setIsDeleteStartPointDialogOpen(true) }}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                            : <p className='mb-5 text-base text-muted-foreground'>No start point found. Please add one.</p>
                        }
                        <Button onClick={() => setIsAddStartPointOpen(true)} variant='default' className='w-full'><PlusCircle className="w-5 h-5 mr-2" />Add new</Button>
                    </div>
                </CardContent>
            </Card>
            <AddStartPoint open={isAddStartPointOpen} setOpen={setIsAddStartPointOpen} rentedCar={rentedCar} />
            {selectedStartPoint && <EditStartPoint open={isEditStartPointOpen} setOpen={setIsEditStartPointOpen} rentedCar={rentedCar} startPoint={selectedStartPoint} />}
            {selectedStartPoint && <DeleteStartPointDialog open={isDeleteStartPointDialogOpen} setOpen={setIsDeleteStartPointDialogOpen} rentedCar={rentedCar} startPoint={selectedStartPoint} />}
        </>
    )
}

export default StartPoints