import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import GeneralSettings from '@/app/_components/panel/page-components/settings/general/general'
import SigninSettings from '@/app/_components/panel/page-components/settings/signin/signin'
import SmtpSettings from '@/app/_components/panel/page-components/settings/smtp/smtp'
import Breadcrumbs from '@/app/_components/ui/breadcrumbs';
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu"
import OtherSettings from '@/app/_components/panel/page-components/settings/other/other'
import SadminSettings from '@/app/_components/panel/page-components/settings/sadmin/admin'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const Page = async () => {
    const session = await getServerSession(authOptions)
    return (
        <div className="mx-4">
            <Breadcrumbs
                breadcrumbs={[
                    { title: 'Settings' }
                ]}
            />
            <Tabs defaultValue="general" className="w-full mt-5">
                <TabsList className='flex justify-between md:justify-start md:w-fit'>
                    <TabsTrigger value="general" className='data-[state=inactive]:hidden md:data-[state=inactive]:block'>General</TabsTrigger>
                    <TabsTrigger value="signin" className='data-[state=inactive]:hidden md:data-[state=inactive]:block'>Sign in methods</TabsTrigger>
                    <TabsTrigger value="smtp" className='data-[state=inactive]:hidden md:data-[state=inactive]:block'>SMTP details</TabsTrigger>
                    {session && session.user.role == 'sadmin' && <TabsTrigger value="admin" className='data-[state=inactive]:hidden md:data-[state=inactive]:block'>Super admin</TabsTrigger>}
                    <TabsTrigger value="other" className='data-[state=inactive]:hidden md:data-[state=inactive]:block'>Other</TabsTrigger>
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size='icon' className='rounded-md shadow-sm ml-1 h-auto w-auto p-2 bg-background hover:bg-background/70 text-foreground data-[state=open]:bg-background/70'><MoreHorizontal className='w-4 h-4' /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-[150px] bg-muted'>
                                <DropdownMenuItem asChild><TabsTrigger value="general" className='px-3 w-full justify-start'>General</TabsTrigger></DropdownMenuItem>
                                <DropdownMenuItem asChild><TabsTrigger value="signin" className='px-3 w-full justify-start'>Sign in methods</TabsTrigger></DropdownMenuItem>
                                <DropdownMenuItem asChild><TabsTrigger value="smtp" className='px-3 w-full justify-start'>SMTP details</TabsTrigger></DropdownMenuItem>
                                {session && session.user.role == 'sadmin' && <DropdownMenuItem asChild><TabsTrigger value="admin" className='px-3 w-full justify-start'>Super admin</TabsTrigger></DropdownMenuItem>}
                                <DropdownMenuItem asChild><TabsTrigger value="other" className='px-3 w-full justify-start'>Other</TabsTrigger></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TabsList>
                <TabsContent value="general"><GeneralSettings /></TabsContent>
                <TabsContent value="signin"><SigninSettings /></TabsContent>
                <TabsContent value="smtp"><SmtpSettings /></TabsContent>
                {session && session.user.role == 'sadmin' && <TabsContent value="admin"><SadminSettings /></TabsContent>}
                <TabsContent value="other"><OtherSettings /></TabsContent>
            </Tabs>
        </div>

    )
}

export default Page
