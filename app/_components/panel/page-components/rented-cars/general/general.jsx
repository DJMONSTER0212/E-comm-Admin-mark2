import React from 'react'
import EditRentedCar from './edit';
import TourStartEndPoint from './start-end-point';
import DeleteRentedCar from './delete';
import RentedCarSeo from './seo';
import CarDetails from './car-details';

const GeneralRentedCar = ({ rentedCar }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            <EditRentedCar rentedCar={rentedCar} />
            <div className="grid grid-cols-1 gap-5 h-fit">
                <CarDetails rentedCar={rentedCar} />
                <RentedCarSeo rentedCar={rentedCar} />
                <DeleteRentedCar rentedCar={rentedCar} />
                {/* <TourStartEndPoint tour={tour} /> */}
            </div>
        </div>
    )
}

export default GeneralRentedCar