'use client'
import React from 'react'
import EditAdminSetting from './edit';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Message from '@/app/_components/ui/message';
import { useSession } from 'next-auth/react';

const SadminSettings = () => {
  const { data: session } = useSession();
  // Fetch super admin settings
  const { data, error, isPending, isSuccess } = useQuery({
    queryKey: ['sadmin-settings'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/panel/settings/sadmin`)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    },
    retry: false
  })
  // Authentication 
  if (!session || !session.user.role == 'sadmin') {
    return ('These are super admin only settings.')
  }
  return (
    <>
      <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
      {isPending && 'Loading...'}
      {isSuccess && data &&
        <div className="grid grid-cols-1 mt-5">
          <EditAdminSetting settings={data} />
        </div>
      }
    </>
  )
}

export default SadminSettings