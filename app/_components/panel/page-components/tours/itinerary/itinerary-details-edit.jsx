import React, { useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/app/_components/ui/sheet"
import { Button } from '@/app/_components/ui/button'
import axios from "axios";
import Message from '@/app/_components/ui/message';
import { Loader2 } from 'lucide-react';
import { Input } from "@/app/_components/ui/input";
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/app/_components/ui/textarea';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    title: z.string().optional(),
    desc: z.string().optional(),
});
const TourItineraryDetailsEdit = ({ open, setOpen, tour }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: tour.itinerary?.title || '',
            desc: tour.itinerary?.desc || '',
        }
    });
    // Tour itinerary details update function
    const { mutate: updateItineraryDetails, isPending: isUpdateItineraryDetailsPending, isSuccess: isUpdateItineraryDetailsSuccess, error: updateItineraryDetailsError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/tours/${tour._id}/itinerary`, { action: 'updateStartEndPoint', ...formData })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tours', tour._id],
            })
        },
    })
    // Update default values on change in tour details
    useEffect(() => {
        if (tour) {
            const updateValues = {
                title: tour.itinerary?.title || '',
                desc: tour.itinerary?.desc || '',
            }
            Object.entries(updateValues).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [tour, form])
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className='overflow-auto'>
                <SheetHeader>
                    <SheetTitle>Tour itinerary details</SheetTitle>
                    <SheetDescription>
                        Tour itinerary details contains title and description for the tour itinerary section.
                    </SheetDescription>
                    <Message variant={updateItineraryDetailsError?.message ? 'destructive' : 'default'} message={updateItineraryDetailsError?.message || isUpdateItineraryDetailsSuccess && `Itinerary details has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateItineraryDetails)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="What To Expect" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="desc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Write here..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isUpdateItineraryDetailsPending} className='w-full'>
                                {isUpdateItineraryDetailsPending ?
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

export default TourItineraryDetailsEdit