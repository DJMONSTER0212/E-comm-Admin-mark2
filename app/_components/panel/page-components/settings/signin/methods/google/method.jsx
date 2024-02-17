import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import axios from 'axios'
import { useToast } from '@/app/_components/ui/use-toast'
import Image from 'next/image'
import EditGoogleOauth from './edit'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardIcon
} from "@/app/_components/ui/card"
const GoogleMethod = ({ method }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast()
    // Toggle method
    const { mutate: toggleMethod, isPending: isToggleMethodPending } = useMutation({
        mutationFn: async (method) => {
            try {
                const { data } = await axios.patch(`/api/panel/settings/signin-methods/${method._id}`, { isActive: method.isActive ? false : true })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['signinMethods'],
            })
            toast({ description: `Sign in method ${variables.isActive ? 'activated' : 'deactivated'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    return (
        <Card className='flex flex-col'>
            <CardHeader className='flex-1'>
                <CardIcon><Image src='/panel/images/google.png' width={45} height={45} alt='Google' /></CardIcon>
                <CardTitle size='base'>Google OAuth</CardTitle>
                <CardDescription>This will allow user to sign in using Google.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 items-center">
                    {method ?
                        <>
                            <EditGoogleOauth method={method} />
                            <Button onClick={() => { toggleMethod(method) }} variant={method.isActive ? 'destructive' : 'default'} className='w-full' size='sm' disabled={isToggleMethodPending}>
                                {isToggleMethodPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : method.isActive ? 'Deactivate' : 'Activate'
                                }
                            </Button>
                        </> :
                        <EditGoogleOauth method={method} />
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default GoogleMethod