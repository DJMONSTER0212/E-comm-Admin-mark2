import { CarFront, FerrisWheel, UserCog } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/app/_components/ui/button'
import ArrowLink from '@/app/_components/ui/arrow-link'

const page = () => {
  return (
    <>
      <div className="mb-7">
        <h1 className='text-3xl font-bold leading-[1.5]'>Your account</h1>
        <p className='text-base text-muted-foreground mt-1.5'>Your Account Dashboard: Manage Your Bookings, settings, and More</p>
      </div>
      <div className='grid xs:grid-cols-2 lg:grid-cols-3 gap-5 mt-7'>
        <Link href='/profile' className="group border rounded-md w-full p-3 flex flex-col" passHref>
          <Button variant='outline' size='icon' className='shadow-none' asChild><UserCog className='w-4 h-4 p-1.5 text-primary' /></Button>
          <p className='text-base font-semibold leading-[1.5] mt-3'>Account settings</p>
          <p className='text-sm text-muted-foreground mt-1 flex-1'>Edit your profile details, change password and more.</p>
          <ArrowLink asText={true} className='mt-2'>Manage account</ArrowLink>
        </Link>

      </div>
    </>
  )
}

export default page