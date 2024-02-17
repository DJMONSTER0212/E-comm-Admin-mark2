import React, { useState } from 'react'
import { Trash } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import DeleteCountryDialog from './delete-dialog'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"

const DeleteCountry = ({ country, refetch }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    return (
        <div className='order-3'>
            <Card className="bg-muted border rounded-md h-fit w-full">
                <CardHeader>
                    <Trash className='w-10 h-10 text-destructive bg-background p-1.5 rounded-md mb-2' />
                    <CardTitle size='lg'>Delete country</CardTitle>
                    <CardDescription> This will permanently delete <span className='text-foreground'>{country.name + "'s"}</span> states, cities, tours
                        and remove all the {country.name} related data from the server.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant='destructive' onClick={() => { setIsDeleteDialogOpen(true) }} className='w-full' size='sm'>
                        Delete country
                    </Button>
                </CardContent>
            </Card>
            <DeleteCountryDialog open={isDeleteDialogOpen} setOpen={setIsDeleteDialogOpen} country={country} refetch={refetch} callback='/panel/locations' />
        </div>
    )
}

export default DeleteCountry