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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/app/_components/ui/separator'
import { Textarea } from '@/app/_components/ui/textarea';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    startAddress: z.string().optional(),
    startMapsLink: z.string().optional(),
    startShortDesc: z.string().optional(),
    endAddress: z.string().optional(),
    endMapsLink: z.string().optional(),
    endShortDesc: z.string().optional(),
});
const TourStartEndPointEdit = ({ open, setOpen, tour }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startAddress: tour.startPoint?.address || '',
            startMapsLink: tour.startPoint?.mapsLink || '',
            startShortDesc: tour.startPoint?.shortDesc || '',
            endAddress: tour.endPoint?.address || '',
            endMapsLink: tour.endPoint?.mapsLink || '',
            endShortDesc: tour.endPoint?.shortDesc || '',
        }
    });
    // Tour start-end point details update function
    const { mutate: updateTour, isPending: isUpdateTourPending, isSuccess: isUpdateTourSuccess, error: updateTourError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.patch(`/api/panel/tours/${tour._id}`, { action: 'updateStartEndPoint', ...formData })
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
                startAddress: tour.startPoint?.address || '',
                startMapsLink: tour.startPoint?.mapsLink || '',
                startShortDesc: tour.startPoint?.shortDesc || '',
                endAddress: tour.endPoint?.address || '',
                endMapsLink: tour.endPoint?.mapsLink || '',
                endShortDesc: tour.endPoint?.shortDesc || '',
            }
            Object.entries(updateValues).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [tour, form])
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className='overflow-auto'>
                <SheetHeader>
                    <SheetTitle>Start-End Points</SheetTitle>
                    <SheetDescription>
                        Start-end points are the locatiom of <span className='text-foreground font-medium'>{tour.name}</span> tour{"'"}s starting and ending points.
                    </SheetDescription>
                    <Message variant={updateTourError?.message ? 'destructive' : 'default'} message={updateTourError?.message || isUpdateTourSuccess && `Start-End points has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateTour)} className="space-y-3">
                            <div className='flex items-center whitespace-nowrap gap-2 overflow-hidden text-muted-foreground text-sm'>Start point <Separator /></div>
                            <FormField
                                control={form.control}
                                name="startAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Hawa mahal, Jaipur" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="startMapsLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Google maps link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://maps.google.com/...." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="startShortDesc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Write here..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center whitespace-nowrap gap-2 overflow-hidden text-muted-foreground text-sm'>End point <Separator /></div>
                            <FormField
                                control={form.control}
                                name="endAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Hawa mahal, Jaipur" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endMapsLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Google maps link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://maps.google.com/...." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endShortDesc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Write here..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isUpdateTourPending} className='w-full'>
                                {isUpdateTourPending ?
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

export default TourStartEndPointEdit