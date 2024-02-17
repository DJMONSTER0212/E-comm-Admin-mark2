'use client'
import React from 'react'
import EditGeneralSetting from './edit';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Message from '@/app/_components/ui/message';
import InfoSettings from './info';
import SocialSettings from './social';

const GeneralSettings = () => {
  // Fetch general settings
  const { data, error, isPending, isSuccess } = useQuery({
    queryKey: ['general-settings'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/panel/settings/general`)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    },
    retry: false
  })
  return (
    <>
      <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
      {isPending && 'Loading...'}
      {isSuccess && data &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          <EditGeneralSetting settings={data} />
          <div className="grid grid-cols-1 gap-5 h-fit">
            <SocialSettings settings={data} />
            <InfoSettings settings={data} />
          </div>
        </div>
      }
    </>
  )
}

export default GeneralSettings