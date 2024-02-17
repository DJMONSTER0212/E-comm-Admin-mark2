import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import { Globe, Loader2 } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import { Badge } from '@/app/_components/ui/badge'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/app/_components/ui/use-toast'
import axios from 'axios'

const Country = ({ country }) => {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    // Toggle country
    const { mutate: toggleCountry, isPending: isToggleCountryPending } = useMutation({
        mutationFn: async (country) => {
            try {
                const { data } = await axios.patch(`/api/panel/countries/${country._id}`, { isActive: country.isActive ? false : true })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['countries'],
            })
            toast({ description: `${variables.name} has been ${variables.isActive ? 'deactivated' : 'activated'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    return (
        <Card>
            <CardHeader>
                <Globe className='w-10 h-10 text-primary border p-1.5 rounded-md mb-2' />
                <CardTitle size='lg'>{country.name}</CardTitle>
                <CardDescription>Manage states, cities and tours for {country.name} to make easy travel for user. </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-1 mt-2">
                    <Badge className='font-normal'>{country.totalStates} States</Badge>
                    <Badge className='bg-orange-500 font-normal'>{country.totalCities} Cities</Badge>
                    <Badge className='bg-green-500 font-normal'>25 Tours</Badge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2 items-center mt-3">
                    <Link href={`/panel/locations/${country._id}`} className='block w-full'><Button variant='outline' className='w-full' size='sm'>Manage country</Button></Link>
                    <Button onClick={() => { toggleCountry(country) }} variant={country.isActive ? 'destructive' : 'default'} className='w-full' size='sm' disabled={isToggleCountryPending}>
                        {isToggleCountryPending ?
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                            : country.isActive ? 'Deactivate' : 'Activate'
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default Country