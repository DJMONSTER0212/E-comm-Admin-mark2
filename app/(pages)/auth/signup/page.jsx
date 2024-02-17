'use client'
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SignupMethods from '../components/methods/signup-methods';
import useSettings from '@/app/_conf/hooks/use-settings';

const SignUpForm = () => {
  const { data: settings } = useSettings();
  // Fetching sign in methods
  const { data: signinMethods, isPending: isSigninMethodsErrorPending, isSuccess: isSigninMethodsErrorSuccess } = useQuery({
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
            <h1 className='text-4xl font-bold text-foreground'>Sign up to Explore</h1>
            <p className='text-base text-muted-foreground mt-3'>Create a new account your email or just use Google.</p>
          </div>
          {isSigninMethodsErrorPending && <p className='text-base text-foreground mt-3'>Getting various options to sign up for you...</p>}
          {isSigninMethodsErrorSuccess && <SignupMethods signinMethods={signinMethods} />}
          <p className='mt-3 text-base text-foreground'>Already have an account? <Link href='/auth/signin' className='text-primary font-medium'>Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm