import React from 'react'
import ContactUsForm from '@/app/_components/website/page-components/contact-us/form'

const page = () => {
  return (
    <>
      <div className="mb-7">
        <h1 className='text-3xl font-bold text-foreground'>Contact us</h1>
        <p className='text-base text-muted-foreground mt-1.5'>Write to us and we wll connect to you shortly.</p>
      </div>
      <ContactUsForm />
    </>
  )
}

export default page