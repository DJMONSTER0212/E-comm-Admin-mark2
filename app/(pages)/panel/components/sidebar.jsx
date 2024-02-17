"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/app/_components/ui/button';
import { MoreVertical, PanelTopClose } from 'lucide-react';
import { ThemeToggle } from '@/app/_components/ui/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu"
import { sidebarItems } from './sidebar-items';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import useSettings from '@/app/_conf/hooks/use-settings';
import { userRoles } from '@/app/_conf/constants/constant';
import { useSession } from 'next-auth/react';

const Sidebar = ({ session: serverSession }) => {
  const { data: settings } = useSettings();
  const pathname = usePathname()
  // To manage session changes
  const { data: updatedSession } = useSession();
  const [session, setSession] = useState(serverSession);
  useEffect(() => {
    if (updatedSession) {
      setSession(prevSession => ({ ...prevSession, ...updatedSession }));
    }
  }, [updatedSession]);
  // State for open sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <>
      {/* // For mobile topbar >>>>>>>>>>>>> */}
      <div className="md:hidden px-4 py-2 relative w-full bg-background border-b flex gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          {/* // Sidebar opner */}
          <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} variant='ghost' size="icon" className={`${isSidebarOpen && 'bg-muted'}`}><PanelTopClose className={`${isSidebarOpen ? '-rotate-90 transition-all' : 'rotate-90 transition-all'} h-7 w-7 text-foreground`} /></Button>
        </div>
        {/* // Logo */}
        <div className="flex flex-col">
          {/* // Dark mode logo */}
          <Image src={settings?.general?.darkLogo} priority alt='Logo' width={300} height={30} className='hidden dark:block w-auto max-w-[250px] max-h-[35px]'></Image>
          {/* // Light mode logo */}
          <Image src={settings?.general?.lightLogo} priority alt='Logo' width={300} height={30} className='block dark:hidden w-auto max-w-[250px] max-h-[35px]'></Image>
          {/* // Name logo */}
          <h1 className='text-2xl font-semibold text-primary hidden'>{settings?.general?.name}</h1>
        </div>
        {/* // User card */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className='data-[state=open]:border-2 cursor-pointer'>
              <AvatarImage className='object-cover' src={session?.user?.image} />
              <AvatarFallback>{session?.user?.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(session?.user?.role == 'admin' || session?.user?.role == 'sadmin') &&
              <>
                <DropdownMenuItem><Link href={`/panel/users/${session?.user._id}`} className='w-full'>Profile</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href={`/panel/${session?.user.role}/settings/`} className='w-full'>Settings</Link></DropdownMenuItem>
              </>
            }
            <DropdownMenuItem><Link href='/' target='_blank' className='w-full'>Go back to website</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className='text-destructive focus:bg-destructive focus:text-destructive-foreground'>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* // Sidebar >>>>>>>> */}
      <div className={`${isSidebarOpen ? 'w-full transition-all' : 'w-0 opacity-0 transition-all'} fixed left-0 z-10 md:w-[300px] md:opacity-100 md:border-r bg-background overflow-auto flex flex-col h-[calc(100vh-60px)] md:h-screen`}>
        {/* // Logo & theme toggle*/}
        <div className={`${isSidebarOpen ? 'px-4 transition-all' : 'px-0 transition-all'} w-full md:px-4 py-3 hidden md:flex items-center justify-between gap-2`}>
          <div className="flex flex-col">
            {/* // Dark mode logo */}
            <Image src={settings?.general?.darkLogo} priority alt='Logo' width={300} height={30} className='hidden dark:block w-auto max-w-[250px] max-h-[35px]'></Image>
            {/* // Light mode logo */}
            <Image src={settings?.general?.lightLogo} priority alt='Logo' width={300} height={30} className='block dark:hidden w-auto max-w-[250px] max-h-[35px]'></Image>
            {/* // Name logo */}
            <h1 className='text-2xl font-semibold text-primary hidden'>{settings?.general?.name}</h1>
          </div>
          {/* // Theme mode */}
          <ThemeToggle />
        </div>
        {/* // Sidebar items */}
        <div className={`${isSidebarOpen ? 'px-4 transition-all' : 'px-0 transition-all'} flex-1 flex flex-col gap-3 items-start mt-1 md:px-4 pt-4 md:pb-0 overflow-auto`}>
          {/* // Item groups */}
          {sidebarItems[session?.user?.role]?.map((group, index) => (
            <div key={index} className="grid gap-3 w-full">
              {/* // Title */}
              <p className='text-xs text-muted-foreground uppercase'>{group.group}</p>
              {/* // Items */}
              <div className="grid gap-1">
                {group.items.map((item) => (
                  <Link key={item.link} href={item.link} onClick={() => { setIsSidebarOpen(false) }} passHref>
                    <Button variant={pathname.includes(item.link) ? 'secondary' : 'ghost'} className='gap-2 justify-start w-full'>
                      {item.icon} {item.title}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {/* // To adjust the height of flex-1 */}
          <div className="flex-1"></div>
        </div>
        {/* // User card */}
        <div className={`${isSidebarOpen ? 'px-4 transition-all' : 'px-0 transition-all'} bg-background w-full md:px-4 py-2`}>
          <div className='w-full p-2 flex items-center justify-between gap-2'>
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage className='object-cover' src={session?.user?.image} />
                <AvatarFallback>{session?.user?.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 items-start">
                <p className='text-foreground font-medium text-sm'>{session?.user?.name}</p>
                <p className='text-muted-foreground font-normal text-xs'>{userRoles.find((role) => role.value == session?.user?.role).label}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {/* // Theme mode */}
              <div className="md:hidden"><ThemeToggle /></div>
              {/* // User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size="icon" className='data-[state=open]:bg-muted'><MoreVertical className='h-5 w-5 text-foreground' /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(session?.user?.role == 'admin' || session?.user?.role == 'sadmin') &&
                    <>
                      <DropdownMenuItem asChild><Link href={`/panel/users/${session?.user._id}`} className='w-full cursor-pointer'>Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href={`/panel/settings/`} className='w-full cursor-pointer'>Settings</Link></DropdownMenuItem>
                    </>
                  }
                  <DropdownMenuItem asChild><Link href='/' target='_blank' className='w-full cursor-pointer'>Go back to website</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar