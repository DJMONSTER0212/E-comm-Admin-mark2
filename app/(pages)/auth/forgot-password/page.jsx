'use client'
import React, { useState } from 'react'
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
import Link from 'next/link';
import { Loader2, MoveLeft } from "lucide-react"
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useToast } from '@/app/_components/ui/use-toast';
import SetPasswordForm from './components/set-password';
import useSettings from '@/app/_conf/hooks/use-settings';

// ZOD Schema
const formSchema = z.object({
    'email': z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is not valid' }),
});
const ForgotPassword = () => {
    const { data: settings } = useSettings();
    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'email': '',
        }
    });
    // Send OTP
    const [emailReceived, setEmailReceived] = useState(false)
    const { mutate: sendOtp, isPending: isSendOtpPending } = useMutation({
        mutationFn: async ({ email }) => {
            try {
                const { data } = await axios.post('/api/auth/send-otp', { email })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => { toast({ description: 'OTP sent on your email.' }); setEmailReceived(true) },
        onError: (error) => toast({ description: error.message, variant: 'destructive' })
    })
    return (
        <>
            {!emailReceived ?
                <div className='md:ml-[60%] w-full md:w-[40%] py-10'>
                    <div className="w-[85%] mx-auto">
                        <Link href='/' passHref className='flex items-center gap-3 mb-5 text-primary'><MoveLeft className='w-5 h-5' /> Go back to website</Link>
                        {/* // Dark mode logo */}
                        <Image src={settings?.general?.darkLogo} priority alt={settings?.general.name} width={250} height={45} className='hidden dark:block w-auto max-w-[250px] max-h-[45px]'></Image>
                        {/* // Light mode logo */}
                        <Image src={settings?.general?.lightLogo} priority alt={settings?.general.name} width={250} height={45} className='block dark:hidden w-auto max-w-[250px] max-h-[45px]'></Image>                        <div className="mt-10">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(sendOtp)} className="space-y-3">
                                    <div className="mb-7">
                                        <h1 className='text-4xl font-bold text-foreground'>Forgot password</h1>
                                        <p className='text-base text-muted-foreground mt-3'>Enter your details to change your password</p>
                                    </div>
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
                                    <Button type="submit" className='w-full' disabled={isSendOtpPending}>
                                        {isSendOtpPending ?
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                            : 'Send OTP'
                                        }
                                    </Button>
                                </form>
                            </Form>
                            <p className='mt-3 text-base text-foreground'>Already have an account? <Link href='/auth/signin' className='text-primary font-medium'>Sign in</Link></p>
                        </div>
                    </div>
                </div> :
                <SetPasswordForm email={form.getValues('email')} />
            }
        </>
    )
}

export default ForgotPassword