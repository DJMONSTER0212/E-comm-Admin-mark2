import React from 'react'
import S3Details from './s3-details/s3-details'
import ActivateTourBooking from './tour/activate-booking'
import ActivateRentedCarBooking from './rented-car/activate-booking'

const OtherSettings = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
            <S3Details />
            <ActivateTourBooking />
            <ActivateRentedCarBooking />
        </div>
    )
}

export default OtherSettings