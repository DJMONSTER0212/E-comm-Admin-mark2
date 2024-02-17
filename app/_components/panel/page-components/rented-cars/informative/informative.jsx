import React from 'react'
import RentedCarIncludes from './includes';
import RentedCarAdditionalInfo from './additional-info';

const RentedCarInformative = ({ rentedCar }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
            <RentedCarIncludes rentedCar={rentedCar} />
            <div className="grid grid-cols-1 gap-5 h-fit">
                <RentedCarAdditionalInfo rentedCar={rentedCar} />
            </div>
        </div>
    )
}

export default RentedCarInformative