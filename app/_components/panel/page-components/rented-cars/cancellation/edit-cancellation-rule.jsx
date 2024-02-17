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
import { Textarea } from '@/app/_components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';

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
    hoursBeforeStartingTime: z.coerce.number().min(1, { message: 'Hours before the pickup is required' }),
    rule: z.string().min(1, { message: 'Rule is required' }),
});

const EditCancellationRule = ({ open, setOpen, rentedCar, cancellationRule, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            refundablePrice: cancellationRule.refundablePrice || '',
            hoursBeforeStartingTime: cancellationRule.hoursBeforeStartingTime || '',
            rule: cancellationRule.rule || '',
        }
    });
    // Rented car cancellation rule update function
    const { mutate: updateCancellationRule, isPending: isUpdateCancellationRulePending, isSuccess: isUpdateCancellationRuleSuccess, error: updateCancellationRuleError, reset: updateCancellationRuleReset } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/rented-cars/${rentedCar._id}/cancellation-rules/${cancellationRule._id}`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['rented-cars', rentedCar._id],
            });
        },
    })
    // Update default values on change in user details
    useEffect(() => {
        if (cancellationRule) {
            Object.entries(cancellationRule).forEach(([name, value]) => form.setValue(name, value));
            updateCancellationRuleReset();
        }
    }, [cancellationRule, updateCancellationRuleReset, form])
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Update cancellation rule</SheetTitle>
                    <SheetDescription>
                        Cancellation rules decides what amount of paid price should be refunded
                    </SheetDescription>
                    <Message variant={updateCancellationRuleError?.message ? 'destructive' : 'default'} message={updateCancellationRuleError?.message || isUpdateCancellationRuleSuccess && `Cancellation rule has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateCancellationRule)} className="space-y-3">
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
                                        <FormLabel>Hours before the pickup time</FormLabel>
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
                                            <Textarea rows={5} placeholder="60% price refund if cancelled before 6 hours of pickup time." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isUpdateCancellationRulePending}>
                                {isUpdateCancellationRulePending ?
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

export default EditCancellationRule