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
import { Loader2, Search } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import { Textarea } from '@/app/_components/ui/textarea';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    'title': z.string().max(60, { message: 'Meta title should only have max 60 characters.' }),
    'shortDesc': z.string().max(160, { message: 'Meta short desc should only have max 160 characters.' }),
})

const RentedCarSeo = ({ rentedCar }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'title': rentedCar.seo?.title || '',
            'shortDesc': rentedCar.seo?.shortDesc || '',
        }
    });

    // Rented car details update function
    const { mutate: updateRentedCar, isPending: isUpdateRentedCarPending, isSuccess: isUpdateRentedCarSuccess, error: updateRentedCarError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.patch(`/api/panel/rented-cars/${rentedCar._id}`, { action: 'updateSeo', ...formData })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        }
    })
    return (
        <Card>
            <CardHeader>
                <Search className='w-10 h-10 text-green-500 border p-1.5 rounded-md mb-2' />
                <CardTitle size='lg'>SEO details</CardTitle>
                <CardDescription>These information will be visible as title and description for this rented car on search engines.</CardDescription>
                <Message className='mb-4' variant={updateRentedCarError?.message ? 'destructive' : 'default'} message={updateRentedCarError?.message || isUpdateRentedCarSuccess && `Rented car SEO details has been updated successfully.`} />
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateRentedCar)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta title</FormLabel>
                                    <FormControl>
                                        <Input type='text' maxLength='60' placeholder="Best rented car in jaipur..." {...field} />
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
                                    <FormLabel>Meta short desc</FormLabel>
                                    <FormControl>
                                        <Textarea maxLength='160' placeholder="Write here..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant="outline" type="submit" className='w-full' disabled={isUpdateRentedCarPending}>
                            {isUpdateRentedCarPending ?
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                : 'Update details'
                            }
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default RentedCarSeo