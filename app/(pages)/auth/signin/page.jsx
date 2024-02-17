'use client'
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SigninMethods from '../components/methods/signin-methods';
import Message from '@/app/_components/ui/message';
import useSettings from '@/app/_conf/hooks/use-settings';

const SigninForm = () => {
    const { data: settings } = useSettings();
    // Fetching sign in methods
    const { data: signinMethods, error: signinMethodsError, isPending: isSigninMethodsPending, isSuccess: isSigninMethodsSuccess } = useQuery({
        queryKey: ['activeSigninMethods'],
        queryFn: async () => {
            try {
                const { data } = await axios.get('/api/website/settings/signin-methods')
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        }
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
                    <div className="mb-7">
                        <h1 className='text-3xl md:text-4xl font-bold text-foreground'>Sign in to Explore</h1>
                        <p className='text-base text-muted-foreground mt-3'>Sign into your account and start exploring now.</p>
                    </div>
                    {signinMethodsError && <Message variant='destructive' message={signinMethodsError?.message} />}
                    {isSigninMethodsPending && <p className='text-base text-foreground mt-3'>Getting various options to sign in for you...</p>}
                    {isSigninMethodsSuccess && <SigninMethods signinMethods={signinMethods} />}
                    <p className='mt-3 text-base text-foreground'>New here? <Link href='/auth/signup' className='text-primary font-medium'>Create account</Link></p>
                </div>
            </div>
        </div>
    )
}

export default SigninForm