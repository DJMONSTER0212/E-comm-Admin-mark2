import React, { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { ExternalLink, Facebook, Instagram, Linkedin, Radio, X, Youtube } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import SocialSettingsEdit from './edit-social';

const SocialSettings = ({ settings }) => {
  // Count non-empty fields
  let nonEmptyFieldCount = 0;
  for (const key in settings.general.social) {
    if (settings.general.social.hasOwnProperty(key) && settings.general.social[key] !== "") {
      nonEmptyFieldCount++;
    }
  }
  // Open state for edit social settings
  const [isSocialSettingsEditOpen, setIsSocialSettingsEditOpen] = useState(false)
  return (
    <>
      <Card>
        <CardHeader>
          <Radio className='w-10 h-10 text-orange-500 border p-1.5 rounded-md mb-2' />
          <CardTitle size='lg' className='flex items-end gap-2 justify-between'>Social media handles <Button variant='outline' size='sm' className='h-6 rounded-sm' onClick={() => { setIsSocialSettingsEditOpen(true) }}>Edit</Button></CardTitle>
          <CardDescription>Social media handles help you to connect with your users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {settings.general?.social?.facebook && <div className="flex gap-3 items-center bg-blue-100 dark:bg-blue-900 rounded-md p-2">
              <Facebook className='w-4 h-4 text-blue-600 dark:text-blue-100' />
              <p className='text-sm text-blue-600 dark:text-blue-100 flex-1'>Facebook</p>
              <Link href={settings.general.social.facebook} target='_blank'><ExternalLink className='w-4 h-4 text-blue-600 dark:text-blue-100 cursor-pointer' /></Link>
            </div>}
            {settings.general?.social?.instagram && <div className="flex gap-3 items-center bg-pink-100 dark:bg-pink-800 rounded-md p-2">
              <Instagram className='w-4 h-4 text-pink-600 dark:text-pink-100' />
              <p className='text-sm text-pink-600 dark:text-pink-100 flex-1'>Instagram</p>
              <Link href={settings.general.social.instagram} target='_blank'><ExternalLink className='w-4 h-4 text-pink-600 dark:text-pink-100 cursor-pointer' /></Link>
            </div>}
            {settings.general?.social?.x && <div className="flex gap-3 items-center bg-gray-100 dark:bg-gray-800 rounded-md p-2">
              <X className='w-4 h-4 text-gray-600 dark:text-gray-100' />
              <p className='text-sm text-gray-600 dark:text-gray-100 flex-1'>X</p>
              <Link href={settings.general.social.x} target='_blank'><ExternalLink className='w-4 h-4 text-gray-600 dark:text-gray-100 cursor-pointer' /></Link>
            </div>}
            {settings.general?.social?.linkedin && <div className="flex gap-3 items-center bg-blue-100 dark:bg-blue-800 rounded-md p-2">
              <Linkedin className='w-4 h-4 text-blue-600 dark:text-blue-100' />
              <p className='text-sm text-blue-600 dark:text-blue-100 flex-1'>Linkedin</p>
              <Link href={settings.general.social.linkedin} target='_blank'><ExternalLink className='w-4 h-4 text-blue-600 dark:text-blue-100 cursor-pointer' /></Link>
            </div>}
            {settings.general?.social?.peerlist && <div className="flex gap-3 items-center bg-green-100 dark:bg-green-800 rounded-md p-2">
              <p className='text-base h-5 -mt-1.5 overflow-hidden font-semibold text-green-600 dark:text-green-100'>P</p>
              <p className='text-sm text-green-600 dark:text-green-100 flex-1'>Peerlist</p>
              <Link href={settings.general.social.peerlist} target='_blank'><ExternalLink className='w-4 h-4 text-green-600 dark:text-green-100 cursor-pointer' /></Link>
            </div>}
            {settings.general?.social?.youtube && <div className="flex gap-3 items-center bg-red-100 dark:bg-red-900 rounded-md p-2">
              <Youtube className='w-4 h-4 text-red-600 dark:text-red-100' />
              <p className='text-sm text-red-600 dark:text-red-100 flex-1'>Youtube</p>
              <Link href={settings.general.social.youtube} target='_blank'><ExternalLink className='w-4 h-4 text-red-600 dark:text-red-100 cursor-pointer' /></Link>
            </div>}
            {settings.general?.social?.google && <div className="flex gap-3 items-center bg-yellow-100 dark:bg-yellow-800 rounded-md p-2">
              <p className='text-base h-5 -mt-1.5 overflow-hidden font-semibold text-yellow-600 dark:text-yellow-100'>G</p>
              <p className='text-sm text-yellow-600 dark:text-yellow-100 flex-1'>Google</p>
              <ExternalLink className='w-4 h-4 text-yellow-600 dark:text-yellow-100 cursor-pointer' />
              <Link href={settings.general.social.google} target='_blank'><ExternalLink className='w-4 h-4 text-yellow-600 dark:text-yellow-100 cursor-pointer' /></Link>
            </div>}
          </div>
          {nonEmptyFieldCount == 0 && <p className='text-base text-muted-foreground'>No social media handles info found. Please add one.</p>}
        </CardContent>
      </Card >
      <SocialSettingsEdit settings={settings} open={isSocialSettingsEditOpen} setOpen={setIsSocialSettingsEditOpen} />
    </>
  )
}

export default SocialSettings