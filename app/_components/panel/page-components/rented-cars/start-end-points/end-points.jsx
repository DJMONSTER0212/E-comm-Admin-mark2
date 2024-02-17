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
import { PlusCircle, MoreVertical, MapPinned } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import AddEndPoint from './add-end-point';
import EditEndPoint from './edit-end-point';
import DeleteEndPointDialog from './delete-end-point-dialog';

const EndPoints = ({ rentedCar }) => {
    // Open state for add, edit, delete and selected end point
    const [isAddEndPointOpen, setIsAddEndPointOpen] = useState(false)
    const [isEditEndPointOpen, setIsEditEndPointOpen] = useState(false)
    const [isDeleteEndPointDialogOpen, setIsDeleteEndPointDialogOpen] = useState(false)
    const [selectedEndPoint, setSelectedEndPoint] = useState()

    return (
        <>
            <Card>
                <CardHeader>
                    <MapPinned className='w-10 h-10 text-orange-500 border p-1.5 rounded-md mb-2' />
                    <CardTitle size='lg' className='flex items-end gap-2 justify-between'>End (Drop) points</CardTitle>
                    <CardDescription>Start-end points are the locations of rented car{"'"}s starting and ending points (Pickup and Drop points).</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2 justify-start">
                        {rentedCar.endPoints?.length > 0 ? rentedCar.endPoints.map((endPoint, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <MapPinned className="w-4 h-4 text-primary" />
                                {endPoint.mapsLink ?
                                    <Link href={endPoint.mapsLink} className="capitalize flex-1">{endPoint.address}</Link>
                                    : <p className="capitalize flex-1">{endPoint.address}</p>
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
                                            <DropdownMenuItem onClick={() => { setSelectedEndPoint(endPoint); setIsEditEndPointOpen(true) }}>Edit</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                                onClick={() => { setSelectedEndPoint(endPoint); setIsDeleteEndPointDialogOpen(true) }}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                            : <p className='mb-5 text-base text-muted-foreground'>No end point found. Please add one.</p>
                        }
                        <Button onClick={() => setIsAddEndPointOpen(true)} variant='default' className='w-full'><PlusCircle className="w-5 h-5 mr-2" />Add new</Button>
                    </div>
                </CardContent>
            </Card>
            <AddEndPoint open={isAddEndPointOpen} setOpen={setIsAddEndPointOpen} rentedCar={rentedCar} />
            {selectedEndPoint && <EditEndPoint open={isEditEndPointOpen} setOpen={setIsEditEndPointOpen} rentedCar={rentedCar} endPoint={selectedEndPoint} />}
            {selectedEndPoint && <DeleteEndPointDialog open={isDeleteEndPointDialogOpen} setOpen={setIsDeleteEndPointDialogOpen} rentedCar={rentedCar} endPoint={selectedEndPoint} />}
        </>
    )
}

export default EndPoints