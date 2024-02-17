import React, { useState } from 'react'
import { Trash } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import DeleteTourDialog from './delete-dialog'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"

const DeleteTour = ({ tour, refetch }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    return (
        <>
            <Card className="bg-muted border rounded-md h-fit w-full">
                <CardHeader>
                    <Trash className='w-10 h-10 text-destructive bg-background p-1.5 rounded-md mb-2' />
                    <CardTitle size='lg'>Delete tour</CardTitle>
                    <CardDescription>This will permanently delete <span className='text-foreground'>{tour.name}</span> and all the related bookings, transactions and other data from the server.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant='destructive' onClick={() => { setIsDeleteDialogOpen(true) }} className='w-full' size='sm'>
                        Delete tour
                    </Button>
                </CardContent>
            </Card>
            <DeleteTourDialog open={isDeleteDialogOpen} setOpen={setIsDeleteDialogOpen} tour={tour} refetch={refetch} callback='/panel/tours' />
        </>
    )
}

export default DeleteTour