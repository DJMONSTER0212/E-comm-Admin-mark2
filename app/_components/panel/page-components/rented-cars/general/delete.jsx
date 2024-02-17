import React, { useState } from 'react'
import { Trash } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import DeleteRentedCarDialog from './delete-dialog'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"

const DeleteRentedCar = ({ rentedCar, refetch }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    return (
        <>
            <Card className="bg-muted border rounded-md h-fit w-full">
                <CardHeader>
                    <Trash className='w-10 h-10 text-destructive bg-background p-1.5 rounded-md mb-2' />
                    <CardTitle size='lg'>Delete rented car</CardTitle>
                    <CardDescription>This will permanently delete <span className='text-foreground'>{rentedCar.name}</span> and all the related bookings, transactions and other data from the server.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant='destructive' onClick={() => { setIsDeleteDialogOpen(true) }} className='w-full' size='sm'>
                        Delete rented car
                    </Button>
                </CardContent>
            </Card>
            <DeleteRentedCarDialog open={isDeleteDialogOpen} setOpen={setIsDeleteDialogOpen} rentedCar={rentedCar} refetch={refetch} callback='/panel/rented-cars' />
        </>
    )
}

export default DeleteRentedCar