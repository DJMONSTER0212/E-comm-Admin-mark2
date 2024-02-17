'use client'
import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FerrisWheel, Loader2 } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import axios from 'axios'
import { useToast } from '@/app/_components/ui/use-toast'
import Message from '@/app/_components/ui/message'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardIcon
} from "@/app/_components/ui/card"
import { useSession } from 'next-auth/react';

const ActivateTourBooking = () => {
    const { data: session } = useSession();
    const { toast } = useToast()
    // Fetch settings
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['tour-settings'],
        queryFn: async () => {
            try {
                const { data } = await axios.get('/api/panel/settings/tour',)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        }
    })
    // Toggle auto confirm booking
    const { mutate: toggleAutoConfirmBooking, isPending: isToggleAutoConfirmBookingPending } = useMutation({
        mutationFn: async (autoConfirmBooking) => {
            try {
                const { data } = await axios.put(`/api/panel/settings/tour/`, { autoConfirmBooking })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            refetch()
            toast({ description: `Auto confirm booking has been ${variables.autoConfirmBooking ? 'activated' : 'deactivated'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    // Authentication 
    if (!session || !session.user.role == 'admin') {
        return ('These are admin only settings.')
    }
    return (
        <div>
            <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
            {isPending && 'Loading...'}
            {isSuccess &&
                <Card className="h-fit">
                    <CardHeader>
                        <CardIcon><FerrisWheel className='w-10 h-10 text-primary' /></CardIcon>
                        <CardTitle size='base'>Auto confirm tour booking</CardTitle>
                        <CardDescription>Allow will send the confirmation mail instantly after the successful payment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 items-center mt-3">
                            <Button onClick={() => { toggleAutoConfirmBooking(data.tour?.autoConfirmBooking ? false : true) }} variant={data.tour?.autoConfirmBooking ? 'destructive' : 'default'} className='w-full' size='sm' disabled={isToggleAutoConfirmBookingPending}>
                                {isToggleAutoConfirmBookingPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : data.tour?.autoConfirmBooking ? 'Deactivate' : 'Activate'
                                }
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            }
        </div>
    )
}

export default ActivateTourBooking