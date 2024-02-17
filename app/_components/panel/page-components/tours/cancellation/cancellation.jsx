import React from 'react'
import TourCancellationRules from './cancellation-rules';

const TourCancellation = ({ tour }) => {
    return (
        <div className="grid grid-cols-1 gap-5 mt-5">
            <TourCancellationRules tour={tour} />
        </div>
    )
}

export default TourCancellation