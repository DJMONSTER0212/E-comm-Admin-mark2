import React from 'react'
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
import { Loader2, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/app/_components/ui/use-toast';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    info: z.string().min(1, { message: 'Info is required' }),
});

const AddAdditionalInfo = ({ rentedCar }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            info: '',
        }
    });
    // Rented car additional info add function
    const { mutate: addAdditionalInfo, isPending: isAddAdditionalInfoPending } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.post(`/api/panel/rented-cars/${rentedCar._id}/additional-info/`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            toast({ description: `Additional info has been added successfully.` })
            queryClient.invalidateQueries({
                queryKey: ['rented-cars', rentedCar._id],
            })
            form.reset()
        },
        onError: (error) => {
            toast({ description: error.message, variant: 'destructive' })
        }
    })
    return (
        <div className="mt-5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(addAdditionalInfo)} className="space-y-0">
                    <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="info"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <Input placeholder="Please arrive on time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" size='icon' className='min-w-[2.5rem]' disabled={isAddAdditionalInfoPending}>
                            {isAddAdditionalInfoPending ?
                                <><Loader2 className="block h-4 w-4 animate-spin" /></>
                                : <Plus className='block w-5 h-5' />
                            }
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddAdditionalInfo