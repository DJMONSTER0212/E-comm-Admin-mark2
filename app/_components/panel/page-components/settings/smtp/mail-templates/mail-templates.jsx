import React from 'react'
import { Brush } from 'lucide-react'
import { Separator } from '@/app/_components/ui/separator'
import OtpTemplates from './templates/otp'
import { useQuery } from '@tanstack/react-query'
import Message from '@/app/_components/ui/message'
import axios from 'axios'
import MailTemplatesSkel from './skelton/mail-templates'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"

const MailTemplates = () => {
  // Fetch mail templates
  const { data, error, isPending, isSuccess } = useQuery({
    queryKey: ['mailTemplates'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/panel/settings/smtp/mail-templates',)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    }
  })
  return (
    <>
      <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
      {isPending && <MailTemplatesSkel />}
      {isSuccess &&
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brush className='w-6 h-6 text-orange-600 border p-1.5 rounded-md' />
              <CardTitle size='base'>Customize mail templates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className='mb-3' />
            <OtpTemplates selectedTemplate={data?.mailTemplates.otpTemplate} />
          </CardContent>
        </Card>
      }
    </>
  )
}

export default MailTemplates