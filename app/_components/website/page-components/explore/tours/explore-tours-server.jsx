import React from 'react'
import ExploreTours from './explore-tours'

const getValueAfter5Seconds = ({ params }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(params.location);
        }, 5000);
    });
};

const ExploreToursServer = async ({ searchParams, params }) => {
    const value = await getValueAfter5Seconds({ params });
    if (value) {
        return (
            <ExploreTours value={value} />
        )
    }
    return null
}

export default ExploreToursServer
