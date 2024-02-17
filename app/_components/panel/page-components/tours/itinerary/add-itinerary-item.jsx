import React from 'react'
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
    FormDescription,
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
import { Textarea } from '@/app/_components/ui/textarea';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    subTitle: z.string().optional(),
    shortDesc: z.string().optional(),
});

const AddItineraryItem = ({ open, setOpen, tour, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            subTitle: '',
            shortDesc: '',
        }
    });
    // Tour itinerary item add function
    const { mutate: addItineraryItem, isPending: isAddItineraryItemPending, isSuccess: isAddItineraryItemSuccess, error: addItineraryItemError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.post(`/api/panel/tours/${tour._id}/itinerary-items/`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tours', tour._id],
            })
            form.reset()
        },
    })
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Add itinerary item</SheetTitle>
                    <SheetDescription>
                        Itinerary contains information of steps or path which you will follow in in tour
                    </SheetDescription>
                    <Message variant={addItineraryItemError?.message ? 'destructive' : 'default'} message={addItineraryItemError?.message || isAddItineraryItemSuccess && `Itinerary item has been added successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(addItineraryItem)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Day 1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sub title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2 Days and 1 Night | Hawa mahal" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="shortDesc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short description</FormLabel>
                                        <FormControl>
                                            <Textarea rows={5} placeholder="write here..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isAddItineraryItemPending}>
                                {isAddItineraryItemPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : 'Add itinerary item'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default AddItineraryItem