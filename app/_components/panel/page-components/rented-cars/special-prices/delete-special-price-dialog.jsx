import React from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog"
import { Button } from '@/app/_components/ui/button'
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Message from '@/app/_components/ui/message';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/app/_components/ui/use-toast';
import { useRouter } from 'next/navigation';

const DeleteRentedCarSpecialPriceDialog = ({ open, setOpen, rentedCar, rentedCarSpecialPrice, callback }) => {
    const queryClient = useQueryClient()
    const router = useRouter();
    const { toast } = useToast()
    // Rented car special price delete
    const { mutate: deleteRentedCarSpecialPrice, isPending: isDeleteRentedCarSpecialPricePending, error: deleteRentedCarSpecialPriceError } = useMutation({
        mutationFn: async () => {
            try {
                const { data } = await axios.delete(`/api/panel/rented-cars/${rentedCar._id}/special-prices/${rentedCarSpecialPrice._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            toast({ description: `${rentedCarSpecialPrice.name} has been deleted successfully.` })
            queryClient.invalidateQueries({
                queryKey: ['rented-car-special-prices', rentedCar._id],
            })
            if (callback) {
                router.push(callback)
            }
            setOpen(false);
        }
    })
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className='w-[95%]'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <span className='text-foreground'>{rentedCarSpecialPrice.name}</span> special price.
                    </AlertDialogDescription>
                    <Message variant={deleteRentedCarSpecialPriceError?.message ? 'destructive' : 'default'} message={deleteRentedCarSpecialPriceError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteRentedCarSpecialPrice(rentedCarSpecialPrice)} disabled={isDeleteRentedCarSpecialPricePending}>
                        {isDeleteRentedCarSpecialPricePending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete special price'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteRentedCarSpecialPriceDialog