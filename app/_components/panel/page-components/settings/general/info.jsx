import React, { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { Info, Mail, MapPin, Phone, Text } from 'lucide-react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import InfoSettingsEdit from './edit-info';

const InfoSettings = ({ settings }) => {
  // Count non-empty fields
  let nonEmptyFieldCount = 0;
  for (const key in settings.general.info) {
    if (settings.general.info.hasOwnProperty(key) && settings.general.info[key] !== "") {
      nonEmptyFieldCount++;
    }
  }
  // Open state for edit info settings
  const [isInfoSettingsEditOpen, setIsInfoSettingsEditOpen] = useState(false)
  return (
    <>
      <Card>
        <CardHeader>
          <Info className='w-10 h-10 text-violet-500 border p-1.5 rounded-md mb-2' />
          <CardTitle size='lg' className='flex items-end gap-2 justify-between'>Contact Info <Button variant='outline' size='sm' className='h-6 rounded-sm' onClick={() => { setIsInfoSettingsEditOpen(true) }}>Edit</Button></CardTitle>
          <CardDescription>Contact information help user to contact you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {settings.general?.info?.inquiryMail && <div className="flex gap-3 items-center">
              <Mail className='w-4 h-4' />
              <p className='text-sm'>{settings.general.info.inquiryMail}</p>
            </div>}
            {settings.general?.info?.inquiryPhone && <div className="flex gap-3 items-center">
              <Phone className='w-4 h-4' />
              <p className='text-sm'>{settings.general.info.inquiryPhone} <span className='text-xs text-muted-foreground'>(Primary)</span></p>
            </div>}
            {settings.general?.info?.inquiryPhone2 && <div className="flex gap-3 items-center">
              <Phone className='w-4 h-4' />
              <p className='text-sm'>{settings.general.info.inquiryPhone2} <span className='text-xs text-muted-foreground'>(Secondary)</span></p>
            </div>}
            {settings.general?.info?.whatsappPhone && <div className="flex gap-3 items-center">
              <Image src='/panel/images/whatsapp.png' width={50} height={50} alt='whatsapp' className='w-5 h-5 min-w-[1rem] dark:invert' />
              <p className='text-sm'>{settings.general.info.whatsappPhone}</p>
            </div>}
            {settings.general?.info?.address && <div className="flex gap-3 items-start">
              <MapPin className='w-4 h-4 min-w-[1rem]' />
              <p className='text-sm -m-1'>{settings.general.info.address}</p>
            </div>}
            {settings.general?.info?.footerPara && <div className="flex gap-3 items-start">
              <Text className='w-4 h-4 min-w-[1rem]' />
              <p className='text-sm -m-1'>{settings.general.info.footerPara}</p>
            </div>}
          </div>
          {nonEmptyFieldCount == 0 && <p className='text-base text-muted-foreground'>No contact info found. Please add one.</p>}
        </CardContent>
      </Card>
      <InfoSettingsEdit settings={settings} open={isInfoSettingsEditOpen} setOpen={setIsInfoSettingsEditOpen} />
    </>
  )
}

export default InfoSettings