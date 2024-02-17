import BorderLink from '@/app/_components/ui/border-link'
import { Button } from '@/app/_components/ui/button'
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, X, Youtube } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
    return (
        <div className="w-full rounded-md bg-muted py-5 px-7 md:col-span-2 order-2 md:order-1 flex flex-col gap-10">
            {/* // Send us an email */}
            <div>
                <p className='text-xl font-semibold'>Connect with us</p>
                <p className='text-sm text-muted-foreground mt-1.5'>Speak to our team by your preferred way to book hotels, apply for visa or to resolve your problems.</p>
                <div className="mt-4 flex flex-col gap-2">
                    <BorderLink href='/' className='flex items-center gap-2 text-foreground font-medium'><Mail className='w-4 min-w-4 h-4 min-h-4' /> Send us an email</BorderLink>
                    <BorderLink href='/' className='flex items-center gap-2 text-foreground font-medium'><Phone className='w-4 min-w-4 h-4 min-h-4' />Call us directly</BorderLink>
                    <BorderLink href='/' className='flex items-center gap-2 text-foreground font-medium'><MessageCircle className='w-4 min-w-4 h-4 min-h-4' /> Message us on whatsapp</BorderLink>
                </div>
            </div>
            {/* // Call us directly */}
            <div>
                <p className='text-xl font-semibold'>Call us</p>
                <p className='text-sm text-muted-foreground mt-1.5'>Call us Mon-Sat from 9am to 5pm</p>
                <div className="mt-4 flex flex-col gap-2">
                    <BorderLink href='/' className='flex items-center gap-2 text-foreground font-medium'><Phone className='w-4 min-w-4 h-4 min-h-4' />+91-0123456789</BorderLink>
                    <BorderLink href='/' className='flex items-center gap-2 text-foreground font-medium'><Phone className='w-4 min-w-4 h-4 min-h-4' />+91-9874651230</BorderLink>
                </div>
            </div>
            {/* // Visit us */}
            <div className='flex-1'>
                <p className='text-xl font-semibold'>Visit us</p>
                <p className='text-sm text-muted-foreground mt-1.5'>Meet us in person at our office</p>
                <div className="mt-4 flex flex-col gap-2">
                    <BorderLink href='/' className='flex items-start md:items-center gap-2 text-foreground font-medium'><MapPin className='w-4 min-w-4 min-w-4 h-4 min-h-4 min-h-4' />Sindhi camp, Jaipur, Rajasthan, 303104</BorderLink>
                </div>
            </div>
            {/* // Social media */}
            <ul className="flex flex-wrap justify-start gap-3 mt-7 md:mt-10">
                <ul className="flex flex-wrap justify-start gap-2 sm:mt-0">
                    <li><Button variant='outline' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Facebook'><Facebook className='w-5 h-5' /></Link></Button></li>
                    <li><Button variant='outline' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Instagram'><Instagram className='w-5 h-5' /></Link></Button></li>
                    <li><Button variant='outline' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='X'><X className='w-5 h-5' /></Link></Button></li>
                    <li><Button variant='outline' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Linkedin'><Linkedin className='w-5 h-5' /></Link></Button></li>
                    <li><Button variant='outline' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Peerlist'><p className='text-base h-5 -mt-1.5 overflow-hidden font-semibold'>P</p></Link></Button></li>
                    <li><Button variant='outline' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Youtube'><Youtube className='w-5 h-5' /></Link></Button></li>
                    <li><Button variant='outline' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Google'><p className='text-base h-5 -mt-1.5 overflow-hidden font-semibold'>G</p></Link></Button></li>
                </ul>
            </ul>
        </div>
    )
}

export default Sidebar