import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import { MoreVertical, Info } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import EditAdditionalInfo from './edit-additional-info';
import AddAdditionalInfo from './add-additional-info';
import DeleteAdditionalInfoDialog from './delete-additional-info-dialog';

const TourAdditionalInfo = ({ tour }) => {
    // Open state for edit, delete and selected additional info item
    const [isEditAdditionalInfoOpen, setIsEditAdditionalInfoOpen] = useState(false)
    const [isDeleteAdditionalInfoDialogOpen, setIsDeleteAdditionalInfoDialogOpen] = useState(false)
    const [selectedAdditionalInfo, setSelectedAdditionalInfo] = useState()
    return (
        <Card>
            <CardHeader>
                <Info className='w-10 h-10 text-yellow-500 border p-1.5 rounded-md mb-2' />
                <CardTitle size='lg' className='flex items-end gap-2 justify-between'>Additional info</CardTitle>
                <CardDescription>Write additional details like <span className='text-foreground font-medium'>{'"Confirmation will be received at time of booking"'}</span></CardDescription>
            </CardHeader>
            <CardContent>
                {tour.additionalInfo.length > 0 ? <div className={"grid grid-cols-1 items-start gap-3 mb-5"}>
                    {tour.additionalInfo.map((info, index) => (
                        <div key={info} className="flex justify-between gap-2 border-l border-s-2 border-foreground pl-2">
                            <p className='text-foreground text-base'>{info}</p>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        aria-label="Open menu"
                                        variant="outline"
                                        className="min-w-[2rem] flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                    >
                                        <MoreVertical className="h-4 w-4" aria-hidden="true" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-auto">
                                    <DropdownMenuItem onClick={() => { setSelectedAdditionalInfo({ info, index }); setIsEditAdditionalInfoOpen(true) }}>Edit</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                        onClick={() => { setSelectedAdditionalInfo({ info, index }); setIsDeleteAdditionalInfoDialogOpen(true) }}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div >
                    : <p className='mb-5 text-base text-muted-foreground'>No additional info found. Please add one.</p>
                }
                <AddAdditionalInfo tour={tour} />
                {selectedAdditionalInfo && <EditAdditionalInfo open={isEditAdditionalInfoOpen} setOpen={setIsEditAdditionalInfoOpen} tour={tour} additionalInfo={selectedAdditionalInfo} />}
                {selectedAdditionalInfo && <DeleteAdditionalInfoDialog open={isDeleteAdditionalInfoDialogOpen} setOpen={setIsDeleteAdditionalInfoDialogOpen} tour={tour} additionalInfo={selectedAdditionalInfo} />}
            </CardContent>
        </Card>
    )
}

export default TourAdditionalInfo