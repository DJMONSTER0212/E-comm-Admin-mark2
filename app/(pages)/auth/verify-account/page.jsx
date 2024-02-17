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
import Link from 'next/link';
import Message from '@/app/_components/ui/message';
import { Loader2, MoveLeft } from "lucide-react"
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/_components/ui/use-toast';
import useSettings from '@/app/_conf/hooks/use-settings';

// ZOD Schema
const formSchema = z.object({
    'email': z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is not valid' }),
    'otp': z.string().min(1, { message: 'OTP is required' }).min(6, { message: 'OTP should have 6 digits' }).max(6, { message: 'OTP can have max 6 digits' }),
});
const VerifyForm = () => {
    const { data: settings } = useSettings();
    const { toast } = useToast()
    const router = useRouter();
    // Check for email in local storage
    const email = localStorage.getItem('email');
    if (!email) {
        router.push('/auth/signin')
    }
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'email': email,
            'otp': ''
        }
    });
    // Verification request
    const { mutate: verifyOtp, error: verifyError, isPending: isVerifyPending, isSuccess: isVerifySuccess } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.post('/api/auth/verify', formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (response) => {
            setTimeout(() => {
                localStorage.removeItem('email');
                router.push('/auth/signin')
            }, 3000)
        }
    })
    // Resend OTP
    const { mutate: sendOtp, error: sendOtpError, isPending: isSendOtpPending, isSuccess: isSendOtpSuccess } = useMutation({
        mutationFn: async () => {
            try {
                const { data } = await axios.post('/api/auth/send-otp', { email })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => toast({ description: 'OTP sent on your email.' }),
        onError: (error) => toast({ description: error.message, variant: 'destructive' })
    })
    return (
        <div className='md:ml-[60%] w-full md:w-[40%] py-10'>
            <div className="w-[85%] mx-auto">
                <Link href='/' passHref className='flex items-center gap-3 mb-5 text-primary'><MoveLeft className='w-5 h-5' /> Go back to website</Link>
                {/* // Dark mode logo */}
                <Image src={settings?.general?.darkLogo} priority alt={settings?.general.name} width={250} height={45} className='hidden dark:block w-auto max-w-[250px] max-h-[45px]'></Image>
                {/* // Light mode logo */}
                <Image src={settings?.general?.lightLogo} priority alt={settings?.general.name} width={250} height={45} className='block dark:hidden w-auto max-w-[250px] max-h-[45px]'></Image>
                <div className="mt-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(verifyOtp)} className="space-y-3">
                            <div className="mb-7">
                                <h1 className='text-3xl md:text-4xl font-bold text-foreground'>Verify your account</h1>
                                <p className='text-base text-muted-foreground mt-3'>An OTP has been sent on your email <span className='text-foreground'>{email}</span>. Please verify your email by submitting the OTP here.</p>
                            </div>
                            <Message variant={verifyError ? 'destructive' : 'default'} message={verifyError?.message || (isVerifySuccess && 'Your account has been successfully verified. Redirecting to sign in page.')} className='mt-3' />
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>OTP</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="XXXXXX" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        <p className='text-base text-foreground text-right'>Didn{"'"}t received OTP? <span onClick={sendOtp} className='text-primary font-medium cursor-pointer'>{isSendOtpPending ? 'Sending...' : 'Resend OTP'}</span></p>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isVerifyPending}>
                                {isVerifyPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : 'Verify account'
                                }
                            </Button>
                        </form>
                    </Form>
                    <p className='mt-3 text-base text-foreground'>New here? <Link href='/auth/signup' className='text-primary font-medium'>Create account</Link></p>
                </div>
            </div>
        </div>
    )
}

export default VerifyForm