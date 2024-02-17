"use client"
import React from 'react'
import { Button } from '@/app/_components/ui/button'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import Message from '@/app/_components/ui/message'
import axios from 'axios'
import CredentialMethod from './methods/credentials/method'
import GoogleMethod from './methods/google/method'
import SigninMethodsSkel from './skelton/signin-methods'
import FacebookMethod from './methods/facebook/method'

const SigninSettings = () => {
  // Fetch settings
  const { data, error, isPending, isSuccess, refetch } = useQuery({
    queryKey: ['signinMethods'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/panel/settings/signin-methods',)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    }
  })
  return (
    <>
      <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
      {isPending && <SigninMethodsSkel />}
      {isSuccess &&
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 mt-5">
          <CredentialMethod method={data.signinMethods.filter((signinMethod) => signinMethod.name == 'credentials')[0]} />
          <GoogleMethod method={data.signinMethods.filter((signinMethod) => signinMethod.name == 'google')[0]} />
          <FacebookMethod />
        </div>
      }
    </>
  )
}

export default SigninSettings