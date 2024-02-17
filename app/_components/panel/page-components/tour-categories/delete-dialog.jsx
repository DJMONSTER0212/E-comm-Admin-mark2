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

const DeleteTourCategoryDialog = ({ open, setOpen, tourCategory, callback }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast()
    // Tour category delete
    const { mutate: deleteTourCategory, isPending: isDeleteTourCategoryPending, error: deleteTourCategoryError } = useMutation({
        mutationFn: async (category) => {
            try {
                const { data } = await axios.delete(`/api/panel/tour-categories/${tourCategory._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['tour-categories'],
            })
            toast({ description: `${tourCategory.name} has been deleted successfully.` })
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
                        This action cannot be undone. This will permanently delete <span className='text-foreground'>{tourCategory.name}</span> category
                        and remove all the tours and data of this category from the server.
                    </AlertDialogDescription>
                    <Message variant={deleteTourCategoryError?.message ? 'destructive' : 'default'} message={deleteTourCategoryError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteTourCategory(tourCategory)} disabled={isDeleteTourCategoryPending}>
                        {isDeleteTourCategoryPending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete tour category'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteTourCategoryDialog