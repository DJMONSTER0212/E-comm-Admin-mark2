'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import Breadcrumbs from '@/app/_components/ui/breadcrumbs';
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu"
import GeneralCoupon from '@/app/_components/panel/page-components/coupons/general/general';
import NotFound from '@/app/_components/ui/not-found';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Message from '@/app/_components/ui/message';
import CouponUsages from '@/app/_components/panel/page-components/coupons/usages/usages';

const Page = ({ params }) => {
    // Fetch coupon
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['coupons', params.couponId],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/coupons/${params.couponId}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        retry: false
    })
    if (!params.couponId) {
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
                            title: 'Coupons',
                            link: '/panel/coupons'
                        },
                        {
                            title: data?.coupon.toUpperCase(),
                        },
                    ]}
                />
            }
            {isPending && 'Loading...'}
            {isSuccess && data &&
                <Tabs defaultValue="general" className="w-full mt-5">
                    <TabsList className='flex justify-between md:justify-start md:w-fit'>
                        <TabsTrigger value="general" className='data-[state=inactive]:hidden md:data-[state=inactive]:block'>General</TabsTrigger>
                        <TabsTrigger value="couponUsages" className='data-[state=inactive]:hidden md:data-[state=inactive]:block'>Coupon usages</TabsTrigger>
                        <div className="md:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size='icon' className='rounded-md shadow-sm ml-1 h-auto w-auto p-2 bg-background hover:bg-background/70 text-foreground data-[state=open]:bg-background/70'><MoreHorizontal className='w-4 h-4' /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end' className='w-[150px] bg-muted'>
                                    <DropdownMenuItem asChild><TabsTrigger value="general" className='px-3 w-full justify-start'>General</TabsTrigger></DropdownMenuItem>
                                    <DropdownMenuItem asChild><TabsTrigger value="couponUsages" className='px-3 w-full justify-start'>Coupon usages</TabsTrigger></DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </TabsList>
                    <TabsContent value="general"><GeneralCoupon coupon={data} /></TabsContent>
                    <TabsContent value="couponUsages"><CouponUsages coupon={data} /></TabsContent>
                </Tabs>
            }
            {isSuccess && !data &&
                <NotFound />
            }
        </div>
    )
}

export default Page
