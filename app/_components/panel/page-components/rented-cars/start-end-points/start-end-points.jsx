import React from 'react'
import StartPoints from './start-points'
import EndPoints from './end-points'

const RentedCarStartEndPoints = ({ rentedCar }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
            <StartPoints rentedCar={rentedCar} />
            <EndPoints rentedCar={rentedCar} />
        </div>
    )
}

export default RentedCarStartEndPoints