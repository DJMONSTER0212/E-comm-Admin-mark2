'use client'
import React from 'react'
import RentedCarWide from '../../../common/rented-car-wide'
import { cn } from '@/app/_lib/utils'

const RentedCars = ({ className }) => {
  return (
    <div className={cn("grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 gap-3 lg:gap-4 h-fit", className)}>
      <RentedCarWide />
      <RentedCarWide />
      <RentedCarWide />
      <RentedCarWide />
      <RentedCarWide />
      <RentedCarWide />
    </div>
  )
}

export default RentedCars