import React, { Suspense } from 'react'
import HomepageBanner from '@/app/_components/website/page-components/homepage/banner'
import WhyUs from '@/app/_components/website/page-components/homepage/why-us'
import PopularTourCities from '@/app/_components/website/page-components/homepage/popular-tour-cities'
import HotelBanner from '@/app/_components/website/common/hotel-banner'
import PopularTours from '@/app/_components/website/page-components/homepage/popular-tours'
import RentedCars from '@/app/_components/website/page-components/homepage/rented-cars'

const Page = () => {
  return (
    <>
      <Suspense><HomepageBanner /></Suspense>
      <WhyUs />
      <PopularTourCities />
      <PopularTours />
      <HotelBanner />
      <RentedCars />
    </>
  )
}

export default Page