import React, { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import { CarTaxiFront, FerrisWheel } from 'lucide-react'
import TourSearch from './tour-search'
import RentedCarSearch from './rented-car-search'

const Search = () => {
    return (
        <div className='max-w-full mx-auto'>
            <Tabs defaultValue="tour" className='space-x-0'>
                <TabsList className='rounded-none bg-background rounded-t-md p-0 h-auto border-t border-l border-r gap-0.5'>
                    <TabsTrigger value="tour" className='py-3 px-4 rounded-none rounded-tl-md focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-background bg-foreground data-[state=active]:text-foreground text-background'><FerrisWheel className='w-4 h-4 mr-2' /> Tour</TabsTrigger>
                    <TabsTrigger value="rentedCar" className='py-3 px-4 rounded-none rounded-tr-md focus-visible:ring-offset-0 data-[state=active]:shadow-none data-[state=active]:bg-background bg-foreground data-[state=active]:text-foreground text-background'><CarTaxiFront className='w-4 h-4 mr-2' /> Rent car</TabsTrigger>
                </TabsList>
                <div className="bg-background py-3 px-3 rounded-b-md rounded-tr-md border-b border-l border-r">
                    <TabsContent value="tour" className='mt-0' asChild>
                        {/* // Keep this extra div to avoid ref error in console */}
                        <div>
                            <TourSearch />
                        </div>
                    </TabsContent>
                    <TabsContent value="rentedCar" className='mt-0' asChild>
                        {/* // Keep this extra div to avoid ref error in console */}
                        <div>
                            <RentedCarSearch />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default Search