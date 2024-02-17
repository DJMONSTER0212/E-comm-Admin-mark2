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
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation'
import Message from '@/app/_components/ui/message';
import { Loader2 } from "lucide-react"

// ZOD Schema
const formSchema = z.object({
    'email': z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is not valid' }),
    'password': z.string().min(1, { message: 'Password is required' }).min(8, { message: 'Password should have at least 8 characters' }),
});
const CredentialsSignin = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'email': '',
            'password': '',
        }
    });
    const [response, setResponse] = useState()
    const onSubmit = async (data) => {
        setResponse({ ...response, state: 'loading' })
        let signInReq;
        try {
            signInReq = await signIn('credentials', { redirect: false, callbackUrl: searchParams.get("callbackUrl") || '', ...data });
        } catch (error) {
            setResponse({ state: 'completed', error: error })
        }
        if (signInReq.error) {
            if (signInReq.error == 'Please verify your email using OTP sent on your email') {
                localStorage.setItem('email', data.email);
                router.push('/auth/verify-account')
            } else {
                setResponse({ state: 'completed', error: signInReq.error })
            }
        } else {
            if (searchParams.get("callbackUrl")) {
                router.push(searchParams.get("callbackUrl"))
            } else {
                // So that layout will capture role and redirect user
                router.push('/auth/callback')
            }
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <Message variant={response?.error && 'destructive'} message={response?.error} className='mt-3' />
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
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type='password' placeholder="·········" {...field} />
                            </FormControl>
                            <FormMessage />
                            <p className='text-base text-foreground text-right'>Forgot password? <Link href='/auth/forgot-password' className='text-primary font-medium'>Click here</Link></p>
                        </FormItem>
                    )}
                />
                <Button type="submit" className='w-full' disabled={response?.state == 'loading' && true}>
                    {response?.state == 'loading' ?
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                        : 'Sign in'
                    }
                </Button>
            </form>
        </Form>
    )
}

export default CredentialsSignin