import React from 'react'
import ExploreRentedCars from './explore-rented-cars';

const getValueAfter5Seconds = ({ params }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(params.location);
        }, 5000);
    });
};

const ExploreRentedCarsServer = async ({ searchParams, params }) => {
    const value = await getValueAfter5Seconds({ params });
    if (value) {
        return (
            <ExploreRentedCars value={value} />
        )
    }
    return null
}

export default ExploreRentedCarsServer
