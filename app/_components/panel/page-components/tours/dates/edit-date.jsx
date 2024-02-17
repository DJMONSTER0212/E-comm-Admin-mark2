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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/_components/ui/popover"
import { Calendar } from "@/app/_components/ui/calendar"
import { cn } from "@/app/_lib/utils";
import { format } from "date-fns"
import { Switch } from '@/app/_components/ui/switch';
import { Separator } from '@/app/_components/ui/separator'
import MultiTimeInput from '@/app/_components/ui/multi-time-input';
import { CalendarDays, Loader2 } from 'lucide-react';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    times: z.any().array().min(1, { message: 'At least one time slot is required' }),
    date: z.date({ required_error: "Tour date is required." }),
    sharedIsActive: z.boolean().optional(),
    sharedPrice: z.coerce.number().optional(),
    sharedMaxPerson: z.coerce.number().optional(),
    privateIsActive: z.boolean().optional(),
    privatePrice: z.coerce.number().optional(),
    privateMinPerson: z.coerce.number().optional(),
    privateMaxPerson: z.coerce.number().optional(),
}).superRefine((formValues, ctx) => {
    if (formValues.sharedIsActive === true) {
        if (!formValues.sharedPrice || !(Number(formValues.sharedPrice) > 0)) {
            ctx.addIssue({
                code: "custom",
                message: "Shared tour price is required and must be greater than 0",
                path: ['sharedPrice']
            });
        }
        if (!formValues.sharedMaxPerson || !(Number(formValues.sharedMaxPerson) > 0)) {
            ctx.addIssue({
                code: "custom",
                message: "Number of max persons for shared tour is required and must be greater than 0",
                path: ['sharedMaxPerson']
            });
        }
    }
    if (formValues.privateIsActive === true) {
        if (!formValues.privatePrice || !(Number(formValues.privatePrice) > 0)) {
            ctx.addIssue({
                code: "custom",
                message: "Private tour price is required and must be greater than 0",
                path: ['privatePrice']
            });
        }
        if (!formValues.privateMinPerson || !(Number(formValues.privateMinPerson) > 0)) {
            ctx.addIssue({
                code: "custom",
                message: "Number of min persons for private tour is required and must be greater than 0",
                path: ['privateMinPerson']
            });
        }
        if (!formValues.privateMaxPerson || !(Number(formValues.privateMaxPerson) > 0)) {
            ctx.addIssue({
                code: "custom",
                message: "Number of max persons for private tour is required and must be greater than 0",
                path: ['privateMaxPerson']
            });
        } else if (Number(formValues.privateMaxPerson) <= Number(formValues.privateMinPerson)) {
            ctx.addIssue({
                code: "custom",
                message: "Number of max persons must be greater than number of min persons for private tour",
                path: ['privateMaxPerson']
            });
        }
    }
});

const EditTourdate = ({ open, setOpen, tour, tourDate, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date(tourDate.date),
            times: tourDate.times || [],
            sharedIsActive: tourDate.sharedTour?.isActive || false,
            sharedPrice: tourDate.sharedTour?.price,
            sharedMaxPerson: tourDate.sharedTour?.maxPerson,
            privateIsActive: tourDate.privateTour?.isActive || false,
            privatePrice: tourDate.privateTour?.price,
            privateMinPerson: tourDate.privateTour?.minPerson,
            privateMaxPerson: tourDate.privateTour?.maxPerson,
        }
    });
    // Tour tour date update function
    const { mutate: updateTourdate, isPending: isUpdateTourdatePending, isSuccess: isUpdateTourdateSuccess, error: updateTourdateError, reset: updateTourdateReset } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/tours/${tour._id}/tour-dates/${tourDate._id}`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tour-dates', tour._id],
            });
        },
    })
    // Update default values on change in tour date details
    useEffect(() => {
        if (tourDate) {
            const updateFields = {
                date: new Date(tourDate.date),
                times: tourDate.times || [],
                sharedIsActive: tourDate.sharedTour?.isActive || false,
                sharedPrice: tourDate.sharedTour?.price,
                sharedMaxPerson: tourDate.sharedTour?.maxPerson,
                privateIsActive: tourDate.privateTour?.isActive || false,
                privatePrice: tourDate.privateTour?.price,
                privateMinPerson: tourDate.privateTour?.minPerson,
                privateMaxPerson: tourDate.privateTour?.maxPerson,
            }
            Object.entries(updateFields).forEach(([name, value]) => form.setValue(name, value));
            updateTourdateReset();
        }
    }, [tourDate, updateTourdateReset, form])
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Update tour date</SheetTitle>
                    <SheetDescription>
                        Tour dates are the dates on which bookings for this tour are available.
                    </SheetDescription>
                    <Message variant={updateTourdateError?.message ? 'destructive' : 'default'} message={updateTourdateError?.message || isUpdateTourdateSuccess && `Tour date has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateTourdate)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Tour date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        <FormDescription>
                                            This date will be available for booking on tour page.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="times"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tour time slots</FormLabel>
                                        <FormControl>
                                            <MultiTimeInput onChange={field.onChange} value={field.value} disabledTimes={field.value} />
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription>
                                            These are the time slots on which tour is available.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center whitespace-nowrap gap-2 overflow-hidden text-muted-foreground text-sm'>Shared tour <Separator /></div>
                            <FormField
                                control={form.control}
                                name='sharedIsActive'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Activate shared tour
                                            </FormLabel>
                                            <FormDescription>
                                                Activate and set details for shared tour.
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sharedPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Per person price</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sharedMaxPerson"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of max. persons</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="12" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center whitespace-nowrap gap-2 overflow-hidden text-muted-foreground text-sm'>Private tour <Separator /></div>
                            <FormField
                                control={form.control}
                                name='privateIsActive'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Activate private tour
                                            </FormLabel>
                                            <FormDescription>
                                                Activate and set details for private tour.
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="privatePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Per person price</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="privateMinPerson"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of min. persons</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="privateMaxPerson"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of max. persons</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="12" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isUpdateTourdatePending}>
                                {isUpdateTourdatePending ?
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

export default EditTourdate