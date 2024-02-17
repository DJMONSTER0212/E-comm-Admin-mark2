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

const DeleteVisaLeadDialog = ({ open, setOpen, visaLead, callback }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast()
    // Visa lead delete
    const { mutate: deleteVisaLead, isPending: isDeleteVisaLeadPending, isSuccess: isDeleteVisaLeadSuccess, error: deleteVisaLeadError } = useMutation({
        mutationFn: async (visaLead) => {
            try {
                const { data } = await axios.delete(`/api/panel/visa-leads/${visaLead._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['visa-leads'],
            })
            toast({ description: `Visa lead has been deleted successfully.` })
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
                    <Message variant={deleteVisaLeadError?.message ? 'destructive' : 'default'} message={deleteVisaLeadError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteVisaLead(visaLead)} disabled={isDeleteVisaLeadPending}>
                        {isDeleteVisaLeadPending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete visa lead'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteVisaLeadDialog