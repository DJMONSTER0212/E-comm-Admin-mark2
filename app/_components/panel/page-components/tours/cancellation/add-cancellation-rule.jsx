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
    refundablePrice: z.coerce.number()
        .min(1, { message: 'Refundable price is required' })
        .refine((value) => {
            const numericValue = parseFloat(value);
            return numericValue >= 0 && numericValue <= 100;
        }, {
            message: 'Refundable price must be between 0 and 100, inclusive',
        }),
    hoursBeforeStartingTime: z.coerce.number().min(1, { message: 'Hours before the tour start time is required' }).refine((value) => {
        const numericValue = parseFloat(value);
        return numericValue >= 0;
    }, {
        message: 'Hours before the tour start time must be greater than 0',
    }),
    rule: z.string().min(1, { message: 'Rule is required' }),
});

const AddCancellationRule = ({ open, setOpen, tour, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            refundablePrice: '',
            hoursBeforeStartingTime: '',
            rule: '',
        }
    });
    // Tour cancellation rule add function
    const { mutate: addCancellationRule, isPending: isAddCancellationRulePending, isSuccess: isAddCancellationRuleSuccess, error: addCancellationRuleError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.post(`/api/panel/tours/${tour._id}/cancellation-rules/`, formData)
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
                    <SheetTitle>Add cancellation rule</SheetTitle>
                    <SheetDescription>
                        Cancellation rules decides what amount of paid price should be refunded
                    </SheetDescription>
                    <Message variant={addCancellationRuleError?.message ? 'destructive' : 'default'} message={addCancellationRuleError?.message || isAddCancellationRuleSuccess && `Cancellation rule has been added successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(addCancellationRule)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="refundablePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Refundable price {"[In percentage. Ex: 10]"}</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hoursBeforeStartingTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hours before the tour start time</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="24" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rule"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rule</FormLabel>
                                        <FormControl>
                                            <Textarea rows={5} placeholder="60% price refund if cancelled before 6 hours of tour start time." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isAddCancellationRulePending}>
                                {isAddCancellationRulePending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : 'Add cancellation rule'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default AddCancellationRule