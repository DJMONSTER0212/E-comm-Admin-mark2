import React from 'react'
import TourItineraryItems from './itinerary-items';
import TourItineraryDetails from './itinerary-details';

const TourItinerary = ({ tour }) => {
    return (
        <div className="grid grid-cols-1 gap-5 mt-5">
            <TourItineraryDetails tour={tour} />
            <TourItineraryItems tour={tour} />
        </div>
    )
}

export default TourItinerary