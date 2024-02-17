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

// ZOD Schema
const formSchema = z.object({
    'email': z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is not valid' }),
    'otp': z.string().min(1, { message: 'OTP is required' }).min(6, { message: 'OTP should have 6 digits' }).max(6, { message: 'OTP can have max 6 digits' }),
    'password': z.string().min(1, { message: 'Password is required' }).min(8, { message: 'Password should have at least 8 characters' }),
    'cpassword': z.string().min(1, { message: 'Confirm password is required' }).min(8, { message: 'Confirm password should have at least 8 characters' }),
}).superRefine(({ cpassword, password }, ctx) => {
    if (cpassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Password and confirm password should match",
            path: ['cpassword']
        });
    }
});;
const SetPasswordForm = ({ email }) => {
    const { toast } = useToast()
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'email': email,
            'otp': '',
            'password': '',
            'cpassword': '',
        }
    });
    // Verification request
    const { mutate: setPassword, error: setPasswordError, isPending: isSetPasswordPending, isSuccess: isSetPasswordSuccess } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.post('/api/auth/forgot-password', formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            setTimeout(() => {
                router.push('/auth/signin')
            }, 3000)
        }
    })
    // Send OTP
    const { mutate: sendOtp, isPending: isSendOtpPending } = useMutation({
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
                <Image src={'/logo-light.png'} priority alt='Logo' width={300} height={30} className='block dark:hidden w-auto max-w-[250px] max-h-[45px]'></Image>
                <div className="mt-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(setPassword)} className="space-y-3">
                            <div className="mb-7">
                                <h1 className='text-4xl font-bold text-foreground'>Forgot password</h1>
                                <p className='text-base text-muted-foreground mt-3'>An OTP has been sent on your email <span className='text-foreground'>{email}</span>. Please verify your email by submitting the OTP here.</p>
                            </div>
                            <Message variant={setPasswordError ? 'destructive' : 'default'} message={setPasswordError?.message || (isSetPasswordSuccess && 'Your password has been successfully changed. Redirecting to sign in page.')} className='mt-3' />
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
                            <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="·········" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cpassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="·········" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className='w-full' disabled={isSetPasswordPending}>
                                {isSetPasswordPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : 'Set password'
                                }
                            </Button>
                        </form>
                    </Form>
                    <p className='mt-3 text-base text-foreground'>Already have an account? <Link href='/auth/signin' className='text-primary font-medium'>Sign in</Link></p>
                </div>
            </div>
        </div>
    )
}

export default SetPasswordForm