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
import { CalendarDays, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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
import moment from 'moment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"

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

const AddTourDate = ({ open, setOpen, tour, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            times: [],
            sharedIsActive: false,
            sharedPrice: '',
            sharedMaxPerson: '',
            privateIsActive: false,
            privatePrice: '',
            privateMinPerson: '',
            privateMaxPerson: '',
        }
    });
    // Tour tour date add function
    const { mutate: addTourDate, isPending: isAddTourDatePending, isSuccess: isAddTourDateSuccess, error: addTourDateError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.post(`/api/panel/tours/${tour._id}/tour-dates/`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tour-dates', tour._id],
            })
            form.reset()
        },
    })
    // Fetch last 5 tour dates
    const { data, isSuccess } = useQuery({
        queryKey: ['tour-dates', tour._id],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/tours/${tour._id}/tour-dates?page=1&per_page=5`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
    })
    // Load date data
    const loadDateData = (data) => {
        if (data) {
            const updateFields = {
                times: data.times || [],
                sharedIsActive: data.sharedTour?.isActive || false,
                sharedPrice: data.sharedTour?.price,
                sharedMaxPerson: data.sharedTour?.maxPerson,
                privateIsActive: data.privateTour?.isActive || false,
                privatePrice: data.privateTour?.price,
                privateMinPerson: data.privateTour?.minPerson,
                privateMaxPerson: data.privateTour?.maxPerson,
            }
            Object.entries(updateFields).forEach(([name, value]) => form.setValue(name, value));
        }
    }
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Add tour date</SheetTitle>
                    <SheetDescription>
                        Tour dates are the dates on which bookings for this tour are available.
                    </SheetDescription>
                    <Message variant={addTourDateError?.message ? 'destructive' : 'default'} message={addTourDateError?.message || isAddTourDateSuccess && `Tour date has been added successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(addTourDate)} className="space-y-3">
                            {isSuccess && data?.tourDates.length > 0 &&
                                <Tabs defaultValue="manual" className="w-full mt-5">
                                    <TabsList className='flex w-fit'>
                                        <TabsTrigger value="manual">Fill manually</TabsTrigger>
                                        <TabsTrigger value="autoLoad">Load from past date</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="autoLoad">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm text-foreground font-medium">Choose a date to load data from</p>
                                            <div className='flex gap-2 overflow-auto'>
                                                {data.tourDates.map((tourDate, index) => (
                                                    <Button type='button' onClick={() => { loadDateData(tourDate) }} variant='outline' key={index} className="flex flex-col justify-center items-center p-2 h-auto">
                                                        <p className="text-2xl font-semibold">{moment(tourDate.date).format('DD')}</p>
                                                        <p className="text-sm uppercase">{moment(tourDate.date).format('MMM')}</p>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            }
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
                                                            "w-full pl-3 text-left font-normal shadow-none",
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
                            <Button type="submit" className='w-full' disabled={isAddTourDatePending}>
                                {isAddTourDatePending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : 'Add tour date'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default AddTourDate