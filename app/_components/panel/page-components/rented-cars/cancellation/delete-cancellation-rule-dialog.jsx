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

const DeleteCancellationRuleDialog = ({ open, setOpen, rentedCar, cancellationRule, callback }) => {
    const queryClient = useQueryClient()
    const router = useRouter();
    const { toast } = useToast()
    // Cancellation rule delete
    const { mutate: deleteCancellationRule, isPending: isDeleteCancellationRulePending, isSuccess: isDeleteCancellationRuleSuccess, error: deleteCancellationRuleError } = useMutation({
        mutationFn: async () => {
            try {
                const { data } = await axios.delete(`/api/panel/rented-cars/${rentedCar._id}/cancellation-rules/${cancellationRule._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            toast({ description: `${cancellationRule.title} has been deleted successfully.` })
            queryClient.invalidateQueries({
                queryKey: ['rented-cars', rentedCar._id]
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
                        This action cannot be undone. This will permanently delete <span className='text-foreground'>{cancellationRule.title}</span>.
                    </AlertDialogDescription>
                    <Message variant={deleteCancellationRuleError?.message ? 'destructive' : 'default'} message={deleteCancellationRuleError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteCancellationRule(cancellationRule)} disabled={isDeleteCancellationRulePending}>
                        {isDeleteCancellationRulePending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete cancellation rule'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCancellationRuleDialog