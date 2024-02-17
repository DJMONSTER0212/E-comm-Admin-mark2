import React, { useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/app/_components/ui/button";
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
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/app/_components/ui/use-toast';

// ZOD Schema
const formSchema = z.object({
    'outgoing': z.string().email().or(z.literal('')),
    'incoming': z.string().email().or(z.literal('')),
});
const ContactMails = ({ mails }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'outgoing': mails?.outgoing || '',
            'incoming': mails?.incoming || '',
        }
    });
    // Mail addresses update function
    const { mutate: updateMails, isPending: isUpdateMailsPending } = useMutation({
        mutationFn: async (formData) => {
            const postData = {
                mailSetup: 'contact',
                mailAddresses: {
                    incoming: formData.incoming,
                    outgoing: formData.outgoing
                }
            }
            try {
                const { data } = await axios.put(`/api/panel/settings/smtp/mails`, postData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onError: (error) => {
            toast({ description: error.message, variant: 'destructive' });

        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['mails'],
            });
            toast({ description: 'Contact mail addresses updated successfully' })
        },
    })
    // Update default values on change in smtp details
    useEffect(() => {
        if (mails) {
            Object.entries(mails).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [mails, form])
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(updateMails)} className="space-y-3">
                <div className="flex gap-2 items-center">
                    <div className="h-3 w-0.5 bg-foreground rounded-full"></div>
                    <p className='text-sm text-foreground'>Contact mail addresses</p>
                </div>
                <FormField
                    control={form.control}
                    name="outgoing"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Outgoing mail</FormLabel>
                            <FormControl>
                                <Input placeholder="outgoing@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                This will be used to send mail to users and you.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="incoming"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Incoming mail</FormLabel>
                            <FormControl>
                                <Input placeholder="incoming@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is where the email will be sent for an enquiry.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className='w-full' disabled={isUpdateMailsPending}>
                    {isUpdateMailsPending ?
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                        : 'Update details'
                    }
                </Button>
            </form>
        </Form>
    )
}

export default ContactMails