import React, { useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/app/_components/ui/sheet"
import { Button } from '@/app/_components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    info: z.string().min(1, { message: 'Info is required' }),
});

const EditAdditionalInfo = ({ open, setOpen, tour, additionalInfo, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            info: additionalInfo.info || '',
        }
    });
    // Tour additional info update function
    const { mutate: updateAdditionalInfo, isPending: isUpdateAdditionalInfoPending, isSuccess: isUpdateAdditionalInfoSuccess, error: updateAdditionalInfoError, reset: updateAdditionalInfoReset } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/tours/${tour._id}/additional-info/${additionalInfo.index}`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tours', tour._id],
            });
        },
    })
    // Update default values on change in user details
    useEffect(() => {
        if (additionalInfo) {
            form.setValue('info', additionalInfo.info || '');
            updateAdditionalInfoReset();
        }
    }, [additionalInfo, updateAdditionalInfoReset, form])
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Update additional info</SheetTitle>
                    <SheetDescription>
                        Additiona info contains some more information about tour
                    </SheetDescription>
                    <Message variant={updateAdditionalInfoError?.message ? 'destructive' : 'default'} message={updateAdditionalInfoError?.message || isUpdateAdditionalInfoSuccess && `Additional info has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateAdditionalInfo)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="info"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Information</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Please arrive on time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isUpdateAdditionalInfoPending}>
                                {isUpdateAdditionalInfoPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : 'Update details'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default EditAdditionalInfo