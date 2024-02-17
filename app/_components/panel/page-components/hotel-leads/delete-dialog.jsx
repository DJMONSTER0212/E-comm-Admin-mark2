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

const DeleteHotelLeadDialog = ({ open, setOpen, hotelLead, callback }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast()
    // Hotel lead delete
    const { mutate: deleteHotelLead, isPending: isDeleteHotelLeadPending, isSuccess: isDeleteHotelLeadSuccess, error: deleteHotelLeadError } = useMutation({
        mutationFn: async (hotelLead) => {
            try {
                const { data } = await axios.delete(`/api/panel/hotel-leads/${hotelLead._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['hotel-leads'],
            })
            toast({ description: `Hotel lead has been deleted successfully.` })
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
                        This action cannot be undone. This will permanently delete the lead.
                    </AlertDialogDescription>
                    <Message variant={deleteHotelLeadError?.message ? 'destructive' : 'default'} message={deleteHotelLeadError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteHotelLead(hotelLead)} disabled={isDeleteHotelLeadPending}>
                        {isDeleteHotelLeadPending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete hotel lead'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteHotelLeadDialog