'use client'
import React, { useRef, useState, useEffect } from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/app/_components/ui/navigation-menu"
import Link from 'next/link'
import { ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import { cn } from '@/app/_lib/utils'
import ArrowLink from '@/app/_components/ui/arrow-link'

const NavbarItems = () => {
    const [selectedPopularToursItem, setSelectedPopularToursItem] = useState('categories')
    // Navbar width
    const [navbarWidth, setNavbarWidth] = useState(0);
    const navbarRef = useRef(null);
    const updateNavbarWidth = () => {
        const newWidth = navbarRef.current.offsetWidth;
        setNavbarWidth(newWidth);
    };
    useEffect(() => {
        updateNavbarWidth();
        const handleResize = () => {
            updateNavbarWidth();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div className="border-b">
            <div ref={navbarRef} className="hidden md:block max-w-screen-xl mx-auto p-screen">
                <NavigationMenu orientation='vertical'>
                    <NavigationMenuList className='space-x-6 py-3'>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger onMouseOver={() => { setSelectedPopularToursItem('categories') }}>Hello</NavigationMenuTrigger>
                            <NavigationMenuContent style={{ width: navbarWidth - 40 + 'px' }}>
                                <div className="grid grid-cols-3">
                                    <div className="grid grid-cols-1 gap-1 border-r p-2">
                                        <Button onMouseOver={() => { setSelectedPopularToursItem('categories') }} variant={selectedPopularToursItem == 'categories' ? 'secondary' : 'ghost'} className='w-full text-left justify-between'>Top categories <ChevronRight className='w-4 h-4' /></Button>
                                        <Button onMouseOver={() => { setSelectedPopularToursItem('india') }} variant={selectedPopularToursItem == 'india' ? 'secondary' : 'ghost'} className='w-full text-left justify-between'>Top India tours <ChevronRight className='w-4 h-4' /></Button>
                                        <Button onMouseOver={() => { setSelectedPopularToursItem('dubai') }} variant={selectedPopularToursItem == 'dubai' ? 'secondary' : 'ghost'} className='w-full text-left justify-between'>Top Dubai tours <ChevronRight className='w-4 h-4' /></Button>
                                        <Button onMouseOver={() => { setSelectedPopularToursItem('asia') }} variant={selectedPopularToursItem == 'asia' ? 'secondary' : 'ghost'} className='w-full text-left justify-between'>Top Asia tours <ChevronRight className='w-4 h-4' /></Button>
                                        <Button onMouseOver={() => { setSelectedPopularToursItem('europe') }} variant={selectedPopularToursItem == 'europe' ? 'secondary' : 'ghost'} className='w-full text-left justify-between'>Top Europe tours <ChevronRight className='w-4 h-4' /></Button>
                                        <Button variant='ghost' className='w-full text-left justify-start text-primary hover:text-primary' asChild><ArrowLink href='/'>Explore all </ArrowLink></Button>
                                    </div>
                                    <div className="col-span-2 py-2">
                                        <p className='flex gap-2 items-center font-medium w-full border-b px-3 pb-2'><Sparkles className='w-4 h-4' />Top categories</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-between h-fit mt-3 px-3">
                                            <Link href="/auth/signin" legacyBehavior passHref>
                                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'text-sm')}>
                                                    One day tours
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/auth/signin" legacyBehavior passHref>
                                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'text-sm')}>
                                                    Night trip
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/auth/signin" legacyBehavior passHref>
                                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'text-sm')}>
                                                    Holy places
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/auth/signin" legacyBehavior passHref>
                                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'text-sm')}>
                                                    Club tours
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/auth/signin" legacyBehavior passHref>
                                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'text-sm')}>
                                                    City tours
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/auth/signin" legacyBehavior passHref>
                                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'text-sm')}>
                                                    Wine Tastings in Florence
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/auth/signin" legacyBehavior passHref>
                                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'text-sm')}>
                                                    link1
                                                </NavigationMenuLink>
                                            </Link>
                                            <Link href="/auth/signin" legacyBehavior passHref>
                                                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'text-sm')}>
                                                    link1
                                                </NavigationMenuLink>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/explore/rented-cars" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    link1
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/apply-visa" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Link2
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/book-hotel" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Link3
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/contact-us" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Contact Us
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}

export default NavbarItems