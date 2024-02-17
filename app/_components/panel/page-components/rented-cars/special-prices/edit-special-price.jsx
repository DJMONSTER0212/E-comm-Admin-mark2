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
import { useForm, useWatch } from 'react-hook-form';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import { CalendarDays, Loader2 } from 'lucide-react';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    price: z.coerce.number().min(1, { message: 'Price is required' }),
    rangeType: z.enum(['date', 'day'], { required_error: 'Applied type is required' }),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    day: z.string().optional(),
}).superRefine((formValues, ctx) => {
    if (formValues.rangeType === 'date') {
        if (!formValues.startDate) {
            ctx.addIssue({
                code: "custom",
                message: "Start date is required",
                path: ['startDate']
            });
        }
        if (!formValues.endDate) {
            ctx.addIssue({
                code: "custom",
                message: "end date is required",
                path: ['endDate']
            });
        }
        if (formValues.startDate && formValues.endDate < formValues.startDate) {
            ctx.addIssue({
                code: "custom",
                message: "End date cannot be earlier than Start date",
                path: ['endDate']
            });
        }
    } else {
        if (!formValues.day) {
            ctx.addIssue({
                code: "custom",
                message: "Day is required",
                path: ['day']
            });
        }
    }
});

const EditRentedCarSpecialPrice = ({ open, setOpen, rentedCar, rentedCarSpecialPrice, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: rentedCarSpecialPrice.name || '',
            price: rentedCarSpecialPrice.price || '',
            rangeType: rentedCarSpecialPrice.rangeType || 'day',
            startDate: rentedCarSpecialPrice.date?.startDate ? new Date(rentedCarSpecialPrice.date?.startDate) : new Date(),
            endDate: rentedCarSpecialPrice.date?.endDate ? new Date(rentedCarSpecialPrice.date?.endDate) : new Date(),
            day: rentedCarSpecialPrice.day || '',
        }
    });
    const rangeType = useWatch({ control: form.control, name: 'rangeType' });
    // Tour tour date update function
    const { mutate: updateRentedCarSpecialPrice, isPending: isUpdateRentedCarSpecialPricePending, isSuccess: isUpdateRentedCarSpecialPriceSuccess, error: updateRentedCarSpecialPriceError, reset: updateRentedCarSpecialPriceReset } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/rented-cars/${rentedCar._id}/special-prices/${rentedCarSpecialPrice._id}`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['rented-car-special-prices', rentedCar._id],
            });
        },
    })
    // Update default values on change in tour date details
    useEffect(() => {
        if (rentedCarSpecialPrice) {
            const updateFields = {
                name: rentedCarSpecialPrice.name || '',
                price: rentedCarSpecialPrice.price || '',
                rangeType: rentedCarSpecialPrice.rangeType || 'day',
                startDate: rentedCarSpecialPrice.date?.startDate ? new Date(rentedCarSpecialPrice.date?.startDate) : new Date(),
                endDate: rentedCarSpecialPrice.date?.endDate ? new Date(rentedCarSpecialPrice.date?.endDate) : new Date(),
                day: rentedCarSpecialPrice.day || '',
            }
            Object.entries(updateFields).forEach(([name, value]) => form.setValue(name, value));
            updateRentedCarSpecialPriceReset();
        }
    }, [rentedCarSpecialPrice, updateRentedCarSpecialPriceReset, form])
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Update special price</SheetTitle>
                    <SheetDescription>
                        Special prices can be used to apply different prices to some specific days or dates.
                    </SheetDescription>
                    <Message variant={updateRentedCarSpecialPriceError?.message ? 'destructive' : 'default'} message={updateRentedCarSpecialPriceError?.message || isUpdateRentedCarSpecialPriceSuccess && `Special price has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateRentedCarSpecialPrice)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Weekend price" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="899" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rangeType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Applied on</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select applied type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='date'>On dates</SelectItem>
                                                <SelectItem value='day'>On day</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {rangeType == 'date' &&
                                <>
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start date</FormLabel>
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
                                                    This date will be the starting date with this price.
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>End date</FormLabel>
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
                                                    This date will be the last date with this price.
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            }
                            {rangeType == 'day' &&
                                <FormField
                                    control={form.control}
                                    name="day"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Day</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a day" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='sunday'>Sunday</SelectItem>
                                                    <SelectItem value='monday'>Monday</SelectItem>
                                                    <SelectItem value='tuesday'>Tuesday</SelectItem>
                                                    <SelectItem value='wednesday'>Wednesday</SelectItem>
                                                    <SelectItem value='thursday'>Thursday</SelectItem>
                                                    <SelectItem value='friday'>Friday</SelectItem>
                                                    <SelectItem value='saturday'>Saturday</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            }
                            <Button type="submit" className='w-full' disabled={isUpdateRentedCarSpecialPricePending}>
                                {isUpdateRentedCarSpecialPricePending ?
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

export default EditRentedCarSpecialPrice