import React, { Suspense } from 'react'
import Breadcrumbs from '@/app/_components/ui/breadcrumbs'
import UsersTable from '@/app/_components/panel/page-components/users/table'

const Page = () => {
  return (
    <div className='mx-4'>
      <Breadcrumbs
        className='mb-5'
        breadcrumbs={[
          {
            title: 'Users',
            link: '/panel/users'
          }
        ]}
      />
      <Suspense>
        <UsersTable />
      </Suspense>
    </div>
  )
}

export default Page