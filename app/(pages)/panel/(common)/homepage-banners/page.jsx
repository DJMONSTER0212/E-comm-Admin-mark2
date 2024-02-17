import React, { Suspense } from 'react'
import Breadcrumbs from '@/app/_components/ui/breadcrumbs'
import HomepageBannersTable from '@/app/_components/panel/page-components/homepage-banners/table'

const Page = () => {
  return (
    <div className='mx-4'>
      <Breadcrumbs
        className='mb-5'
        breadcrumbs={[
          {
            title: 'Homepage banners',
            link: '/panel/homepage-banners'
          }
        ]}
      />
      <Suspense>
        <HomepageBannersTable />
      </Suspense>
    </div>
  )
}

export default Page