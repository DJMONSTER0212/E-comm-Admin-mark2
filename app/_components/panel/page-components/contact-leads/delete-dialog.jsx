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

const DeleteContactLeadDialog = ({ open, setOpen, contactLead, callback }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast()
    // Contact lead delete
    const { mutate: deleteContactLead, isPending: isDeleteContactLeadPending, isSuccess: isDeleteContactLeadSuccess, error: deleteContactLeadError } = useMutation({
        mutationFn: async (contactLead) => {
            try {
                const { data } = await axios.delete(`/api/panel/contact-leads/${contactLead._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['contact-leads'],
            })
            toast({ description: `Contact lead has been deleted successfully.` })
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
                    <Message variant={deleteContactLeadError?.message ? 'destructive' : 'default'} message={deleteContactLeadError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteContactLead(contactLead)} disabled={isDeleteContactLeadPending}>
                        {isDeleteContactLeadPending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete contact lead'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteContactLeadDialog