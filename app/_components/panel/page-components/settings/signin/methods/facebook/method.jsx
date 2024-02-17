import React from 'react'
import Image from 'next/image'
import { Button } from '@/app/_components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardIcon
} from "@/app/_components/ui/card"

const FacebookMethod = () => {
    return (
        <Card className='flex flex-col'>
            <CardHeader className='flex-1'>
                <CardIcon><Image src='/panel/images/facebook.png' width={45} height={45} alt='Facebook' /></CardIcon>
                <CardTitle size='base'>Facebook OAuth</CardTitle>
                <CardDescription>This will allow user to sign in using Facebook.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 items-center">
                    <Button variant='default' disabled className='w-full' size='sm'>Coming soon</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default FacebookMethod