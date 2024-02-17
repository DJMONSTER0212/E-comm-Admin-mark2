'use client'
import React from 'react'
import { Server, Loader2 } from 'lucide-react'
import EditS3Details from './edit'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '@/app/_components/ui/button'
import { useToast } from '@/app/_components/ui/use-toast'
import axios from 'axios'
import Message from '@/app/_components/ui/message'
import S3DetailsSkel from './skelton/s3-details'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardIcon
} from "@/app/_components/ui/card"
const S3Details = () => {
    const { toast } = useToast()
    // Fetch settings
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['s3Details'],
        queryFn: async () => {
            try {
                const { data } = await axios.get('/api/panel/settings/s3',)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        }
    })
    // Toggle S3
    const { mutate: toggleS3, isPending: isToggleS3Pending } = useMutation({
        mutationFn: async (isActive) => {
            try {
                const { data } = await axios.patch(`/api/panel/settings/s3`, { isActive })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            refetch()
            toast({ description: `S3 service ${variables ? 'activated' : 'deactivated'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    return (
        <div className='lg:col-span-2'>
            <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
            {isPending && <S3DetailsSkel />}
            {isSuccess &&
                <Card className="h-fit">
                    <CardHeader>
                        <CardIcon><Server className='w-10 h-10 text-orange-500' /></CardIcon>
                        <CardTitle size='lg'>S3 Service Setup</CardTitle>
                        <CardDescription>S3 service will be used for storing files such as images, docs, etc. <span className='text-foreground font-medium'>It is highly recommended to setup the S3 for an better workflow.</span></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 items-center mt-3">
                            {data.s3Details ?
                                <>
                                    <EditS3Details s3Details={data.s3Details} />
                                    <Button onClick={() => { toggleS3(data.s3Details.isActive ? false : true) }} variant={data.s3Details.isActive ? 'destructive' : 'default'} className='w-full' size='sm' disabled={isToggleS3Pending}>
                                        {isToggleS3Pending ?
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                            : data.s3Details.isActive ? 'Deactivate' : 'Activate'
                                        }
                                    </Button>
                                </> :
                                <EditS3Details s3Details={data.s3Details} />
                            }
                        </div>
                    </CardContent>
                </Card>
            }
        </div>
    )
}

export default S3Details