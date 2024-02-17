'use client'
import React from 'react'
import useSettings from '@/app/_conf/hooks/use-settings';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, X, Youtube } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import BorderLink from '@/app/_components/ui/border-link';

const Footer = () => {
  const { data: settings } = useSettings();

  return (
    <footer className="bg-border/20 dark:bg-border/50 mt-20">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-10 sm:px-6 lg:space-y-10 lg:px-8">
        {/* // Logo & Social */}
        <div className="flex flex-col sm:flex-row gap-10 sm:items-center sm:justify-between">
          {/* // Dark mode logo */}
          <Image src={settings?.general?.darkLogo} priority alt='Logo' width={300} height={30} className='hidden dark:block w-fit max-w-[250px] max-h-[35px]'></Image>
          {/* // Light mode logo */}
          <Image src={settings?.general?.lightLogo} priority alt='Logo' width={300} height={30} className='block dark:hidden w-fit max-w-[250px] max-h-[35px]'></Image>
          {/* // Social */}
          <ul className="flex flex-wrap justify-start gap-2 sm:mt-0 sm:justify-end">
            <li><Button variant='secondary' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Facebook'><Facebook className='w-5 h-5' /></Link></Button></li>
            <li><Button variant='secondary' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Instagram'><Instagram className='w-5 h-5' /></Link></Button></li>
            <li><Button variant='secondary' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='X'><X className='w-5 h-5' /></Link></Button></li>
            <li><Button variant='secondary' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Linkedin'><Linkedin className='w-5 h-5' /></Link></Button></li>
            <li><Button variant='secondary' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Peerlist'><p className='text-base h-5 -mt-1.5 overflow-hidden font-semibold'>P</p></Link></Button></li>
            <li><Button variant='secondary' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Youtube'><Youtube className='w-5 h-5' /></Link></Button></li>
            <li><Button variant='secondary' size='icon' className='text-muted-foreground hover:text-foreground focus-visible:text-foreground' asChild><Link href="/" target="_blank" aria-label='Google'><p className='text-base h-5 -mt-1.5 overflow-hidden font-semibold'>G</p></Link></Button></li>
          </ul>
        </div>
        {/* // Links */}
        <div className="grid grid-cols-1 gap-8 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:pt-10">
          <div>
            <p className="text-base font-medium">Quick links</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Homepage</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">About us</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Contact Us</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">FAQs</BorderLink></li>
            </ul>
          </div>
          <div>
            <p className="text-base font-medium">Services</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Explore tours</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Explore rented cars</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Book hotels</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Get your visa</BorderLink></li>
            </ul>
          </div>
          <div>
            <p className="text-base font-medium">Legal</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Terms & Conditions</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Privacy policy</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Refund policy</BorderLink></li>
            </ul>
          </div>
          <div>
            <p className="text-base font-medium">Get in touch</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Contact Us</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Call: +91-0123456789</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">Call : +971561618481</BorderLink></li>
              <li><BorderLink href="/" className="text-sm py-0 text-muted-foreground hover:text-foreground focus-visible:text-foreground">contact@zipcruisetours.com</BorderLink></li>
            </ul>
          </div>
        </div>
        {/* // Copyright text */}
        <p className="text-sm">{settings.general.name}. All rights reserved. Developed by <Link href='https://www.tnitservices.com/' target='_blank' className='text-blue-700 font-medium'>TNIT</Link></p>
      </div>
    </footer>
  )
}

export default Footer