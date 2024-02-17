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
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// ZOD Schema
const formSchema = z.object({
    'name': z.string().min(1, { message: 'Name is required' }),
    'email': z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is not valid' }),
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
});
const CredentialsSignup = () => {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'name': '',
            'email': '',
            'password': '',
            'cpassword': ''
        }
    });
    // Verification request
    const { mutate: signUp, error: signUpError, isPending: isSignUpPending, isSuccess: isSignUpSuccess } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.post('/api/auth/sign-up', formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (response, formData) => {
            localStorage.setItem('email', formData.email);
            router.push('/auth/verify-account')
        }
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(signUp)} className="space-y-3">
                <Message variant={signUpError ? 'destructive' : 'default'} message={signUpError?.message} className='mt-3' />
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
                <div className="grid gap-2 grid-cols-1 xs:grid-cols-2">
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
                <Button type="submit" className='w-full' disabled={isSignUpPending}>
                    {isSignUpPending ?
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                        : 'Sign up'
                    }
                </Button>
            </form>
        </Form>
    )
}

export default CredentialsSignup