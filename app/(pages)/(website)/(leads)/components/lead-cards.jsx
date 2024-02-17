'use client'
import { Button } from '@/app/_components/ui/button'
import { HeartHandshake, Hotel, Ticket } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import ArrowLink from '@/app/_components/ui/arrow-link'

const LeadCards = () => {
    const pathname = usePathname();
    return (
        <div className='grid grid-cols-2 gap-5 mt-7'>
            {pathname != '/apply-visa' && <Link href='/apply-visa' className="border rounded-md w-full p-3" passHref>
                <Button variant='outline' size='icon' className='shadow-none' asChild><Ticket className='w-4 h-4 p-1.5 text-primary' /></Button>
                <p className='text-base font-semibold leading-[1.5] mt-3'>Apply for visa</p>
                <p className='text-sm text-muted-foreground mt-1'>Get your visa approved at your home.</p>
                <ArrowLink className='mt-2' asText>Apply now</ArrowLink>
            </Link>}
            {pathname != '/book-hotel' && <Link href='/book-hotel' className="border rounded-md w-full p-3" passHref>
                <Button variant='outline' size='icon' className='shadow-none' asChild><Hotel className='w-4 h-4 p-1.5 text-primary' /></Button>
                <p className='text-base font-semibold leading-[1.5] mt-3'>Book hotel</p>
                <p className='text-sm text-muted-foreground mt-1'>Take your Stay <span className='text-foreground'>EXPERIENCE</span> to the next level.</p>
                <ArrowLink className='mt-2' asText>Book now</ArrowLink>
            </Link>}
            {pathname != '/contact-us' && <Link href='/contact-us' className="border rounded-md w-full p-3" passHref>
                <Button variant='outline' size='icon' className='shadow-none' asChild><HeartHandshake className='w-4 h-4 p-1.5 text-primary' /></Button>
                <p className='text-base font-semibold leading-[1.5] mt-3'>Contact us</p>
                <p className='text-sm text-muted-foreground mt-1'>Send a your message, complaint, etc to our team.</p>
                <ArrowLink className='mt-2' asText>Contact us</ArrowLink>
            </Link>}
        </div>
    )
}

export default LeadCards