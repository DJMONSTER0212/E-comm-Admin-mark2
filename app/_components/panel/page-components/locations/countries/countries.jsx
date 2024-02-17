'use client'
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import AddCountry from './add'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Message from '@/app/_components/ui/message'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import Country from './country'

const Countries = () => {
  // Fetch countries
  const { data, error, isPending, isSuccess } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/panel/countries?totalStates=true&totalCities=true',)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    }
  })
  // Open state for add country
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false)
  return (
    <>
      <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
      {isPending && 'Loading...'}
      {isSuccess &&
        <>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-3">
            {data.map((country, index) => (
              <Country key={index} country={country} />
            ))}
            <Card className="bg-primary rounded-md flex flex-col shadow-sm">
              <CardHeader className='flex-1'>
                <Plus className='w-10 h-10 text-primary bg-background p-1.5 rounded-md mb-2' />
                <CardTitle size='lg' className='text-primary-foreground'>Add a country</CardTitle>
                <CardDescription className='text-primary-foreground'>Add a country to manage states, cities and tours for that country and use advance features like blocking booking for a city, state or country.</CardDescription>
              </CardHeader>
              <CardContent c>
                <div className="flex gap-2 items-center mt-3">
                  <Button variant='default' onClick={() => { setIsAddCountryOpen(true) }} className='w-full bg-background hover:bg-background/90 text-foreground' size='sm'>Add a country</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <AddCountry open={isAddCountryOpen} setOpen={setIsAddCountryOpen} />
        </>
      }
    </>
  )
}

export default Countries