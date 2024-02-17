import React from 'react'
import TourIncludes from './includes';
import TourAdditionalInfo from './additional-info';

const TourInformative = ({ tour }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
            <TourIncludes tour={tour} />
            <div className="grid grid-cols-1 gap-5 h-fit">
                <TourAdditionalInfo tour={tour} />
            </div>
        </div>
    )
}

export default TourInformative