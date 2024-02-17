import React, { useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
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
import SendTestMail from './send-test-mail';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    host: z.string().min(1, { message: 'Host is required' }),
    port: z.coerce.number().min(1, { message: 'Port number is required' }),
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
    secure: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

const EditSMTPDetails = ({ smtpDetails }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            host: smtpDetails?.host || '',
            port: smtpDetails?.port || 465,
            username: smtpDetails?.username || '',
            password: smtpDetails?.password || '',
            secure: smtpDetails?.secure || true,
            isActive: smtpDetails?.isActive || false
        }
    });
    // SMTP details update function
    const { mutate: updateSmtpDetails, isPending: isUpdateSmtpDetailsPending, isSuccess: isUpdateSmtpDetailsSuccess, error: updateSmtpDetailsError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.put(`/api/panel/settings/smtp/smtp-details`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['smtpDetails'],
            })
        },
    })
    // Update default values on change in smtp details
    useEffect(() => {
        if (smtpDetails) {
            Object.entries(smtpDetails).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [smtpDetails, form])
    return (
        <Sheet>
            <SheetTrigger className='w-full' asChild><Button variant='outline' className='w-full' size='sm'>{smtpDetails ? 'Edit SMTP details' : 'Setup SMTP service'}</Button></SheetTrigger>
            <SheetContent className='w-full h-screen overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>{smtpDetails ? 'Edit SMTP details' : 'Setup SMTP service'}</SheetTitle>
                    <SheetDescription>
                        SMTP details will be used during sending email for alerts, contact queries, customer mails, OTP mails, etc.
                    </SheetDescription>
                    <Message variant={updateSmtpDetailsError?.message ? 'destructive' : 'default'} message={updateSmtpDetailsError?.message || isUpdateSmtpDetailsSuccess && `SMTP details have been ${smtpDetails ? 'updated' : 'set upped'} successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateSmtpDetails)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="host"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Host</FormLabel>
                                        <FormControl>
                                            <Input placeholder="mail.example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="port"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Port number</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="465" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="mail@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="········" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='secure'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Secure SMTP
                                            </FormLabel>
                                            <FormDescription>
                                                Check this if smtp port is 465.
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
                                name='isActive'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Activate SMTP
                                            </FormLabel>
                                            <FormDescription>
                                                Activating this will allow system to send email for website actions like contacts, alerts, etc.
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
                            <Button type="submit" className='w-full' disabled={isUpdateSmtpDetailsPending}>
                                {isUpdateSmtpDetailsPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : smtpDetails ? 'Update details' : 'Setup SMTP service'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
                {smtpDetails.isActive && <SendTestMail />}
            </SheetContent>
        </Sheet>
    )
}

export default EditSMTPDetails