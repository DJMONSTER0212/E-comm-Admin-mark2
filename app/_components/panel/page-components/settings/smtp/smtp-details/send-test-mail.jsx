import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/_components/ui/dialog"
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
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
import Message from '@/app/_components/ui/message';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is not valid' }),
    outgoingEmail: z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is not valid' }),
});
const SendTestMail = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            outgoingEmail: '',
        }
    });
    // Send test mail function
    const { mutate: sendTestMail, isPending: isSendTestMailPending, isSuccess: isSendTestMailSuccess, error: sendTestMailError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.post(`/api/panel/settings/smtp/smtp-details/test-mail`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        }
    })
    return (
        <Dialog>
            <DialogTrigger className='w-full mt-2'><Button variant='secondary' className='w-full' size='sm'>Send test mail</Button></DialogTrigger>
            <DialogContent className='w-[95%]'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Test your SMTP configuration</DialogTitle>
                    <DialogDescription>
                        Enter emails to send & recieve the test mail and if all goes well then you will get a test mail.
                    </DialogDescription>
                    <Message variant={sendTestMailError?.message ? 'destructive' : 'default'} message={sendTestMailError?.message || isSendTestMailSuccess && `Test mail has been sent successfully.`} />
                </DialogHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(sendTestMail)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="outgoingEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email from which the email will be sent</FormLabel>
                                        <FormControl>
                                            <Input placeholder="testmail@example.com" {...field} />
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
                                        <FormLabel>Email to which the email will go</FormLabel>
                                        <FormControl>
                                            <Input placeholder="me@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isSendTestMailPending}>
                                {isSendTestMailPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : 'Send test mail'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SendTestMail