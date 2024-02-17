import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Loader2 } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import axios from 'axios'
import { useToast } from '@/app/_components/ui/use-toast'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardIcon
} from "@/app/_components/ui/card"

const CredentialMethod = ({ method }) => {
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
                <CardIcon><User className='w-10 h-10 text-primary' /></CardIcon>
                <CardTitle size='base'>Email & Password</CardTitle>
                <CardDescription>This will allow user to sign in using email & password.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 items-center">
                    {method ?
                        <Button onClick={() => { toggleMethod(method) }} variant={method.isActive ? 'destructive' : 'default'} className='w-full' size='sm' disabled={isToggleMethodPending}>
                            {isToggleMethodPending ?
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                : method.isActive ? 'Deactivate' : 'Activate'
                            }
                        </Button> :
                        <Button className='w-full' size='sm' disabled>Currently not availbale</Button>
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default CredentialMethod