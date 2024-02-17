import React from 'react'
import { Mails, Loader2 } from 'lucide-react'
import EditSMTPDetails from './edit'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '@/app/_components/ui/button'
import { useToast } from '@/app/_components/ui/use-toast'
import axios from 'axios'
import Message from '@/app/_components/ui/message'
import SmtpDetailsSkel from './skelton/smtp-details'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardIcon
} from "@/app/_components/ui/card"

const SmtpDetails = () => {
  const { toast } = useToast()
  // Fetch settings
  const { data, error, isPending, isSuccess, refetch } = useQuery({
    queryKey: ['smtpDetails'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/panel/settings/smtp/smtp-details',)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    }
  })
  // Toggle Smtp
  const { mutate: toggleSmtp, isPending: isToggleSmtpPending } = useMutation({
    mutationFn: async (isActive) => {
      try {
        const { data } = await axios.patch(`/api/panel/settings/smtp/smtp-details/`, { isActive })
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    },
    onSuccess: (data, variables) => {
      refetch()
      toast({ description: `SMTP service ${variables ? 'activated' : 'deactivated'} successfully.` });
    },
    onError: (error) => {
      toast({ description: error?.message, variant: 'destructive' })
    }
  })
  return (
    <>
      <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
      {isPending && <SmtpDetailsSkel />}
      {isSuccess &&
        <Card>
          <CardHeader>
            <CardIcon><Mails className='text-primary h-10 w-10' /></CardIcon>
            <CardTitle size='lg'>SMTP Service Setup</CardTitle>
            <CardDescription>SMTP service will be used during sending email for alerts, contact queries, customer mails, OTP mails, etc. <span className='text-foreground font-medium'>It is highly recommended to setup the SMTP for an better workflow.</span></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center mt-3">
              {data.smtpDetails ?
                <>
                  <EditSMTPDetails smtpDetails={data.smtpDetails} />
                  <Button onClick={() => { toggleSmtp(data.smtpDetails.isActive ? false : true) }} variant={data.smtpDetails.isActive ? 'destructive' : 'default'} className='w-full' size='sm' disabled={isToggleSmtpPending}>
                    {isToggleSmtpPending ?
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                      : data.smtpDetails.isActive ? 'Deactivate' : 'Activate'
                    }
                  </Button>
                </> :
                <EditSMTPDetails smtpDetails={data.smtpDetails} />
              }
            </div>
          </CardContent>
        </Card>
      }
    </>
  )
}

export default SmtpDetails