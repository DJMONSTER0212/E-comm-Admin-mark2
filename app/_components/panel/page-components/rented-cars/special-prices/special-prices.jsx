import React, { Suspense } from 'react'
import RentedCarSpecialPricesTable from './table';

const RentedCarSpecialPrices = ({ rentedCar }) => {
    return (
        <div className="grid grid-cols-1 gap-5 mt-5">
            <Suspense>
                <RentedCarSpecialPricesTable rentedCar={rentedCar} />
            </Suspense>
        </div>
    )
}

export default RentedCarSpecialPrices