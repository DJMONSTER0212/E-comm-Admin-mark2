import React from 'react'
import EditTour from './edit';
import TourStartEndPoint from './start-end-point';
import DeleteTour from './delete';
import TourSeo from './seo';

const GeneralTour = ({ tour }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            <EditTour tour={tour} />
            <div className="grid grid-cols-1 gap-5 h-fit">
                <TourStartEndPoint tour={tour} />
                <TourSeo tour={tour} />
                <DeleteTour tour={tour} />
            </div>
        </div>
    )
}

export default GeneralTour