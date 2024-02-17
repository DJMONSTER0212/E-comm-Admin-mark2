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

const DeleteCarCompanyDialog = ({ open, setOpen, carCompany, callback }) => {
    const queryClient = useQueryClient()
    const router = useRouter();
    const { toast } = useToast()
    // Car company delete
    const { mutate: deleteCarCompany, isPending: isDeleteCarCompanyPending, isSuccess: isDeleteCarCompanySuccess, error: deleteCarCompanyError } = useMutation({
        mutationFn: async (carCompany) => {
            try {
                const { data } = await axios.delete(`/api/panel/car-companies/${carCompany._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            toast({ description: `${carCompany.name} has been deleted successfully.` })
            queryClient.invalidateQueries({
                queryKey: ['car-companies']
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
                        This action cannot be undone. This will permanently delete <span className='text-foreground'>{carCompany.name + "'s"}</span> states, cities, tours
                        and remove all the {carCompany.name} related data from the server.
                    </AlertDialogDescription>
                    <Message variant={deleteCarCompanyError?.message ? 'destructive' : 'default'} message={deleteCarCompanyError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteCarCompany(carCompany)} disabled={isDeleteCarCompanyPending}>
                        {isDeleteCarCompanyPending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete car company'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCarCompanyDialog