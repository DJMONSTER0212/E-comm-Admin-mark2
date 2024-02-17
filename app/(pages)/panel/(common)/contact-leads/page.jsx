import React, { Suspense } from 'react'
import Breadcrumbs from '@/app/_components/ui/breadcrumbs'
import ContactLeadsTable from '@/app/_components/panel/page-components/contact-leads/table'

const Page = () => {
  return (
    <div className='mx-4'>
      <Breadcrumbs
        className='mb-5'
        breadcrumbs={[
          {
            title: 'Contact leads',
            link: '/panel/contact-leads'
          }
        ]}
      />
      <Suspense>
        <ContactLeadsTable />
      </Suspense>
    </div>
  )
}

export default Page