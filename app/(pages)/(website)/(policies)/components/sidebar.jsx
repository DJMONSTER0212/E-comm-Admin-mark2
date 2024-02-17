'use client'
import BorderLink from '@/app/_components/ui/border-link'
import { Separator } from '@/app/_components/ui/separator'
import { FileText, MessageCircle, RefreshCcw, ShieldCheck } from 'lucide-react'
import React from 'react'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
    const pathname = usePathname();
    return (
        <div className="w-full md:col-span-2 lg:col-span-1 md:sticky md:top-0 order-2 md:order-1 flex flex-col gap-10 h-fit">
            <Separator className='md:hidden' />
            {/* // Other policy pages */}
            <div>
                <p className='text-xl font-semibold'>Policy pages</p>
                <p className='text-sm text-muted-foreground mt-1.5'>Explore Our Guidelines, Terms, policies, and Regulations.</p>
                <div className="mt-4 flex flex-col gap-2">
                    <BorderLink href='/refund-policy' isActive={pathname == '/refund-policy'} className='flex items-center gap-2 text-foreground font-medium'><RefreshCcw className='w-4 min-w-4 h-4 min-h-4' />Refund policy</BorderLink>
                    <BorderLink href='/terms-and-conditions' isActive={pathname == '/terms-and-conditions'} className='flex items-center gap-2 text-foreground font-medium'><FileText className='w-4 min-w-4 h-4 min-h-4' />Terms and Conditions</BorderLink>
                    <BorderLink href='/privacy-policy' isActive={pathname == '/privacy-policy'} className='flex items-center gap-2 text-foreground font-medium'><ShieldCheck className='w-4 min-w-4 h-4 min-h-4' />Privacy policy</BorderLink>
                </div>
            </div>
            {/* // Contact Us */}
            <div>
                <p className='text-xl font-semibold'>Contact us</p>
                <p className='text-sm text-muted-foreground mt-1.5'>Still have question? We are ready to help you.</p>
                <div className="mt-4 flex flex-col gap-2">
                    <BorderLink href='/contact-us' className='flex items-center gap-2 text-foreground font-medium'><MessageCircle className='w-4 min-w-4 h-4 min-h-4' />Contact Us</BorderLink>
                </div>
            </div>
        </div>
    )
}

export default Sidebar