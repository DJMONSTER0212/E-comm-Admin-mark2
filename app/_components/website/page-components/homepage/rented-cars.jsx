import React from 'react'
import ArrowLink from '@/app/_components/ui/arrow-link'
import RentedCar from '../../common/rented-car'

const RentedCars = () => {
    return (
        <div className='max-w-screen-xl mx-auto p-screen mt-20'>
            <div className="flex flex-col xs:flex-row gap-y-2 gap-x-5 items-start xs:items-center justify-between">
                <p className='text-3xl font-bold leading-[1.5]'>Popular rented cars</p>
                <ArrowLink href='/'>Explore more</ArrowLink>
            </div>
            <div className="grid gap-7 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-between items-start mt-10">
                <RentedCar />
                <RentedCar />
                <RentedCar />
                <RentedCar />
            </div>
        </div>
    )
}

export default RentedCars