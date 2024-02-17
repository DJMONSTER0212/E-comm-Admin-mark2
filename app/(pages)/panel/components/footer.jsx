import React from 'react'
import Link from 'next/link'
import { Separator } from '@/app/_components/ui/separator'

const Footer = () => {
  return (
    <>
      <Separator className='my-4' />
      <p className='text-base text-foreground text-center'>Developed by <Link href='https://www.tnitservices.com/' target='_blank' className='text-primary font-medium'>TNIT</Link> with ❤️</p>
    </>
  )
}

export default Footer