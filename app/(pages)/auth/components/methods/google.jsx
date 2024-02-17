'use client'
import React from 'react'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { Button } from '@/app/_components/ui/button'
import { useSearchParams } from 'next/navigation'
import Message from '@/app/_components/ui/message';

const GoogleSignin = ({ title }) => {
    const searchParams = useSearchParams();
    return (
        <>
            {(searchParams.get("error") && searchParams.get("signInMethod") == 'google') && <Message variant={'destructive'} message={searchParams.get("error")} className='mt-3' />}
            <Button variant='secondary' className='w-full' onClick={() => signIn('google', { callbackUrl: '/auth/signin' })} >
                <Image src='/google-signin.png' alt='Google' height={50} width={50} className='w-5 h-5 mr-2' />
                {title}
            </Button>
        </>
    )
}

export default GoogleSignin