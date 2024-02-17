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

const DeleteHomepageBannerDialog = ({ open, setOpen, homepageBanner, callback }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { toast } = useToast()
    // Homepage banner delete
    const { mutate: deleteHomepageBanner, isPending: isDeleteHomepageBannerPending, isSuccess: isDeleteHomepageBannerSuccess, error: deleteHomepageBannerError } = useMutation({
        mutationFn: async (homepageBanner) => {
            try {
                const { data } = await axios.delete(`/api/panel/homepage-banners/${homepageBanner._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['homepage-banners'],
            })
            toast({ description: `Banner has been deleted successfully.` })
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
                        This action cannot be undone. This will permanently delete banner.
                    </AlertDialogDescription>
                    <Message variant={deleteHomepageBannerError?.message ? 'destructive' : 'default'} message={deleteHomepageBannerError?.message} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='destructive' onClick={() => deleteHomepageBanner(homepageBanner)} disabled={isDeleteHomepageBannerPending}>
                        {isDeleteHomepageBannerPending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : 'Delete homepage banner'
                        }
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteHomepageBannerDialog