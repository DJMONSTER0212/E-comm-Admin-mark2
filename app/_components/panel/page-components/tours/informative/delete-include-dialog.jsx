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

const DeleteIncludeDialog = ({ open, setOpen, tour, include, callback }) => {
    const queryClient = useQueryClient()
    const router = useRouter();
    const { toast } = useToast()
    // Include item delete
    const { mutate: deleteInclude, isPending: isDeleteIncludePending, isSuccess: isDeleteIncludeSuccess, error: deleteIncludeError } = useMutation({
        mutationFn: async (include) => {
            try {
                const { data } = await axios.delete(`/api/panel/tours/${tour._id}/includes/${include._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            toast({ description: `${include.title} has been deleted successfully.` })
            queryClient.invalidateQueries({
                queryKey: ['tours', tour._id]
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
                        This action cannot be undone. This will permanently delete <span className='text-foreground'>{include.title}</span>.
                    </AlertDialogDescription>
                    <Message variant={deleteIncludeError?.message ? 'destructive' : 'default'} message={deleteIncludeError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteInclude(include)} disabled={isDeleteIncludePending}>
                        {isDeleteIncludePending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete include item'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteIncludeDialog