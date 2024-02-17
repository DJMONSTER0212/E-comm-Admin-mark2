'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/app/_lib/utils'
import { otpMailTemplates } from '@/app/_conf/mail/templates/otp-mail-template'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useToast } from '@/app/_components/ui/use-toast'

const OtpTemplates = ({ selectedTemplate }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient()
    const [active, setActive] = useState(selectedTemplate)
    // Update mail template
    const { mutate: updateMailTemplate, isPending: isUpdateMailTemplatePending } = useMutation({
        mutationFn: async (templateId) => {
            try {
                const { data } = await axios.put(`/api/panel/settings/smtp/mail-templates`, { template: 'otpTemplate', selectedTemplate: templateId })
                return data;
            } catch (error) {
                console.log(error)
                throw new Error(error.response.data.error)
            }
        },
        onError: (error) => {
            setActive(selectedTemplate)
            toast({ description: error.message, variant: 'destructive' });
        },
        onSuccess: () => {
            toast({ description: 'Otp mail template has been updated successfully' })
            queryClient.invalidateQueries({
                queryKey: ['mailTemplates']
            })
        }

    })
    // Update selected template on change prop
    useEffect(() => {
        if (selectedTemplate) {
            setActive(selectedTemplate)
        }
    }, [selectedTemplate])
    return (
        <div className='flex flex-col'>
            <div className="flex gap-2 items-center">
                <div className="h-3 w-0.5 bg-foreground rounded-full"></div>
                <p className='text-sm text-foreground'>OTP mail templates</p>
            </div>
            <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
                {otpMailTemplates.map((template, index) => (
                    <div key={index} onClick={() => { setActive(template.id), updateMailTemplate(template.id) }} className={cn('relative border-2 p-1 rounded-md cursor-pointer hover:bg-background transition-all', active == template.id && 'bg-background transition-all border-primary')}>
                        <Image src={template.image} width={250} height={250} alt='Email template' className='aspect-video w-full rounded-md object-cover' />
                        <p className='text-md font-medium text-foreground mt-1'>{template.name}</p>
                        <CheckCircle className={cn(`h-5 w-5 text-primary absolute top-2 right-2 bg-background p-0.5 rounded-full hidden ${isUpdateMailTemplatePending && 'animate-spin'}`, active == template.id && 'block')} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OtpTemplates