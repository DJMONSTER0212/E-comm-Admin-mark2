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
import moment from 'moment';

const DeleteTourDateDialog = ({ open, setOpen, tour, tourDate, callback }) => {
    const queryClient = useQueryClient()
    const router = useRouter();
    const { toast } = useToast()
    // Tour date delete
    const { mutate: deleteTourDate, isPending: isDeleteTourDatePending, error: deleteTourDateError } = useMutation({
        mutationFn: async () => {
            try {
                const { data } = await axios.delete(`/api/panel/tours/${tour._id}/tour-dates/${tourDate._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            toast({ description: `${moment(tourDate.date).format('DD MMM YYYY')} has been deleted successfully.` })
            queryClient.invalidateQueries({
                queryKey: ['tour-dates', tour._id],
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
                        This action cannot be undone. This will permanently delete tour date of <span className='text-foreground'>{moment(tourDate.date).format('DD MMM YYYY')}</span> and all the booking for this date.
                    </AlertDialogDescription>
                    <Message variant={deleteTourDateError?.message ? 'destructive' : 'default'} message={deleteTourDateError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteTourDate(tourDate)} disabled={isDeleteTourDatePending}>
                        {isDeleteTourDatePending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete Tour date'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteTourDateDialog