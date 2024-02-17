import React, { Suspense } from 'react'
import Breadcrumbs from '@/app/_components/ui/breadcrumbs'
import CouponsTable from '@/app/_components/panel/page-components/coupons/table'

const Page = () => {
  return (
    <div className='mx-4'>
      <Breadcrumbs
        className='mb-5'
        breadcrumbs={[
          {
            title: 'Coupons',
            link: '/panel/coupons'
          }
        ]}
      />
      <Suspense>
        <CouponsTable />
      </Suspense>
    </div>
  )
}

export default Page