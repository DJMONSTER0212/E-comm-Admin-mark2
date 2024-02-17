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
import { Switch } from '@/app/_components/ui/switch'
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import { Check } from 'lucide-react';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    isIncluded: z.boolean().optional(),
});

const EditInclude = ({ open, setOpen, tour, include, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: include.title || '',
            isIncluded: include.isIncluded || false,
        }
    });
    // Tour include item update function
    const { mutate: updateInclude, isPending: isUpdateIncludePending, isSuccess: isUpdateIncludeSuccess, error: updateIncludeError, reset: updateIncludeReset } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/tours/${tour._id}/includes/${include._id}`, formData)
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
        if (include) {
            Object.entries(include).forEach(([name, value]) => form.setValue(name, value));
            updateIncludeReset();
        }
    }, [include, updateIncludeReset, form])
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Update include item</SheetTitle>
                    <SheetDescription>
                        Include contains information of what is and what is not included in tour
                    </SheetDescription>
                    <Message variant={updateIncludeError?.message ? 'destructive' : 'default'} message={updateIncludeError?.message || isUpdateIncludeSuccess && `Include item has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateInclude)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Transport cost" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='isIncluded'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Include
                                            </FormLabel>
                                            <FormDescription className='flex items-center'>
                                                Including it will show a <Check className="w-4 h-4 min-w-[1rem] mx-1" /> sign.
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
                            <Button type="submit" className='w-full' disabled={isUpdateIncludePending}>
                                {isUpdateIncludePending ?
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

export default EditInclude