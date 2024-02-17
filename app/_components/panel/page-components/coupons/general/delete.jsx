import React, { useState } from 'react'
import { Trash } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import DeleteCouponDialog from './delete-dialog'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"

const DeleteCoupon = ({ coupon, refetch }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    return (
        <>
            <Card className="bg-muted border rounded-md h-fit w-full">
                <CardHeader>
                    <Trash className='w-10 h-10 text-destructive bg-background p-1.5 rounded-md mb-2' />
                    <CardTitle size='lg'>Delete coupon</CardTitle>
                    <CardDescription>This will permanently delete coupon with code <span className='text-foreground font-medium uppercase'>{coupon.coupon}</span> and remove all related data from the server.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant='destructive' onClick={() => { setIsDeleteDialogOpen(true) }} className='w-full' size='sm'>
                        Delete coupon
                    </Button>
                </CardContent>
            </Card>
            <DeleteCouponDialog open={isDeleteDialogOpen} setOpen={setIsDeleteDialogOpen} coupon={coupon} refetch={refetch} callback='/panel/coupons' />
        </>
    )
}

export default DeleteCoupon