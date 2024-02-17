'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/app/_components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form";
import { Input } from '@/app/_components/ui/input';
import { useForm } from "react-hook-form";
import Message from '@/app/_components/ui/message';
import { Loader2 } from "lucide-react"
import { Textarea } from '@/app/_components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import { leadContactServices } from '@/app/_conf/constants/constant';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// ZOD Schema
const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is not valid' }),
    phone: z.coerce.number().min(1, { message: 'Phone number is required' }).min(1, { message: 'Phone number is is not valid' }).max(10, { message: 'Phone number is not valid' }),
    service: z.enum(leadContactServices.map((service) => service.value), { required_error: 'Service is required' }),
    message: z.string().optional(),
})
const ContactUsForm = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            message: '',
        }
    });
    // Add contact lead function
    const { mutate: addContactLead, isPending: isAddContactLeadPending, isSuccess: isAddContactLeadSuccess, error: addContactLeadError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const bodyFormData = new FormData()
                for (var key in formData) {
                    bodyFormData.append(key, formData[key]);
                }
                const { data } = await axios.post(`/api/panel/users/`, bodyFormData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            })
            form.reset()
        },
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(addContactLead)} className="space-y-3">
                <Message className='mt-3' variant={addContactLeadError?.message ? 'destructive' : 'default'} message={addContactLeadError?.message || isAddContactLeadSuccess && `Message has been sent successfully. We will connect to you shortly.`} />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input type='number' placeholder="0123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a service" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {leadContactServices.map((service) => (
                                        <SelectItem key={service.value} value={service.value}>
                                            {service.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message <span className='text-xs text-muted-foreground'>optional</span></FormLabel>
                            <FormControl>
                                <Textarea placeholder="write your message here..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className='w-full' disabled={isAddContactLeadPending}>
                    {isAddContactLeadPending ?
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                        : 'Send message'
                    }
                </Button>
            </form>
        </Form>
    )
}

export default ContactUsForm