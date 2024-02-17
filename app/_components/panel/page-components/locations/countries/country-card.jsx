import React, { useState } from 'react'
import { Globe, Loader2, ExternalLink } from 'lucide-react'
import { Badge } from '@/app/_components/ui/badge'
import Link from 'next/link'
import { Button } from '@/app/_components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import EditCountry from './edit'
import { useToast } from '@/app/_components/ui/use-toast'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"

const CountryCard = ({ country }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
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
    // Open state for edit country
    const [isEditCountryOpen, setIsEditCountryOpen] = useState(false)
    return (
        <div className='order-1 lg:order-2'>
            <Card>
                <CardHeader>
                    <Globe className='w-10 h-10 text-primary border p-1.5 rounded-md mb-2' />
                    <CardTitle>{country.name}</CardTitle>
                    <CardDescription>Manage states, cities and tours for {country.name} to make easy travel for user. </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                        <Badge className='font-normal'>{country.totalStates} States</Badge>
                        <Badge className='bg-orange-500 font-normal'>{country.totalCities} Cities</Badge>
                        <Badge className='bg-green-500 font-normal'>25 Tours</Badge>
                    </div>
                    <div className="flex gap-2 my-4">
                        <Link href='/' passHref><Button variant='default' size='sm' className='h-8 w-fit text-primary bg-primary/20 hover:bg-primary/30'>Tours <ExternalLink className='ml-2 w-3 h-3' /></Button></Link>
                        <Link href='/' passHref><Button variant='default' size='sm' className='h-8 w-fit text-orange-500 bg-orange-500/20 hover:bg-orange-500/30'>Bookings <ExternalLink className='ml-2 w-3 h-3' /></Button></Link>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 items-center">
                        <Button onClick={() => { setIsEditCountryOpen(true) }} variant='outline' className='w-full'>Edit country</Button>
                        <Button onClick={() => { toggleCountry(country) }} variant={country.isActive ? 'destructive' : 'default'} className='w-full' disabled={isToggleCountryPending}>
                            {isToggleCountryPending ?
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                : country.isActive ? 'Deactivate' : 'Activate'
                            }
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <EditCountry country={country} open={isEditCountryOpen} setOpen={setIsEditCountryOpen} />
        </div>
    )
}

export default CountryCard