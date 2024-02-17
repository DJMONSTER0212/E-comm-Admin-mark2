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

const DeleteRentedCarDialog = ({ open, setOpen, rentedCar, callback }) => {
    const queryClient = useQueryClient()
    const router = useRouter();
    const { toast } = useToast()
    // Rented car delete
    const { mutate: deleteRentedCar, isPending: isDeleteRentedCarPending, error: deleteRentedCarError } = useMutation({
        mutationFn: async (rentedCar) => {
            try {
                const { data } = await axios.delete(`/api/panel/rented-cars/${rentedCar._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            toast({ description: `${rentedCar.name} has been deleted successfully.` })
            queryClient.invalidateQueries({
                queryKey: ['rented-cars']
            })
            if (callback) {
                router.push(callback)
            }
            setOpen(false);
        },
        onError: (error) => {
        }
    })
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className='w-[95%]'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <span className='text-foreground'>{rentedCar.name}</span> and all the related bookings, transactions and other data from the server.
                    </AlertDialogDescription>
                    <Message variant={deleteRentedCarError?.message ? 'destructive' : 'default'} message={deleteRentedCarError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteRentedCar(rentedCar)} disabled={isDeleteRentedCarPending}>
                        {isDeleteRentedCarPending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete rented car'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteRentedCarDialog