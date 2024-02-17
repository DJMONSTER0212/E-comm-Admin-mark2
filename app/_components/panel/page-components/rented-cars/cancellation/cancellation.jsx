import React from 'react'
import RentedCarCancellationRules from './cancellation-rules';

const RentedCarCancellation = ({ rentedCar }) => {
    return (
        <div className="grid grid-cols-1 gap-5 mt-5">
            <RentedCarCancellationRules rentedCar={rentedCar} />
        </div>
    )
}

export default RentedCarCancellation