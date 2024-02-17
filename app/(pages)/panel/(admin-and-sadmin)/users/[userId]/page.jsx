'use client'
import React from 'react'
import Breadcrumbs from '@/app/_components/ui/breadcrumbs'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Message from '@/app/_components/ui/message';
import EditUser from '@/app/_components/panel/page-components/users/edit';
import DeleteUser from '@/app/_components/panel/page-components/users/delete';
import ChangeUserPassword from '@/app/_components/panel/page-components/users/change-password';
import NotFound from '@/app/_components/ui/not-found';

const Page = ({ params }) => {
    // Fetch users
    const { data, error, isPending, isSuccess } = useQuery({
        queryKey: ['users', params.userId],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/users/${params.userId}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        retry: false
    })
    if (!params.userId) {
        return <NotFound />
    }
    return (
        <div className='mx-4'>
            <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
            {!error && data &&
                <Breadcrumbs
                    className='mb-5'
                    loading={isPending}
                    breadcrumbs={[
                        {
                            title: 'Users',
                            link: '/panel/users'
                        },
                        {
                            title: data?.name,
                        },
                    ]}
                />
            }
            {isPending && 'Loading...'}
            {isSuccess && data &&
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <EditUser user={data} />
                    <div className="grid grid-cols-1 gap-5 h-fit">
                        <ChangeUserPassword user={data} />
                        <DeleteUser user={data} />
                    </div>
                </div>
            }
            {isSuccess && !data &&
                <NotFound />
            }
        </div>
    )
}

export default Page