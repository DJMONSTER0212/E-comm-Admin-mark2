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

const DeleteCountryDialog = ({ open, setOpen, country, callback }) => {
    const queryClient = useQueryClient()
    const router = useRouter();
    const { toast } = useToast()
    // Country delete
    const { mutate: deleteCountry, isPending: isDeleteCountryPending, isSuccess: isDeleteCountrySuccess, error: deleteCountryError } = useMutation({
        mutationFn: async (country) => {
            try {
                const { data } = await axios.delete(`/api/panel/countries/${country._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            toast({ description: `${country.name} has been deleted successfully.` })
            queryClient.invalidateQueries({
                queryKey: ['countries']
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
                        This action cannot be undone. This will permanently delete <span className='text-foreground'>{country.name + "'s"}</span> states, cities, tours
                        and remove all the {country.name} related data from the server.
                    </AlertDialogDescription>
                    <Message variant={deleteCountryError?.message ? 'destructive' : 'default'} message={deleteCountryError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteCountry(country)} disabled={isDeleteCountryPending}>
                        {isDeleteCountryPending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete country'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCountryDialog