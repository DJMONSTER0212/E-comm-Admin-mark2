import React, { Suspense } from 'react'
import TourDatesTable from './table';

const TourDates = ({ tour }) => {
    return (
        <div className="grid grid-cols-1 gap-5 mt-5">
            <Suspense>
                <TourDatesTable tour={tour} />
            </Suspense>
        </div>
    )
}

export default TourDates