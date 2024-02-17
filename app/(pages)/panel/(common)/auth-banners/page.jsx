import React, { Suspense } from 'react'
import Breadcrumbs from '@/app/_components/ui/breadcrumbs'
import AuthBannersTable from '@/app/_components/panel/page-components/auth-banners/table'

const Page = () => {
  return (
    <div className='mx-4'>
      <Breadcrumbs
        className='mb-5'
        breadcrumbs={[
          {
            title: 'Auth banners',
            link: '/panel/auth-banners'
          }
        ]}
      />
      <Suspense>
        <AuthBannersTable />
      </Suspense>
    </div>
  )
}

export default Page