import React, { useState } from 'react'
import { Trash } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import DeleteUserDialog from './delete-dialog'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"

const DeleteUser = ({ user, refetch }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    return (
        <>
            <Card className="bg-muted border rounded-md h-fit w-full">
                <CardHeader>
                    <Trash className='w-10 h-10 text-destructive bg-background p-1.5 rounded-md mb-2' />
                    <CardTitle size='lg'>Delete account</CardTitle>
                    <CardDescription>This will permanently delete <span className='text-foreground font-medium'>{user.name + "'s"}</span> account and remove all his/her data from the server.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant='destructive' onClick={() => { setIsDeleteDialogOpen(true) }} className='w-full' size='sm'>
                        Delete user
                    </Button>
                </CardContent>
            </Card>
            <DeleteUserDialog open={isDeleteDialogOpen} setOpen={setIsDeleteDialogOpen} user={user} refetch={refetch} callback='/panel/users' />
        </>
    )
}

export default DeleteUser