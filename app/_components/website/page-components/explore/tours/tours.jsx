'use client'
import React from 'react'
import TourCardWide from '../../../common/tour-card-wide'
import { cn } from '@/app/_lib/utils'

const Tours = ({ className }) => {
  return (
    <div className={cn("grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 gap-3 lg:gap-4 h-fit", className)}>
      <TourCardWide />
      <TourCardWide />
      <TourCardWide />
      <TourCardWide />
      <TourCardWide />
      <TourCardWide />
    </div>
  )
}

export default Tours