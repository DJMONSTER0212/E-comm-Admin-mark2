import React from 'react'
import { SendHorizontal } from 'lucide-react'
import { Separator } from '@/app/_components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import OtpMails from './mail-setups/otp-mails'
import Message from '@/app/_components/ui/message'
import MailsSkel from './skelton/mails'
import ContactMails from './mail-setups/contact-mails'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardIcon
} from "@/app/_components/ui/card"

const Mails = () => {
    // Fetch mails
    const { data, error, isPending, isSuccess } = useQuery({
        queryKey: ['mails'],
        queryFn: async () => {
            try {
                const { data } = await axios.get('/api/panel/settings/smtp/mails',)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        }
    })
    return (
        <>
            <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
            {isPending && <MailsSkel />}
            {isSuccess &&
                <Card className="h-fit">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <CardIcon><SendHorizontal className='w-10 h-10 text-green-600' /></CardIcon>
                            <div>
                                <CardTitle size='base'>Setup mail addresses</CardTitle>
                                <CardDescription >Only after setting up mails addresses, mail will be sent.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Separator className='mb-3' />
                        <OtpMails mails={data.mails.otp} />
                        <Separator className='my-3' />
                        <ContactMails mails={data.mails.contact} />
                    </CardContent>
                </Card>
            }
        </>
    )
}

export default Mails