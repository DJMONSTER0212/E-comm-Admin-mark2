'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { Button } from '@/app/_components/ui/button';
import { ChevronDown, PanelTopClose, User } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import useSettings from '@/app/_conf/hooks/use-settings';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import NavbarItems from './navbar-items';
import NavbarItemsMobile from './navbar-items-mobile';
import { useTheme } from "next-themes"

const Navbar = ({ session: serverSession }) => {
    const { setTheme, theme } = useTheme()
    const { data: settings } = useSettings();
    // To manage session changes
    const { data: updatedSession } = useSession();
    const [session, setSession] = useState(serverSession);
    useEffect(() => {
        if (updatedSession) {
            setSession(prevSession => ({ ...prevSession, ...updatedSession }));
        }
    }, [updatedSession]);
    // State for open sidebar on mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);
    return (
        <>
            <div className={`py-2.5 bg-background border-b`}>
                <div className="flex justify-between items-center max-w-screen-xl mx-auto p-screen">
                    {/* // Sidebar open btn*/}
                    <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} variant='ghost' size="icon" aria-label='Open main menu' className={`${isSidebarOpen && 'bg-muted'} md:hidden`}><PanelTopClose className={`${isSidebarOpen ? '-rotate-90 transition-all' : 'rotate-90 transition-all'} h-7 w-7 text-foreground`} /></Button>
                    {/* // Dark mode logo */}
                    <Link href='/' className='hidden dark:block w-auto max-w-[250px] max-h-[35px]' passHref><Image src={settings?.general?.darkLogo} priority alt='Logo' width={300} height={30} className='hidden dark:block w-auto max-w-[250px] max-h-[35px]'></Image></Link>
                    {/* // Light mode logo */}
                    <Link href='/' className='block dark:hidden w-auto max-w-[250px] max-h-[35px]' passHref><Image src={settings?.general?.lightLogo} priority alt='Logo' width={300} height={30} className='block dark:hidden w-auto max-w-[250px] max-h-[35px]'></Image></Link>
                    {/* // Navigation and user card */}
                    <div className="flex gap-2 md:gap-3 items-center">
                        {session ?
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='outline' aria-label='Open user manu' className="gap-2 data-[state=open]:bg-muted p-0 md:p-1 rounded-md md:rounded-full">
                                        <Avatar className='cursor-pointer h-full max-md:w-full max-md:rounded-md'>
                                            <AvatarImage className='object-cover' src={session?.user?.image} />
                                            <AvatarFallback>{session?.user?.name.slice(0, 1)}</AvatarFallback>
                                        </Avatar>
                                        <p className='hidden md:block'>{session?.user?.name.slice(0, 5)} {session?.user?.name.length > 5 && '..'}</p>
                                        <ChevronDown className='hidden md:block text-muted-foreground w-5 h-5' />
                                    </Button>
                                </DropdownMenuTrigger>
                                {session &&
                                    <DropdownMenuContent>
                                        {(session?.user?.role == 'admin' || session?.user?.role == 'sadmin' || session?.user?.role == 'supportTeam') &&
                                            <>
                                                <DropdownMenuItem asChild><Link href={`/auth/callback`} target='_blank' className='w-full cursor-pointer'>Dashboard</Link></DropdownMenuItem>
                                            </>
                                        }
                                        <DropdownMenuItem asChild><Link href={`/account`} className='w-full cursor-pointer'>Account</Link></DropdownMenuItem>
                                        <DropdownMenuItem asChild><Link href={`/account`} className='w-full cursor-pointer'>link</Link></DropdownMenuItem>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                                    <DropdownMenuRadioItem value={'light'} className='cursor-pointer'>Light</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value={'dark'} className='cursor-pointer'>Dark</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value={'system'} className='cursor-pointer'>System</DropdownMenuRadioItem>
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className='cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground'>Log out</DropdownMenuItem>
                                    </DropdownMenuContent>
                                }
                            </DropdownMenu> :
                            <div className="flex gap-2">
                                <Button className='hidden xs:block' variant='outline' asChild>
                                    <Link href='/auth/signin'>Sign up</Link>
                                </Button>
                                <Button variant='default' className='max-xs:h-9 max-xs:w-9 max-xs:p-0' asChild>
                                    <Link href='/auth/signin'><span className='xs:block hidden' aria-label='Sign in'>Sign in</span> <User className='xs:hidden' /></Link>
                                </Button>
                                {/* <ThemeToggle className='bg-transparent border-none shadow-none' /> */}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <NavbarItems />
            <NavbarItemsMobile isSidebarOpen={isSidebarOpen} />
        </>
    )
}

export default Navbar